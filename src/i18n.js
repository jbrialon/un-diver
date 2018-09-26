import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

let localesList = []
let currentLng = process.env.VUE_APP_I18N_LOCALE

function loadLocaleMessages () {
  const locales = require.context('./i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([a-z0-9]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      localesList.push(locale)
      messages[locale] = locales(key)
    }
  })
  return messages
}

function getCurrentLng () {
  let lng = window.location.pathname.replace(`${process.env.BASE_URL}`, '')
  if (!lng) {
    lng = window.location.hash.substring(1)
  }
  for (var i = 0; i < localesList.length; i++) {
    if (lng.indexOf(localesList[i]) === 0) {
      currentLng = localesList[i]
    }
  }
  return currentLng
}

const messages = loadLocaleMessages()
currentLng = getCurrentLng()

const i18n = new VueI18n({
  locale: currentLng,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || currentLng,
  messages: messages
})

export { i18n, localesList }
