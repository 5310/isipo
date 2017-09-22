if (location.protocol === 'http:') location.protocol = 'https:';
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => console.log('Service Worker registered', reg)).catch(err => console.error('Service Worker **not** registered', err));
} else {
  console.warn('Service Worker not supported in this browser');
}

document.onreadystatechange = function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {};

    const params = new window.URLSearchParams(window.location.search);
    const content = document.querySelector('main');

    // Load content from URL, if any.
    const load = function () {
      content.innerHTML = params.get('t') || 'toki!<br>' + 'ni li ilo sitelen-pona<br>' + 'ni li ilo pi sitelen lon sitelen-pona. ni li sitelen kepeken linja-pona<br>' + 'jan [_sitelen_ante_musi_esun] pali ee linja-pona. jan ni li pona mute!';
    };
    // Save content to the URL.
    const save = function () {
      params.set('t', content.innerHTML);
      window.history.replaceState({}, '', window.location.pathname + '?' + params);
    };
    // Update title from content.
    const title = function () {
      for (let line of content.innerHTML.split('<br>')) {
        if (line) {
          document.title = 'isipo' + ' - ' + line;
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
  }
};

//# sourceMappingURL=index.js.map
