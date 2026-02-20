const params = new URLSearchParams (location.search)
const url = params.get ('url')
const timeout = params.get ('timeout')

/** @param {string} str */
const parseTime = (str) => {
  const res = parseInt (str, 10)
  if (isFinite (res))
  {
    return res
  }
}

/** @type {<K extends keyof HTMLElementTagNameMap> (tag: K, f: (_: HTMLElementTagNameMap[K]) => unknown) => HTMLElementTagNameMap[K]} */
const createElement = (tag, f) => {
  const elem = document.createElement (tag)
  f (elem)
  return elem
}

if (url != null)
{
  const fragment = document.createDocumentFragment ()
  fragment.appendChild (createElement ('p', (p) => p.textContent = 'このページはブロックされています'))
  fragment.appendChild (createElement ('p', (p) => p.textContent = '作業に集中しましょう'))
  fragment.appendChild (createElement ('a', (a) => {
    a.textContent = 'Go'
    a.href = url
  }))
  document.body.appendChild (fragment)
  if (timeout != null)
  {
    const sec = parseTime (timeout)
    if (sec != null)
    {
      setTimeout (() => {
        location.href = url
      }, sec * 1000)
    }
  }
}
