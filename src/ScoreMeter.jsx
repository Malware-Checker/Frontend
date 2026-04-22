export default function ScoreMeter({ score }) {
  const capped = Math.min(score, 100)

  const color =
    capped === 0   ? '#4ade80' :
    capped < 30    ? '#a3e635' :
    capped < 50    ? '#facc15' :
    capped < 75    ? '#fb923c' :
                     '#f87171'

  const label =
    capped === 0  ? 'None' :
    capped < 30   ? 'Low' :
    capped < 50   ? 'Medium' :
    capped < 75   ? 'High' :
                    'Critical'

  return (
    <div className="meter-wrap">
      <div className="meter-header">
        <span className="meter-label">Threat Score</span>
        <span className="meter-value" style={{ color }}>{capped}<span className="meter-max">/100</span></span>
      </div>

      <div className="meter-track">
        <div
          className="meter-fill"
          style={{ width: `${capped}%`, background: color }}
        />
      </div>

      <div className="meter-ticks">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>

      <div className="meter-severity" style={{ color }}>
        Severity: <strong>{label}</strong>
        {score > 100 && <span className="meter-overflow"> (raw score: {score})</span>}
      </div>
    </div>
  )
}
