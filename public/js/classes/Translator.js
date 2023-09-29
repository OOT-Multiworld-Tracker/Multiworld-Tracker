const lang = {
  en_us: {
    World: 'World',
    Saves: 'Saves',
    Items: 'Items',
    Settings: 'Settings'
  },

  jp_jp: {
    World: 'ワールド',
    Saves: 'セーブ',
    Items: '所持品',
    Settings: '設定',
    'Deku Nuts': 'デクナッツ'
  }
}

export const GetLanguages = () => {
  return Object.keys(lang)
}

export const GetLanguage = (name) => {
  return lang[name]
}

export const GetTranslation = (lang, key) => {
  return GetLanguage(lang)[key] || key
}

export default class Translator {
}
