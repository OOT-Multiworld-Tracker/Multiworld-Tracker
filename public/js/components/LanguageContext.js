import { createContext } from "react"

const context = createContext({
    language: "en_us",
    setLanguage: (lang) => { this.language = lang }
})

export default context
