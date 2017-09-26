import './sw-register.js'
import setupUrlSaving from './url-params.js'
import setupMenu from './menu.js'

document.onreadystatechange = function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {}
    setupMenu()
    setupUrlSaving()
  }
}
