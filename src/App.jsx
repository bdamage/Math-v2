import { BookOpenCheck, FileSpreadsheet } from 'lucide-react'
import { useState } from 'react'
import './App.css'
import { PracticePanel } from './components/PracticePanel'
import { SettingsPanel } from './components/SettingsPanel'
import { WorksheetPanel } from './components/WorksheetPanel'

function App() {
  const [settings, setSettings] = useState({
    operationMode: 'mixed',
    rangeMax: 10,
    difficulty: 'medium',
    exerciseType: 'mixed',
    questionCount: 20,
    showAnswers: true,
    allowNegative: false,
  })
  const [view, setView] = useState('practice')

  function updateSettings(partial) {
    setSettings((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <h1>Matteverkstad</h1>
        <p>Träna addition, subtraktion, multiplikation och division på ett lugnt och tydligt sätt.</p>
        <div className="view-switch" role="tablist" aria-label="Välj visning">
          <button
            type="button"
            className={`toggle ${view === 'practice' ? 'active' : ''}`}
            onClick={() => setView('practice')}
          >
            <BookOpenCheck size={16} aria-hidden="true" />
            Övning
          </button>
          <button
            type="button"
            className={`toggle ${view === 'worksheet' ? 'active' : ''}`}
            onClick={() => setView('worksheet')}
          >
            <FileSpreadsheet size={16} aria-hidden="true" />
            Arbetsblad
          </button>
        </div>
      </header>

      <main className="layout">
        <SettingsPanel settings={settings} onChange={updateSettings} />
        {view === 'practice' ? (
          <PracticePanel settings={settings} />
        ) : (
          <WorksheetPanel settings={settings} />
        )}
      </main>
    </div>
  )
}

export default App
