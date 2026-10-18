import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

// Languages offered in the selector. There are no translations yet: the choice is remembered
// and set as the page language, ready for when translated text is added.
const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
]

export default function LanguageSelect() {
  const [saved, setLanguage] = useLocalStorage('devquest.language', 'en')
  const language = LANGUAGES.some((l) => l.code === saved) ? saved : 'en'

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <select
      className="language-select"
      aria-label="Language"
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  )
}
