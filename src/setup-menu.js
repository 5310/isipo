import { shortenUrl } from './isgd.js'
import { getSlug } from './setup-url-saving.js'

export let updateKey, makeKeyStale, spin

export default () => {
  const $html = document.querySelector('html')

  const $main = document.querySelector('main')

  const $more = document.querySelector('aside .more')
  const $aside = document.querySelector('aside')
  const $menu = $aside.querySelector('.menu')
  $menu.querySelector('.overlay').addEventListener('click', () => {
    $menu.classList.add('hide')
  })
  $more.addEventListener('click', () => {
    $menu.classList.remove('hide')
  })

  const $color = $menu.querySelector('.color')
  const $colors = Array.from($color.children)
  let colorIndex = 1
  $color.addEventListener('click', () => {
    $html.dataset.color = $colors[colorIndex].dataset.color
    $colors[colorIndex].classList.add('hide')
    colorIndex = ++colorIndex % $colors.length
    $colors[colorIndex].classList.remove('hide')
  })

  const $script = $menu.querySelector('.script')
  const $scripts = Array.from($script.children)
  let scriptIndex = 1
  $script.addEventListener('click', () => {
    $main.dataset.script = $scripts[scriptIndex].dataset.script
    $scripts[scriptIndex].classList.add('hide')
    scriptIndex = ++scriptIndex % $scripts.length
    $scripts[scriptIndex].classList.remove('hide')
  })

  const $save = $menu.querySelector('.save')
  const $shortUrl = $save.querySelector('.label')
  const $floppy = $save.querySelector('.floppy')
  const $spinner = $save.querySelector('.spinner')
  const $share = $save.querySelector('.share')
  const $copy = $save.querySelector('.copy')
  let fresh = false
  let key = ''
  updateKey = k => {
    fresh = true
    key = k
    $shortUrl.innerHTML = key
    const params = new window.URLSearchParams(window.location.search)
    params.set('s', key)
    params.delete('t')
    window.history.pushState({}, '', window.location.pathname + '?' + params)
    $floppy.classList.add('hide')
    $spinner.classList.add('hide')
    $share.classList.add('hide')
    $copy.classList.add('hide')
    if (navigator.share) $share.classList.remove('hide')
    else $copy.classList.remove('hide')
    $more.classList.remove('error')
    $more.classList.remove('warning')
    $more.classList.add('okay')
  }
  makeKeyStale = () => {
    fresh = false
    $floppy.classList.remove('hide')
    $spinner.classList.add('hide')
    $share.classList.add('hide')
    $copy.classList.add('hide')
    $more.classList.remove('error')
    $more.classList.remove('warning')
    $more.classList.remove('okay')
  }
  spin = () => {
    $floppy.classList.add('hide')
    $spinner.classList.remove('hide')
    $share.classList.add('hide')
    $copy.classList.add('hide')
    $more.classList.remove('error')
    $more.classList.add('warning')
    $more.classList.remove('okay')
  }
  $save.addEventListener('click', async () => {
    if (!fresh) {
      spin()
      const shortUrl = await shortenUrl(window.location.href)
      key = new URL(shortUrl).pathname.slice(1)
      updateKey(key)
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'sitelen-pona',
          text: getSlug(),
          url: window.location.href,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error))
      } else {
        const dummy = document.createElement('textarea')
        dummy.value = window.location.href
        document.body.appendChild(dummy)
        dummy.select()
        document.execCommand('copy')
        document.body.removeChild(dummy)
      }
    }
  })
}
