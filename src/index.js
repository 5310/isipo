import './sw-register.js'
import setupUrlSaving from './setup-url-saving.js'
import setupMenu from './setup-menu.js'

document.onreadystatechange = function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {}
    setupUrlSaving()
    setupMenu()
  }
}
