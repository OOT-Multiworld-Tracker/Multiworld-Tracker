const lang = {
    "en_us": {
      "World": "World",
      "Saves": "Saves",
      "Items": "Items",
      "Settings": "Settings"
    },

    "jp_jp": {
      "World": "ワールド",
      "Saves": "セーブ",
      "Items": "所持品",
      "Settings": "設定",
      "Deku Nuts": "デクナッツ"
    }
}

export default class Translator {
  static GetLanguages () {
    return Object.keys(lang)
  }

  static GetLanguage (name) {
    return lang[name]
  }

  static GetTranslation (lang, key) {
    return this.GetLanguage(lang)[key] || key
  }
}