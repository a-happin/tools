const time_view = document.getElementById ('time_view')
const date_view = document.getElementById ('date_view')

/** @param {Date} date */
const format_time = (date) => {
  const H = date.getHours ().toString ().padStart (2, '0')
  const M = date.getMinutes ().toString ().padStart (2, '0')
  const S = date.getSeconds ().toString ().padStart (2, '0')
  return `${H}:${M}:${S}`
}

const day_table = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** @param {Date} date */
const format_date = (date) => {
  const Y = date.getFullYear ()
  const m = (date.getMonth () + 1).toString ().padStart (2, '0')
  const d = date.getDate ().toString ().padStart (2, '0')
  const w = date.getDay ()

  return `${Y}/${m}/${d} (${day_table[w]})`
}

const draw = () => {
  const date = new Date ()
  time_view.textContent = format_time (date)
  date_view.textContent = format_date (date)
}

draw ()
setTimeout (() => {
  setInterval (draw, 1000)
  draw ()
}, 1000 - Date.now () % 1000)
