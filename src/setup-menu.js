import { shortenUrl } from './isgd.js'

export let updateKey, makeKeyStale

export default () => {
  const $html = document.querySelector('html')

  const $main = document.querySelector('main')

  const $more = document.querySelector('aside .more')
  const $aside = document.querySelector('aside')
  const $menu = $aside.querySelector('.menu')
  $menu.querySelector('.overlay').addEventListener('pointerdown', () => {
    $menu.classList.add('hide')
  })
  $more.addEventListener('pointerdown', () => {
    $menu.classList.remove('hide')
  })

  const $color = $menu.querySelector('.color')
  const $colors = Array.from($color.children)
  let colorIndex = 1
  $color.addEventListener('pointerdown', () => {
    $html.dataset.color = $colors[colorIndex].dataset.color
    $colors[colorIndex].classList.add('hide')
    colorIndex = ++colorIndex % $colors.length
    $colors[colorIndex].classList.remove('hide')
  })

  const $script = $menu.querySelector('.script')
  const $scripts = Array.from($script.children)
  let scriptIndex = 1
  $script.addEventListener('pointerdown', () => {
    $main.dataset.script = $scripts[scriptIndex].dataset.script
    $scripts[scriptIndex].classList.add('hide')
    scriptIndex = ++scriptIndex % $scripts.length
    $scripts[scriptIndex].classList.remove('hide')
  })

  const $save = $menu.querySelector('.save')
  const $shortUrl = $save.querySelector('.label')
  let key = ''
  updateKey = k => {
    // TODO: Show share, hide spinner, floppy
    key = k
    $shortUrl.innerHTML = key
    const params = new window.URLSearchParams(window.location.search)
    params.set('s', key)
    params.delete('t')
    window.history.pushState({}, '', window.location.pathname + '?' + params)
  }
  makeKeyStale = () => {
    // TODO: Show floppy, hide share, spinner
  }
  $save.addEventListener('pointerdown', async () => {
    // TODO: Show spinner, hide floppy, share
    const shortUrl = await shortenUrl(window.location.href)
    key = new URL(shortUrl).pathname.slice(1)
    updateKey(key)
  })
}
