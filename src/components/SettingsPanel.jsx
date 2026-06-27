import {
  Calculator,
  ChartColumnIncreasing,
  CircleGauge,
  FileText,
  Shuffle,
  SlidersHorizontal,
} from 'lucide-react'

const OPERATION_OPTIONS = [
  { value: '+', label: 'Addition' },
  { value: '-', label: 'Subtraktion' },
  { value: '*', label: 'Multiplikation' },
  { value: '/', label: 'Division' },
  { value: 'mixed', label: 'Blandat läge' },
]

const RANGE_OPTIONS = [
  { value: 10, label: '0-10' },
  { value: 20, label: '0-20' },
]

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Lätt' },
  { value: 'medium', label: 'Medel' },
  { value: 'hard', label: 'Svår' },
]

const EXERCISE_TYPE_OPTIONS = [
  { value: 'standard', label: 'Vanliga uppgifter' },
  { value: 'open', label: 'Öppna utsagor' },
  { value: 'missingFirst', label: 'Saknat första tal' },
  { value: 'missingOperator', label: 'Saknat räknesätt' },
  { value: 'mixed', label: 'Blandade uppgiftstyper' },
]

const WORKSHEET_COUNT_OPTIONS = [10, 20, 30]

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="toggle-group" role="radiogroup">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`toggle ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function SettingsPanel({ settings, onChange }) {
  return (
    <aside className="settings-card" aria-label="Inställningar">
      <h2>
        <SlidersHorizontal size={20} aria-hidden="true" />
        Inställningar
      </h2>

      <section className="setting-group">
        <h3>
          <Calculator size={18} aria-hidden="true" />
          Räknesätt
        </h3>
        <ToggleGroup
          options={OPERATION_OPTIONS}
          value={settings.operationMode}
          onChange={(operationMode) => onChange({ operationMode })}
        />
      </section>

      <section className="setting-group">
        <h3>
          <ChartColumnIncreasing size={18} aria-hidden="true" />
          Talområde
        </h3>
        <ToggleGroup
          options={RANGE_OPTIONS}
          value={settings.rangeMax}
          onChange={(rangeMax) => onChange({ rangeMax })}
        />
      </section>

      <section className="setting-group">
        <h3>
          <CircleGauge size={18} aria-hidden="true" />
          Svårighetsgrad
        </h3>
        <ToggleGroup
          options={DIFFICULTY_OPTIONS}
          value={settings.difficulty}
          onChange={(difficulty) => onChange({ difficulty })}
        />
      </section>

      <section className="setting-group">
        <h3>
          <Shuffle size={18} aria-hidden="true" />
          Övningstyp
        </h3>
        <ToggleGroup
          options={EXERCISE_TYPE_OPTIONS}
          value={settings.exerciseType}
          onChange={(exerciseType) => onChange({ exerciseType })}
        />
      </section>

      <section className="setting-group">
        <h3>
          <FileText size={18} aria-hidden="true" />
          Utskriftsblad
        </h3>
        <label className="inline-option" htmlFor="questionCount">
          Antal frågor
          <select
            id="questionCount"
            value={settings.questionCount}
            onChange={(event) => onChange({ questionCount: Number(event.target.value) })}
          >
            {WORKSHEET_COUNT_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>

        <label className="inline-check" htmlFor="showAnswers">
          <input
            id="showAnswers"
            type="checkbox"
            checked={settings.showAnswers}
            onChange={(event) => onChange({ showAnswers: event.target.checked })}
          />
          Visa facit
        </label>

        <label className="inline-check" htmlFor="allowNegative">
          <input
            id="allowNegative"
            type="checkbox"
            checked={settings.allowNegative}
            onChange={(event) => onChange({ allowNegative: event.target.checked })}
          />
          Tillåt negativa svar i subtraktion
        </label>
      </section>
    </aside>
  )
}
