import { CheckCircle2, CircleHelp, RefreshCw, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generateQuestion, isCorrectAnswer } from '../lib/mathGenerator'

function helperText(questionKind) {
  if (questionKind === 'missingOperator') {
    return 'Skriv +, -, × eller ÷'
  }

  return 'Skriv ett tal och tryck Kontrollera'
}

export function PracticePanel({ settings }) {
  const [question, setQuestion] = useState(() => generateQuestion(settings, 0))
  const [answerInput, setAnswerInput] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  useEffect(() => {
    setQuestion(generateQuestion(settings, Date.now()))
    setAnswerInput('')
    setFeedback(null)
  }, [settings])

  function nextQuestion() {
    setQuestion(generateQuestion(settings, Date.now()))
    setAnswerInput('')
    setFeedback(null)
  }

  function checkAnswer() {
    const isCorrect = isCorrectAnswer(question, answerInput)

    setFeedback({
      type: isCorrect ? 'success' : 'error',
      message: isCorrect
        ? 'Rätt svar. Bra jobbat.'
        : `Inte riktigt. Rätt svar är ${question.answerLabel}.`,
    })

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  return (
    <section className="panel" aria-label="Digitalt övningsläge">
      <header className="panel-header">
        <h2>
          <CircleHelp size={20} aria-hidden="true" />
          Digitalt övningsläge
        </h2>
        <p>
          Poäng: {score.correct} av {score.total}
        </p>
      </header>

      <p className="question" aria-live="polite">
        {question.prompt}
      </p>

      <label className="answer-label" htmlFor="answerInput">
        Ditt svar
      </label>
      <input
        id="answerInput"
        className="answer-input"
        value={answerInput}
        onChange={(event) => setAnswerInput(event.target.value)}
        placeholder={helperText(question.kind)}
        autoComplete="off"
      />

      <div className="action-row">
        <button type="button" className="primary-btn" onClick={checkAnswer}>
          Kontrollera
        </button>
        <button type="button" className="ghost-btn" onClick={nextQuestion}>
          <RefreshCw size={16} aria-hidden="true" />
          Ny fråga
        </button>
      </div>

      {feedback && (
        <p className={`feedback ${feedback.type}`} aria-live="polite">
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} aria-hidden="true" />
          ) : (
            <XCircle size={18} aria-hidden="true" />
          )}
          {feedback.message}
        </p>
      )}
    </section>
  )
}
