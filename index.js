if (location.protocol === 'http:') location.protocol = 'https:';
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => console.log('Service Worker registered', reg)).catch(err => console.error('Service Worker **not** registered', err));
} else {
  console.warn('Service Worker not supported in this browser');
}

const shortenUrl = url => fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url)).then(res => res.json()).then(({ shorturl }) => shorturl);

const lookupUrl = shorturl => fetch('https://is.gd/forward.php?format=json&shorturl=' + encodeURIComponent(shorturl)).then(res => res.json()).then(({ url }) => url);

function _asyncToGenerator$1(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let updateKey;
let makeKeyStale;

var setupMenu = (() => {
  const $html = document.querySelector('html');

  const $main = document.querySelector('main');

  const $more = document.querySelector('aside .more');
  const $aside = document.querySelector('aside');
  const $menu = $aside.querySelector('.menu');
  $menu.querySelector('.overlay').addEventListener('pointerdown', () => {
    $menu.classList.add('hide');
  });
  $more.addEventListener('pointerdown', () => {
    $menu.classList.remove('hide');
  });

  const $color = $menu.querySelector('.color');
  const $colors = Array.from($color.children);
  let colorIndex = 1;
  $color.addEventListener('pointerdown', () => {
    $html.dataset.color = $colors[colorIndex].dataset.color;
    $colors[colorIndex].classList.add('hide');
    colorIndex = ++colorIndex % $colors.length;
    $colors[colorIndex].classList.remove('hide');
  });

  const $script = $menu.querySelector('.script');
  const $scripts = Array.from($script.children);
  let scriptIndex = 1;
  $script.addEventListener('pointerdown', () => {
    $main.dataset.script = $scripts[scriptIndex].dataset.script;
    $scripts[scriptIndex].classList.add('hide');
    scriptIndex = ++scriptIndex % $scripts.length;
    $scripts[scriptIndex].classList.remove('hide');
  });

  const $save = $menu.querySelector('.save');
  const $shortUrl = $save.querySelector('.label');
  let key = '';
  updateKey = k => {
    // TODO: Show share, hide spinner, floppy
    key = k;
    $shortUrl.innerHTML = key;
    const params = new window.URLSearchParams(window.location.search);
    params.set('s', key);
    params.delete('t');
    window.history.pushState({}, '', window.location.pathname + '?' + params);
  };
  makeKeyStale = () => {
    // TODO: Show floppy, hide share, spinner
  };
  $save.addEventListener('pointerdown', _asyncToGenerator$1(function* () {
    // TODO: Show spinner, hide floppy, share
    const shortUrl = yield shortenUrl(window.location.href);
    key = new URL(shortUrl).pathname.slice(1);
    updateKey(key);
  }));
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var setupUrlSaving = (() => {
  const params = new window.URLSearchParams(window.location.search);
  const content = document.querySelector('main');

  // Load content from URL, if any.
  const load = (() => {
    var _ref = _asyncToGenerator(function* () {
      let text = params.get('t');
      const key = params.get('s');
      if (key) {
        text = new URLSearchParams(new URL((yield lookupUrl('https://is.gd/' + key))).search).get('t');
        params.delete('s');
        params.set('t', new URLSearchParams(new URL((yield lookupUrl('https://is.gd/' + key))).search).get('t'));
        window.history.pushState({}, '', window.location.pathname + '?' + params);
        updateKey(key);
      }
      content.innerHTML = text || 'toki!<br>' + 'ni li ilo sitelen-pona<br>' + 'ni li ilo pi sitelen lon sitelen-pona. ni li sitelen kepeken linja-pona<br>' + 'jan [_sitelen_ante_musi_esun] pali ee linja-pona. jan ni li pona mute!';
    });

    return function load() {
      return _ref.apply(this, arguments);
    };
  })();
  // Save content to the URL.
  const save = function () {
    params.set('t', content.innerHTML);
    window.history.replaceState({}, '', window.location.pathname + '?' + params);
    makeKeyStale();
  };
  // Update title from content.
  const title = function () {
    for (let line of content.innerHTML.split('<br>')) {
      if (line) {
        document.title = 'isipo' + ' - ' + line.replace(/<[a-z0-9-]+>/g, '');
        break;
      }
    }
  };
  // Place caret at the end of content.
  const focus = function () {
    if (!content.innerHTML.trim().replace('<br>', '')) {
      setTimeout(function () {
        content.focus();
      }, 0);
    } else {
      content.focus();
      let range = document.createRange();
      range.selectNodeContents(content);
      range.collapse(false);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  // Hook up save routine.
  let cooldown = false;
  content.oninput = function () {
    if (!cooldown) {
      setTimeout(function () {
        save();
        title();
        cooldown = false;
      }, 1 * 1000);
    }
    cooldown = true;
  };

  // Override keys.
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 9:
        // Let tabs be tabs~
        // TODO: Consider indent/outdent for selections with tab/shift+tab.
        document.execCommand('insertHTML', false, '&#9');
        e.preventDefault();
        break;
      case 13:
        // Override newline to be just `<br>` without wrapping `<div>`s
        document.execCommand('insertHTML', false, '<br><br>');
        e.preventDefault();
        break;
    }
  };

  // Initialize.
  load();
  title();
  focus();
});

document.onreadystatechange = function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {};
    setupUrlSaving();
    setupMenu();
  }
};

//# sourceMappingURL=index.js.map