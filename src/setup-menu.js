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
  let color = 0
  const changeColor = () => {
    $colors[color].classList.add('hide')
    color = ++color % $colors.length
    $colors[color].classList.remove('hide')
    $html.dataset.color = $colors[color].dataset.color
  }
  $color.addEventListener('pointerdown', changeColor)
}
