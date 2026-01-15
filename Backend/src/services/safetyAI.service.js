const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const IOGP_RULES = require("../constants/iogpRules");

const AI_PROVIDER = (process.env.AI_PROVIDER || "auto").toLowerCase();
const GEMINI_KEY = process.env.GEMINI_API_KEY || null;

const GEMINI_MODEL = normalizeGeminiModel(process.env.GEMINI_MODEL);

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || null;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "meta-llama/Llama-3.2-11B-Vision-Instruct";

const genAI = GEMINI_KEY
  ? new GoogleGenerativeAI(GEMINI_KEY) 
  : null;

function normalizeGeminiModel(raw) {

  if (!raw) return "gemini-2.5-flash";

  const trimmed = raw.trim().replace(/\.$/, "");
  
  // Only allow gemini-2.5-flash
  if (trimmed === "gemini-2.5-flash") return trimmed;
  return "gemini-2.5-flash";
}


//   MAIN ENTRY (Gemini → OpenRouter fallback)

async function analyzeSafety({ imageBase64, imageMimeType, text, siteType }) {
  if (!text && !imageBase64) return null;

  const contentType = imageBase64 && text
    ? "image+text"
    : imageBase64
    ? "image-only"
    : "text-only";

  //  Try Gemini first
  if (genAI && AI_PROVIDER !== "openrouter") {
    const geminiResult = await analyzeWithGemini({
      imageBase64,
      imageMimeType,
      text,
      siteType,
      contentType
    });

    if (geminiResult) {
      geminiResult.content_type = geminiResult.content_type || contentType;
      return geminiResult;
    }
  }

  // Fallback to OpenRouter (TEXT ONLY)
  if (OPENROUTER_KEY && text) {
    const openRouterResult = await analyzeWithOpenRouter({
      imageBase64,
      imageMimeType,
      text,
      siteType,
      contentType
    });

    if (openRouterResult) {
      openRouterResult.content_type = openRouterResult.content_type || contentType;
      return openRouterResult;
    }
  }

  return null; // advisory only
}

//   GEMINI ANALYSIS (TEXT / IMAGE)
async function analyzeWithGemini({ imageBase64, imageMimeType, text, siteType, contentType }) {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = buildPrompt({ text, siteType, contentType });

    const parts = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType || "image/jpeg",
          data: imageBase64
        }
      });
    }

    parts.push({ text: prompt });

    const result = await model.generateContent(parts);
    const rawText = result?.response?.text?.();

    return safeJsonParse(rawText);

  } catch (err) {
    console.error("❌ Gemini failed, switching to fallback:", err.message);
    return null;
  }
}

// OPENROUTER FALLBACK (TEXT ONLY)
async function analyzeWithOpenRouter({ imageBase64, imageMimeType, text, siteType, contentType }) {
  try {
    const prompt = buildPrompt({ text, siteType, contentType });

    const userContent = [];
    if (imageBase64) {
      userContent.push({
        type: "image_url",
        image_url: {
          url: `data:${imageMimeType || "image/jpeg"};base64,${imageBase64}`
        }
      });
    }
    userContent.push({ type: "text", text: prompt });

    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a Safety Mentor AI trained on IOGP Life-Saving Rules. Respond ONLY in valid JSON."
          },
          {
            role: "user",
            content: userContent
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );

    const content = res.data?.choices?.[0]?.message?.content;
    return safeJsonParse(content);

  } catch (err) {
    console.error("❌ OpenRouter AI failed:", err.message);
    return null;
  }
}

//   PROMPT BUILDER
function buildPrompt({ text, siteType, contentType }) {
  return `
You are a Safety Mentor AI trained on IOGP Life-Saving Rules.

Rules:
- Analyze safety risks only
- Do NOT identify people
- Do NOT assign blame
- Do NOT assume intent
- Focus on injury prevention
- Respond ONLY in valid JSON

Critical prioritization guidance (use this order when both appear plausible):
1) Line of Fire / Struck-by / Suspended Load: if any person is under/near suspended loads, swinging loads, chains, rigging, dropped-object exposure. Always prefer this over Working at Height when the main hazard is being hit or crushed.
2) Energy Isolation / Mechanical: unguarded moving parts, entanglement with chains/shafts/gears, pinch points.
3) Working at Height: only when the person is elevated and could fall; do NOT choose this if the person is on ground near a suspended load.
4) Lifting Operations: rigging, hoisting, crane operations without direct struck-by exposure.
5) PPE issues: only if no higher-risk hazard is present.

If both image and text are provided, first understand the image, then the text, then state whether the text matches what is visible in the image.

Site type: ${siteType}
Content type: ${contentType}

User observation:
"${text || "No text provided"}"

IOGP Life-Saving Rules:
${IOGP_RULES}

Respond in JSON format:
{
  "life_saving_rule_violated": boolean,
  "rule_name": string | null,
  "risk_level": "Low" | "Medium" | "High",
  "observation_summary": string,
  "why_this_is_dangerous": string,
  "mentor_precautions": string[],
  "confidence": number,
  "text_image_aligned": boolean,
  "alignment_reason": string,
  "content_type": "text-only" | "image-only" | "image+text"
}
`;
}

//   SAFE JSON PARSER
function safeJsonParse(text) {
  if (!text) return null;

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // Try to extract the first JSON object from mixed text
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      const slice = cleaned.substring(start, end + 1);
      try {
        return JSON.parse(slice);
      } catch (err2) {
        console.error("❌ AI JSON parse failed after slice:", slice);
        return null;
      }
    }

    console.error("❌ AI JSON parse failed:", cleaned);
    return null;
  }
}

module.exports = { analyzeSafety };
