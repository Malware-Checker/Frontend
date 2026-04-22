import { useState, useRef } from 'react'
import ScoreMeter from './ScoreMeter'
import './App.css'

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  CLEAN: 'clean',
  SUSPICIOUS: 'suspicious',
  MALWARE: 'malware',
  ERROR: 'error',
}

export default function App() {
  const [status, setStatus] = useState(STATUS.IDLE)
  const [result, setResult] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  async function scanFile(file) {
    setFileName(file.name)
    setStatus(STATUS.LOADING)
    setResult(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/check', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        setStatus(STATUS.ERROR)
        setResult(data?.message ?? `Server error: ${res.status}`)
        return
      }

      const verdict = data?.result
      if (verdict === 'malicious' || data?.malware === true) setStatus(STATUS.MALWARE)
      else if (verdict === 'suspicious') setStatus(STATUS.SUSPICIOUS)
      else setStatus(STATUS.CLEAN)

      setResult(data)
    } catch (err) {
      setStatus(STATUS.ERROR)
      setResult('Could not reach the scanner API. Is the backend running?')
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (file) scanFile(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) scanFile(file)
  }

  function reset() {
    setStatus(STATUS.IDLE)
    setResult(null)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const showResult = [STATUS.CLEAN, STATUS.SUSPICIOUS, STATUS.MALWARE].includes(status)

  return (
    <div className="page">
      <header className="header">
        <span className="logo">&#x26A0;</span>
        <h1>Malware Scanner</h1>
        <p className="subtitle">Upload a file to check it for malicious content</p>
      </header>

      <main className="main">
        {status === STATUS.IDLE && (
          <div
            className={`dropzone${dragging ? ' dragging' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <span className="drop-icon">&#x1F4C2;</span>
            <p className="drop-text">Drop a file here or <span className="link">click to browse</span></p>
            <p className="drop-hint">Any file type accepted</p>
            <input ref={inputRef} type="file" hidden onChange={handleFileChange} />
          </div>
        )}

        {status === STATUS.LOADING && (
          <div className="card loading-card">
            <div className="spinner" />
            <p>Scanning <strong>{fileName}</strong>…</p>
          </div>
        )}

        {showResult && (
          <div className={`card result-card ${status}`}>
            <span className="result-icon">
              {status === STATUS.CLEAN      ? '✅' :
               status === STATUS.SUSPICIOUS ? '⚠️' : '🚨'}
            </span>

            <h2>
              {status === STATUS.CLEAN      ? 'No Threats Detected' :
               status === STATUS.SUSPICIOUS ? 'Suspicious File'     : 'Malware Detected'}
            </h2>

            <p className="file-label">{fileName}</p>

            <ScoreMeter score={result?.score ?? 0} />

            {result?.findings?.length > 0 && (
              <div className="findings">
                <p className="findings-title">Findings</p>
                <ul className="findings-list">
                  {result.findings.map((f, i) => (
                    <li key={i} className={`finding finding-${f.severity}`}>
                      <span className="finding-engine">{f.engine}</span>
                      <span className="finding-sig">{f.signature}</span>
                      <span className="finding-desc">{f.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className={`btn${status === STATUS.MALWARE ? ' btn-danger' : ''}`}
              onClick={reset}
            >
              Scan another file
            </button>
          </div>
        )}

        {status === STATUS.ERROR && (
          <div className="card result-card error">
            <span className="result-icon">&#x274C;</span>
            <h2>Scan Failed</h2>
            <p className="details">{result}</p>
            <button className="btn" onClick={reset}>Try again</button>
          </div>
        )}
      </main>
    </div>
  )
}
