import { Eye, EyeOff, Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateQuestionSet } from '../lib/mathGenerator'

const QUESTIONS_PER_PAGE = 30

function renderWorksheetPrompt(prompt) {
  const parts = prompt.split('_')

  if (parts.length === 1) {
    return prompt
  }

  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 && <span className="answer-line" aria-hidden="true" />}
    </span>
  ))
}

export function WorksheetPanel({ settings }) {
  const [questions, setQuestions] = useState(() =>
    generateQuestionSet(settings, QUESTIONS_PER_PAGE),
  )

  useEffect(() => {
    setQuestions(generateQuestionSet(settings, QUESTIONS_PER_PAGE))
  }, [settings])

  function regenerateWorksheet() {
    setQuestions(generateQuestionSet(settings, QUESTIONS_PER_PAGE))
  }

  return (
    <section className="panel worksheet" aria-label="Utskriftsläge">
      <header className="panel-header no-print">
        <h2>
          <Printer size={20} aria-hidden="true" />
          Utskriftsläge
        </h2>
        <div className="action-row">
          <button type="button" className="ghost-btn" onClick={regenerateWorksheet}>
            Nya frågor
          </button>
          <button type="button" className="primary-btn" onClick={() => window.print()}>
            Skriv ut
          </button>
        </div>
      </header>

      <article className="worksheet-paper" aria-label="Arbetsblad A4">
        <header className="worksheet-top">
          <h3>Matteblad</h3>
          <div className="meta-fields">
            <p>Namn: ____________________</p>
            <p>Datum: ____________________</p>
          </div>
          <p className="worksheet-meta">Antal frågor: {QUESTIONS_PER_PAGE}</p>
        </header>

        <ol className="worksheet-grid">
          {questions.map((question) => (
            <li key={question.id}>
              <span>{renderWorksheetPrompt(question.prompt)}</span>
              {settings.showAnswers && (
                <small className="answer-key">Facit: {question.answerLabel}</small>
              )}
            </li>
          ))}
        </ol>

        <footer className="worksheet-footer">
          {settings.showAnswers ? (
            <p>
              <Eye size={14} aria-hidden="true" /> Facit visas
            </p>
          ) : (
            <p>
              <EyeOff size={14} aria-hidden="true" /> Facit dolt
            </p>
          )}
        </footer>
      </article>
    </section>
  )
}
