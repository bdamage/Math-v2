const OPERATOR_SYMBOLS = {
  '+': '+',
  '-': '-',
  '*': '×',
  '/': '÷',
}

const OPERATOR_INPUT_ALIASES = {
  '+': '+',
  '-': '-',
  '*': '*',
  x: '*',
  X: '*',
  '×': '*',
  '/': '/',
  ':': '/',
  '÷': '/',
}

const DIFFICULTY_FACTORS = {
  easy: 0.45,
  medium: 0.7,
  hard: 1,
}

const EXERCISE_TYPES = ['standard', 'open', 'missingFirst', 'missingOperator']

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sample(list) {
  return list[randomInt(0, list.length - 1)]
}

function getDifficultyCap(rangeMax, difficulty) {
  const factor = DIFFICULTY_FACTORS[difficulty] ?? 1
  return Math.max(2, Math.floor(rangeMax * factor))
}

function buildAddition(rangeMax, cap) {
  const a = randomInt(0, cap)
  const b = randomInt(0, Math.max(0, rangeMax - a))
  return { a, b, op: '+', result: a + b }
}

function buildSubtraction(rangeMax, cap, allowNegative) {
  const a = randomInt(0, cap)
  const b = randomInt(0, cap)

  if (!allowNegative) {
    const left = Math.max(a, b)
    const right = Math.min(a, b)
    return { a: left, b: right, op: '-', result: left - right }
  }

  const result = a - b
  if (result < -rangeMax || result > rangeMax) {
    return buildSubtraction(rangeMax, cap, allowNegative)
  }

  return { a, b, op: '-', result }
}

function buildMultiplication(rangeMax, cap) {
  const a = randomInt(0, cap)
  const maxB = a === 0 ? cap : Math.floor(rangeMax / a)
  const b = randomInt(0, Math.max(0, Math.min(cap, maxB)))
  return { a, b, op: '*', result: a * b }
}

function buildDivision(rangeMax, cap) {
  const divisor = randomInt(1, cap)
  const quotient = randomInt(0, Math.min(cap, Math.floor(rangeMax / divisor)))
  const dividend = divisor * quotient
  return { a: dividend, b: divisor, op: '/', result: quotient }
}

function chooseOperation(mode) {
  if (mode !== 'mixed') {
    return mode
  }

  return sample(['+', '-', '*', '/'])
}

function buildBaseQuestion(settings) {
  const { rangeMax, difficulty, operationMode, allowNegative } = settings
  const cap = getDifficultyCap(rangeMax, difficulty)
  const op = chooseOperation(operationMode)

  switch (op) {
    case '+':
      return buildAddition(rangeMax, cap)
    case '-':
      return buildSubtraction(rangeMax, cap, allowNegative)
    case '*':
      return buildMultiplication(rangeMax, cap)
    case '/':
      return buildDivision(rangeMax, cap)
    default:
      return buildAddition(rangeMax, cap)
  }
}

function chooseExerciseType(mode) {
  if (mode !== 'mixed') {
    return mode
  }

  return sample(EXERCISE_TYPES)
}

function makePrompt(base, type) {
  const { a, b, op, result } = base
  const prettyOp = OPERATOR_SYMBOLS[op]

  switch (type) {
    case 'standard':
      return {
        text: `${a} ${prettyOp} ${b} = _`,
        answer: result,
        answerLabel: String(result),
      }
    case 'open':
      return {
        text: `${a} ${prettyOp} _ = ${result}`,
        answer: b,
        answerLabel: String(b),
      }
    case 'missingFirst':
      return {
        text: `_ ${prettyOp} ${b} = ${result}`,
        answer: a,
        answerLabel: String(a),
      }
    case 'missingOperator':
      return {
        text: `${a} _ ${b} = ${result}`,
        answer: op,
        answerLabel: prettyOp,
      }
    default:
      return {
        text: `${a} ${prettyOp} ${b} = _`,
        answer: result,
        answerLabel: String(result),
      }
  }
}

export function normalizeOperatorInput(value) {
  const trimmed = String(value).trim()
  return OPERATOR_INPUT_ALIASES[trimmed] ?? trimmed
}

export function isCorrectAnswer(question, value) {
  if (question.kind === 'missingOperator') {
    return normalizeOperatorInput(value) === question.answer
  }

  const parsed = Number(String(value).trim())
  return Number.isFinite(parsed) && parsed === question.answer
}

export function generateQuestion(settings, idSeed = 0) {
  const base = buildBaseQuestion(settings)
  const kind = chooseExerciseType(settings.exerciseType)
  const prompt = makePrompt(base, kind)

  return {
    id: `${Date.now()}-${idSeed}-${Math.random().toString(16).slice(2)}`,
    kind,
    prompt: prompt.text,
    answer: prompt.answer,
    answerLabel: prompt.answerLabel,
  }
}

export function generateQuestionSet(settings, count) {
  return Array.from({ length: count }, (_, index) => generateQuestion(settings, index))
}
