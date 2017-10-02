if (location.protocol === 'http:') location.protocol = 'https:';
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => console.log('Service Worker registered', reg)).catch(err => console.error('Service Worker **not** registered', err));
} else {
  console.warn('Service Worker not supported in this browser');
}

const shortenUrl = url => fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url)).then(res => res.json()).then(({ shorturl }) => shorturl);

const lookupUrl = shorturl => fetch('https://is.gd/forward.php?format=json&shorturl=' + encodeURIComponent(shorturl)).then(res => res.json()).then(({ url }) => url);

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

let updateKey;
let makeKeyStale;
let spin;

var setupMenu = (() => {
  const $html = document.querySelector('html');

  const $main = document.querySelector('main');

  const $more = document.querySelector('aside .more');
  const $aside = document.querySelector('aside');
  const $menu = $aside.querySelector('.menu');
  $menu.querySelector('.overlay').addEventListener('click', () => {
    $menu.classList.add('hide');
  });
  $more.addEventListener('click', () => {
    $menu.classList.remove('hide');
  });

  const $color = $menu.querySelector('.color');
  const $colors = Array.from($color.children);
  let colorIndex = 1;
  $color.addEventListener('click', () => {
    $html.dataset.color = $colors[colorIndex].dataset.color;
    $colors[colorIndex].classList.add('hide');
    colorIndex = ++colorIndex % $colors.length;
    $colors[colorIndex].classList.remove('hide');
  });

  const $script = $menu.querySelector('.script');
  const $scripts = Array.from($script.children);
  let scriptIndex = 1;
  $script.addEventListener('click', () => {
    $main.dataset.script = $scripts[scriptIndex].dataset.script;
    $scripts[scriptIndex].classList.add('hide');
    scriptIndex = ++scriptIndex % $scripts.length;
    $scripts[scriptIndex].classList.remove('hide');
  });

  const $save = $menu.querySelector('.save');
  const $shortUrl = $save.querySelector('.label');
  const $floppy = $save.querySelector('.floppy');
  const $spinner = $save.querySelector('.spinner');
  const $share = $save.querySelector('.share');
  const $copy = $save.querySelector('.copy');
  let fresh = false;
  let key = '';
  updateKey = k => {
    fresh = true;
    key = k;
    $shortUrl.innerHTML = key;
    const params = new window.URLSearchParams(window.location.search);
    params.set('s', key);
    params.delete('t');
    window.history.pushState({}, '', window.location.pathname + '?' + params);
    $floppy.classList.add('hide');
    $spinner.classList.add('hide');
    $share.classList.add('hide');
    $copy.classList.add('hide');
    if (navigator.share) $share.classList.remove('hide');else $copy.classList.remove('hide');
    $more.classList.remove('error');
    $more.classList.remove('warning');
    $more.classList.add('okay');
  };
  makeKeyStale = () => {
    fresh = false;
    $floppy.classList.remove('hide');
    $spinner.classList.add('hide');
    $share.classList.add('hide');
    $copy.classList.add('hide');
    $more.classList.remove('error');
    $more.classList.remove('warning');
    $more.classList.remove('okay');
  };
  spin = () => {
    $floppy.classList.add('hide');
    $spinner.classList.remove('hide');
    $share.classList.add('hide');
    $copy.classList.add('hide');
    $more.classList.remove('error');
    $more.classList.add('warning');
    $more.classList.remove('okay');
  };
  $save.addEventListener('click', asyncToGenerator(function* () {
    if (!fresh) {
      spin();
      const shortUrl = yield shortenUrl(window.location.href);
      key = new URL(shortUrl).pathname.slice(1);
      updateKey(key);
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'sitelen-pona',
          text: getSlug(),
          url: window.location.href
        }).then(function () {
          return console.log('Successful share');
        }).catch(function (error) {
          return console.log('Error sharing', error);
        });
      } else {
        const dummy = document.createElement('textarea');
        dummy.value = window.location.href;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
    }
  }));

  const $about = $menu.querySelector('.about');
  const $abountContent = $aside.querySelector('.about-content');
  $about.addEventListener('click', () => $abountContent.classList.remove('hide'));
  $abountContent.querySelector('.overlay').addEventListener('click', () => $abountContent.classList.add('hide'));
});

let getSlug;

var setupUrlSaving = (() => {
  const params = new window.URLSearchParams(window.location.search);
  const content = document.querySelector('main');

  // Load content from URL, if any.
  const load = (() => {
    var _ref = asyncToGenerator(function* () {
      let text = params.get('t');
      const key = params.get('s');
      if (key) {
        spin();
        text = new URLSearchParams(new URL((yield lookupUrl('https://is.gd/' + key))).search).get('t');
        params.delete('s');
        params.set('t', new URLSearchParams(new URL((yield lookupUrl('https://is.gd/' + key))).search).get('t'));
        window.history.pushState({}, '', window.location.pathname + '?' + params);
        updateKey(key);
      }
      content.innerHTML = text || 'toki!';
      title();
    });

    return function load() {
      return _ref.apply(this, arguments);
    };
  })();
  // Save content to the URL.
  const save = function () {
    params.set('t', content.innerHTML // Replace div soup with newlines.
    .replace(/<div>/g, '\n').replace(/<\/?(div|br)>/g, ''));
    window.history.replaceState({}, '', window.location.pathname + '?' + params);
    makeKeyStale();
  };
  // Update title from content.
  getSlug = () => {
    for (let line of content.innerHTML.split('<br>')) {
      if (line) {
        return line.replace(/<[a-z0-9-]+>/g, '');
      }
    }
  };
  const title = function () {
    document.title = 'isipo - ' + getSlug();
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
        // TODO: Consider `document.execCommand('indent')` and `outdent`
        document.execCommand('insertHTML', false, '&#9');
        e.preventDefault();
        break;
    }
  };

  // Initialize.
  load();
  focus();
});

document.onreadystatechange = function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {};
    setupMenu();
    setupUrlSaving();
  }
};

//# sourceMappingURL=index.js.map
