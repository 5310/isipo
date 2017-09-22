document.onreadystatechange = function () {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.onreadystatechange = () => {};

    const params = new window.URLSearchParams(window.location.search);
    const content = document.querySelector('main');

    // Load content from URL, if any.
    const load = function () {
      const t = params.get('t');
      if (t) content.innerHTML = t;
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
          document.title = 'isipo' + ' - ' + line.slice(0, -5).trim();
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

    // Let tabs be tabs~
    document.onkeydown = function (e) {
      if (e.keyCode === 9) {
        // TODO: Consider indent/outdent for selections with tab/shift+tab.
        document.execCommand('insertHTML', false, '&#9');
        e.preventDefault();
      }
      if (e.keyCode === 13) {
        document.execCommand('insertHTML', false, '<br><br>');
        e.preventDefault();
      }
    };

    // Initialize.
    load();
    title();
    focus();
  }
};

//# sourceMappingURL=index.js.map
