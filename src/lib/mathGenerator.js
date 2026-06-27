const OPERATOR_SYMBOLS = {
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷",
};

const DIFFICULTY_FACTORS = {
  easy: 0.45,
  medium: 0.7,
  hard: 1,
};

const EXERCISE_TYPES = [
  "standard",
  "open",
  "missingFirst",
  "tenFriends",
  "doubles",
  "halves",
  "objectCount",
  "numberBond",
  "tensTo100",
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function getDifficultyCap(rangeMax, difficulty) {
  const factor = DIFFICULTY_FACTORS[difficulty] ?? 1;
  return Math.max(2, Math.floor(rangeMax * factor));
}

function buildAddition(rangeMax, cap) {
  const a = randomInt(0, cap);
  const b = randomInt(0, Math.max(0, rangeMax - a));
  return {a, b, op: "+", result: a + b};
}

function buildSubtraction(rangeMax, cap, allowNegative) {
  const a = randomInt(0, cap);
  const b = randomInt(0, cap);

  if (!allowNegative) {
    const left = Math.max(a, b);
    const right = Math.min(a, b);
    return {a: left, b: right, op: "-", result: left - right};
  }

  const result = a - b;
  if (result < -rangeMax || result > rangeMax) {
    return buildSubtraction(rangeMax, cap, allowNegative);
  }

  return {a, b, op: "-", result};
}

function buildMultiplication(rangeMax, cap) {
  const a = randomInt(0, cap);
  const maxB = a === 0 ? cap : Math.floor(rangeMax / a);
  const b = randomInt(0, Math.max(0, Math.min(cap, maxB)));
  return {a, b, op: "*", result: a * b};
}

function buildDivision(rangeMax, cap) {
  const divisor = randomInt(1, cap);
  const quotient = randomInt(0, Math.min(cap, Math.floor(rangeMax / divisor)));
  const dividend = divisor * quotient;
  return {a: dividend, b: divisor, op: "/", result: quotient};
}

function buildDoubles(rangeMax, cap) {
  const n = randomInt(0, Math.min(cap, Math.floor(rangeMax / 2)));
  return {
    kind: "doubles",
    prompt: `${n} + ${n} = _`,
    answer: n + n,
    answerLabel: String(n + n),
  };
}

function buildHalves(rangeMax, cap) {
  const top = Math.max(2, Math.min(rangeMax, cap * 2));
  const evenCandidates = [];

  for (let value = 2; value <= top; value += 1) {
    if (value % 2 === 0) {
      evenCandidates.push(value);
    }
  }

  const dividend = evenCandidates.length > 0 ? sample(evenCandidates) : 2;
  return {
    kind: "halves",
    prompt: `${dividend} ${OPERATOR_SYMBOLS["/"]} 2 = _`,
    answer: dividend / 2,
    answerLabel: String(dividend / 2),
  };
}

function buildTensTo100(settings) {
  const tens = Array.from({length: 11}, (_, index) => index * 10);
  const preferredOps =
    settings.operationMode === "mixed"
      ? ["+", "-"]
      : ["+", "-"].includes(settings.operationMode)
        ? [settings.operationMode]
        : ["+"];

  const op = sample(preferredOps);

  if (op === "+") {
    const a = sample(tens);
    const bCandidates = tens.filter((value) => a + value <= 100);
    const b = sample(bCandidates);
    return {
      kind: "tensTo100",
      prompt: `${a} ${OPERATOR_SYMBOLS[op]} ${b} = _`,
      answer: a + b,
      answerLabel: String(a + b),
    };
  }

  const a = sample(tens);
  const bCandidates = tens.filter((value) =>
    settings.allowNegative ? true : value <= a,
  );
  const b = sample(bCandidates);
  return {
    kind: "tensTo100",
    prompt: `${a} ${OPERATOR_SYMBOLS[op]} ${b} = _`,
    answer: a - b,
    answerLabel: String(a - b),
  };
}

function buildTenFriends() {
  const first = randomInt(0, 10);
  const second = 10 - first;
  const variant = sample(["open", "missingFirst", "subtract"]);

  if (variant === "open") {
    return {
      kind: "tenFriends",
      prompt: `${first} + _ = 10`,
      answer: second,
      answerLabel: String(second),
    };
  }

  if (variant === "missingFirst") {
    return {
      kind: "tenFriends",
      prompt: `_ + ${second} = 10`,
      answer: first,
      answerLabel: String(first),
    };
  }

  return {
    kind: "tenFriends",
    prompt: `10 - ${first} = _`,
    answer: second,
    answerLabel: String(second),
  };
}

function buildObjectCount(rangeMax, cap) {
  const maxTotal = Math.max(5, Math.min(rangeMax, cap + 4));
  const total = randomInt(5, maxTotal);
  const filled = randomInt(1, total - 1);
  const tensCandidates = [];
  const tensTop = Math.max(20, Math.min(100, Math.max(rangeMax, 20)));

  for (let value = 10; value <= tensTop; value += 10) {
    tensCandidates.push(value);
  }

  const variant = sample(["filled", "empty", "total", "tens"]);

  if (variant === "filled") {
    return {
      kind: "objectCount",
      prompt: "Hur många rutor är ifyllda?",
      answer: filled,
      answerLabel: String(filled),
      visual: {
        type: "squares",
        total,
        filled,
      },
      questionTitle: "Fråga",
    };
  }

  if (variant === "empty") {
    return {
      kind: "objectCount",
      prompt: "Hur många rutor är tomma?",
      answer: total - filled,
      answerLabel: String(total - filled),
      visual: {
        type: "squares",
        total,
        filled,
      },
      questionTitle: "Fråga",
    };
  }

  if (variant === "tens") {
    const tensTotal = sample(tensCandidates);
    const filledTens = randomInt(1, Math.max(1, tensTotal / 10));
    const filledSquares = filledTens * 10;

    return {
      kind: "objectCount",
      prompt: "Hur många tiotal är ifyllda?",
      answer: filledTens,
      answerLabel: String(filledTens),
      visual: {
        type: "squares",
        total: tensTotal,
        filled: filledSquares,
      },
      questionTitle: "Fråga",
    };
  }

  const hiddenFilled = randomInt(1, total - 1);
  return {
    kind: "objectCount",
    prompt: `Hur många rutor är ifyllda om det finns ${total} totalt?`,
    answer: hiddenFilled,
    answerLabel: String(hiddenFilled),
    visual: {
      type: "squares",
      total,
      filled: hiddenFilled,
    },
    questionTitle: "Fråga",
  };
}

function buildNumberBond(rangeMax, cap) {
  const top = randomInt(2, Math.max(2, Math.min(rangeMax, cap + 6)));
  const left = randomInt(0, top);
  const right = top - left;
  const missing = sample(["top", "left", "right"]);

  if (missing === "top") {
    return {
      kind: "numberBond",
      prompt: "Vilket tal ska stå i övre cirkeln?",
      answer: top,
      answerLabel: String(top),
      visual: {
        type: "bondCircles",
        top: null,
        left,
        right,
      },
      questionTitle: "Fråga",
    };
  }

  if (missing === "left") {
    return {
      kind: "numberBond",
      prompt: "Vilket tal saknas i vänstra cirkeln?",
      answer: left,
      answerLabel: String(left),
      visual: {
        type: "bondCircles",
        top,
        left: null,
        right,
      },
      questionTitle: "Fråga",
    };
  }

  return {
    kind: "numberBond",
    prompt: "Vilket tal saknas i högra cirkeln?",
    answer: right,
    answerLabel: String(right),
    visual: {
      type: "bondCircles",
      top,
      left,
      right: null,
    },
    questionTitle: "Fråga",
  };
}

function chooseOperation(mode) {
  if (mode !== "mixed") {
    return mode;
  }

  return sample(["+", "-", "*", "/"]);
}

function buildBaseQuestion(settings) {
  const {rangeMax, difficulty, operationMode, allowNegative} = settings;
  const cap = getDifficultyCap(rangeMax, difficulty);
  const op = chooseOperation(operationMode);

  switch (op) {
    case "+":
      return buildAddition(rangeMax, cap);
    case "-":
      return buildSubtraction(rangeMax, cap, allowNegative);
    case "*":
      return buildMultiplication(rangeMax, cap);
    case "/":
      return buildDivision(rangeMax, cap);
    default:
      return buildAddition(rangeMax, cap);
  }
}

function chooseExerciseType(mode) {
  if (mode !== "mixed") {
    return EXERCISE_TYPES.includes(mode) ? mode : "standard";
  }

  return sample(EXERCISE_TYPES);
}

function makePrompt(base, type) {
  const {a, b, op, result} = base;
  const prettyOp = OPERATOR_SYMBOLS[op];

  switch (type) {
    case "standard":
      return {
        text: `${a} ${prettyOp} ${b} = _`,
        answer: result,
        answerLabel: String(result),
      };
    case "open":
      return {
        text: `${a} ${prettyOp} _ = ${result}`,
        answer: b,
        answerLabel: String(b),
      };
    case "missingFirst":
      return {
        text: `_ ${prettyOp} ${b} = ${result}`,
        answer: a,
        answerLabel: String(a),
      };
    default:
      return {
        text: `${a} ${prettyOp} ${b} = _`,
        answer: result,
        answerLabel: String(result),
      };
  }
}

export function isCorrectAnswer(question, value) {
  const parsed = Number(String(value).trim());
  return Number.isFinite(parsed) && parsed === question.answer;
}

export function generateQuestion(settings, idSeed = 0) {
  const kind = chooseExerciseType(settings.exerciseType);
  const cap = getDifficultyCap(settings.rangeMax, settings.difficulty);

  let generated;

  if (kind === "doubles") {
    generated = buildDoubles(settings.rangeMax, cap);
  } else if (kind === "tenFriends") {
    generated = buildTenFriends();
  } else if (kind === "halves") {
    generated = buildHalves(settings.rangeMax, cap);
  } else if (kind === "objectCount") {
    generated = buildObjectCount(settings.rangeMax, cap);
  } else if (kind === "numberBond") {
    generated = buildNumberBond(settings.rangeMax, cap);
  } else if (kind === "tensTo100") {
    generated = buildTensTo100(settings);
  } else {
    const base = buildBaseQuestion(settings);
    generated = {
      kind,
      ...makePrompt(base, kind),
    };
  }

  return {
    id: `${Date.now()}-${idSeed}-${Math.random().toString(16).slice(2)}`,
    kind: generated.kind,
    prompt: generated.prompt ?? generated.text,
    answer: generated.answer,
    answerLabel: generated.answerLabel,
    visual: generated.visual,
    questionTitle: generated.questionTitle,
  };
}

export function generateQuestionSet(settings, count) {
  return Array.from({length: count}, (_, index) =>
    generateQuestion(settings, index),
  );
}
