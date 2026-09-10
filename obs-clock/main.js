const time_view = {
  hour: /** @type {HTMLElement} */ (document.getElementById ('time_view_hour')),
  min: /** @type {HTMLElement} */ (document.getElementById ('time_view_min')),
  sec: document.getElementById ('time_view_sec'),
}
const date_view = /** @type {HTMLElement} */(document.getElementById ('date_view'))

const day_table = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** @param {Date} date */
const strftime = (date) => ({
  get hour () {
    return date.getHours ().toString ().padStart (2, '0')
  },
  get min () {
    return date.getMinutes ().toString ().padStart (2, '0')
  },
  get sec () {
    return date.getSeconds ().toString ().padStart (2, '0')
  },
  get year () {
    return date.getFullYear ()
  },
  get month () {
    return (date.getMonth () + 1).toString ().padStart (2, '0')
  },
  get date () {
    return date.getDate ().toString ().padStart (2, '0')
  },
  get day () {
    return day_table[date.getDay ()]
  },
})

const draw = () => {
  const date = strftime (new Date ())
  time_view.hour.textContent = date.hour
  time_view.min.textContent = date.min
  if (time_view.sec != null) time_view.sec.textContent = date.sec
  date_view.textContent = `${date.year}-${date.month}-${date.date} ${date.day}`
}

draw ()
setTimeout (() => {
  setInterval (draw, 1000)
  draw ()
}, 1000 - Date.now () % 1000)

// コロンのアニメーションを開始
// 偶数秒で始まるように調整
setTimeout (() => {
  for (const elem of document.getElementsByClassName ('colon'))
  {
    elem.classList.add ('blink')
  }
}, 2000 - Date.now () % 2000)
