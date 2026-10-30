import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// index.html carries default tags for clients that do not run JavaScript.
// Pages render their own through <SEO>, so drop the defaults to avoid duplicates.
document.querySelectorAll('[data-static-seo]').forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
