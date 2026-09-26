import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { loadSettings, type SiteSettings } from './settings'

function Site() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    loadSettings().then(value => { if (active) setSettings(value) })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [])

  if (settings) return <App settings={settings} />
  return <main className="container section" role="status">
    <h1>Японец</h1>
    <p>{failed ? 'Не удалось загрузить данные сайта. Попробуйте обновить страницу.' : 'Загружаем сайт…'}</p>
    {failed && <button className="button" onClick={() => window.location.reload()}>Попробовать снова</button>}
  </main>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Site />
  </StrictMode>,
)
