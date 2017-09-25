export const shortenUrl = url =>
  fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url))
    .then(res => res.json())
    .then(({shorturl}) => shorturl)

export const lookupUrl = shorturl =>
  fetch('https://is.gd/forward.php?format=json&shorturl=' + encodeURIComponent(shorturl))
    .then(res => res.json())
    .then(({url}) => url)
