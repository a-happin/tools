const button = /** @type {HTMLButtonElement} */ (document.getElementById ('button'))

let cnt = 0
function count ()
{
  button.textContent = `${++ cnt}`
}

button.addEventListener ('click', count)
document.addEventListener ('keydown', (ev) => {
  if (ev.ctrlKey || ev.altKey || ev.metaKey)
  {
    return
  }
  count ()
})
