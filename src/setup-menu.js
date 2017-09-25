export default () => {
  const $html = document.querySelector('html')

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
  $script.addEventListener('pointerdown', () => {
    $main.classList.toggle('latin')
  })
}
