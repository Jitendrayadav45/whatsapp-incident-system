export default function AIAnalysisPanel({ analysis }) {
  if (!analysis) {
    return (
      <div className="panel">
        <h3>AI Safety Analysis</h3>
        <p>No AI analysis available.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>AI Safety Analysis</h3>

      <p>
        <strong>Rule Violated:</strong>{" "}
        {analysis.lifeSavingRuleViolated
          ? analysis.ruleName
          : "No violation detected"}
      </p>

      <p>
        <strong>Risk Level:</strong> {analysis.riskLevel}
      </p>

      <p>
        <strong>Summary:</strong> {analysis.observationSummary}
      </p>

      <p>
        <strong>Why Dangerous:</strong>{" "}
        {analysis.whyThisIsDangerous}
      </p>

      <div>
        <strong>Mentor Precautions:</strong>
        <ul>
          {(analysis.mentorPrecautions || []).map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <small>Confidence: {analysis.confidence}%</small>
    </div>
  );
}