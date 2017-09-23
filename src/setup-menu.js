export default () => {
  const more = document.querySelector('aside .more')
  const menu = document.querySelector('aside > .menu')

  more.addEventListener('pointerdown', () => {
    menu.classList.remove('hide')
  })

  menu.querySelector('.overlay').addEventListener('pointerdown', () => {
    menu.classList.add('hide')
  })
}
