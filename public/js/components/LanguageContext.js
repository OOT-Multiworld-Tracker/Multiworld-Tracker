import { createContext } from 'react'
import { GetTranslation } from '../classes/Translator'

const context = createContext({
  language: 'en_us',
  setLanguage: (lang) => { this.language = lang },
  i: (key) => { return GetTranslation(this.language, key) }
})

export default context
