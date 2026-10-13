import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Offline/installable support (production build only, so dev HMR is never cached)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}

createRoot(document.getElementById('root')!).render(<App />)
