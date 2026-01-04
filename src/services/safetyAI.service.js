const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const IOGP_RULES = require("../constants/iogpRules");

/**
 * =====================================================
 * 🔧 CONFIG (SAFE DEFAULTS)
 * =====================================================
 */
const GEMINI_KEY = process.env.GEMINI_API_KEY || null;

/**
 * IMPORTANT:
 * Free / stable Gemini text model that actually works with generateContent
 * (avoid experimental names that cause 400/404)
 */
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-1.5-flash-latest"; // text + vision supported

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || null;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "gpt-3.5-turbo"; // free & stable

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

/**
 * =====================================================
 * 🧠 MAIN ENTRY (Gemini → OpenRouter fallback)
 * =====================================================
 */
async function analyzeSafety({ imageBase64, text, siteType }) {
  if (!text && !imageBase64) return null;

  // 1️⃣ Try Gemini first
  if (genAI) {
    const geminiResult = await analyzeWithGemini({
      imageBase64,
      text,
      siteType
    });

    if (geminiResult) return geminiResult;
  }

  // 2️⃣ Fallback to OpenRouter (TEXT ONLY)
  if (OPENROUTER_KEY && text) {
    const openRouterResult = await analyzeWithOpenRouter({
      text,
      siteType
    });

    if (openRouterResult) return openRouterResult;
  }

  return null; // advisory only
}

/**
 * =====================================================
 * 🔵 GEMINI ANALYSIS (TEXT / IMAGE)
 * =====================================================
 */
async function analyzeWithGemini({ imageBase64, text, siteType }) {
  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = buildPrompt({ text, siteType });

    const parts = [];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
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

/**
 * =====================================================
 * 🟣 OPENROUTER FALLBACK (TEXT ONLY)
 * =====================================================
 */
async function analyzeWithOpenRouter({ text, siteType }) {
  try {
    const prompt = buildPrompt({ text, siteType });

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
            content: prompt
          }
        ],
        temperature: 0.2
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    const content = res.data?.choices?.[0]?.message?.content;
    return safeJsonParse(content);

  } catch (err) {
    console.error("❌ OpenRouter AI failed:", err.message);
    return null;
  }
}

/**
 * =====================================================
 * 🧾 PROMPT BUILDER (SHARED)
 * =====================================================
 */
function buildPrompt({ text, siteType }) {
  return `
You are a Safety Mentor AI trained on IOGP Life-Saving Rules.

Rules:
- Analyze safety risks only
- Do NOT identify people
- Do NOT assign blame
- Do NOT assume intent
- Focus on injury prevention
- Respond ONLY in valid JSON

Site type: ${siteType}

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
  "confidence": number
}
`;
}

/**
 * =====================================================
 * 🛡️ SAFE JSON PARSER (CRITICAL FIX)
 * =====================================================
 */
function safeJsonParse(text) {
  if (!text) return null;

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ AI JSON parse failed:", cleaned);
    return null;
  }
}

module.exports = { analyzeSafety };
