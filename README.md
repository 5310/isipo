# isipo

This is a notepad for [Toki Pona][1] text written in the [Sitelen Pona][2] script using the [Linja Pona][3] font by [jan Same][4].

TODO:

Toki Pona latin notepad app.

- [x] v1.1
  - [x] Simple URL-saving notepad using Linja Pona
- [x] v1.2
  - [x] Add menu
    - https://codepen.io/5310/pen/boEKLZ?editors=1100
  - [x] Toggle for sitelen pona and Latin
  - [x] Light/dark toggle
    - [x] Light
    - [x] Twilight
    - [x] Dark
    - [x] Black
- [ ] v1.3
  - [x] Is.gd URL shortening
    - https://www.npmjs.com/package/isgd
    - [x] Implement a custom query parameter that delegates shortened urls
  - [x] Display save freshness on overflow and save icon
  - [x] Display a "working" icon while saving.
  - [x] Share button if Web Share present or copy url to clipboard
    - https://developers.google.com/web/updates/2016/09/navigator-share
- [ ] v1.4
  - [ ] Refactor file names
  - [ ] Refactor all the replacing buttons with replacing icons instead
  - [ ] About page
    - [ ] Explanations about URL saving in English and Toki Pona
    - [ ] Links to source, etc
    - [ ] isipo logo
- v1.x
  - Automatic gloss.
  - Allow copying/saving to rendered images.
    - This implies canvas.
    - Start with a text implementation. Extend with optional canvas rendering later.
  - Extend scripts with Hiragana, Katakana, Bengali, etc.?

[1]: https://en.wikipedia.org/wiki/Toki_Pona
[2]: http://tokipona.net/tp/janpije/hieroglyphs.php
[3]: https://github.com/janSame/linja-pona/
[4]: http://musilili.net
