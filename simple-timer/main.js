const time_view = document.getElementById ('time_view')
const progress_bar = document.getElementById ('progress_bar')
const buttons_container = document.getElementById ('buttons_container')

class InputBuf
{
  /** @type {string[]} */
  buf = []

  /** @param {string} str */
  push (str)
  {
    this.buf.push (str)
  }

  pop ()
  {
    this.buf.pop ()
  }

  clear ()
  {
    this.buf.length = 0
  }

  as_str ()
  {
    return this.buf.join ('') || '0'
  }

  solve ()
  {
    let res = 0
    let tmp = 0
    for (const k of this.buf)
    {
      if (k === 'h')
      {
        res += tmp * 3600
        tmp = 0
      }
      else if (k === 'm')
      {
        res += tmp * 60
        tmp = 0
      }
      else if (k === 's')
      {
        res += tmp
        tmp = 0
      }
      else if ('0' <= k && k <= '9')
      {
        tmp *= 10
        tmp += k.charCodeAt (0) - 48
      }
    }
    res += tmp
    return res
  }
}

// /** @type {string[]} */
const input_buf = new InputBuf ()

let duration
let started_timestamp
/** @type {WakeLockSentinel | undefined} */
let wakeLock

const circumference = 90 * Math.PI

/** @param {number} sec */
const strftime = (sec) => {
  const h = Math.floor (sec / 3600)
  const m = Math.floor ((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0)
  {
    return `${h}:${m.toString ().padStart (2, '0')}:${s.toString ().padStart (2, '0')}`
  }
  else if (m > 0)
  {
    return `${m}:${s.toString ().padStart (2, '0')}`
  }
  else
  {
    return `${s}`
  }
}

/** @type {AudioContext} */
let audioCtx
const beep = () => {
  // @ts-ignore
  audioCtx ??= new (window.AudioContext || window.webkitAudioContext)()

  const now = audioCtx.currentTime;

  for (let i = 0; i < 4; i++) {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = "sine"
    // 2093Hz = C7
    osc.frequency.value = 2093

    osc.connect(gain)
    gain.connect(audioCtx.destination)

    // BEEP_INTERVAL: 0.1s
    const t = now + i * 0.1

    // BEEP_GAIN: 0.2 = 20%
    gain.gain.setValueAtTime(0.2, t)
    // BEEP_LENGTH: 0.1sかけて音量を0.0001にする(0にはできないらしい)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)

    osc.start(t)
    // BEEP_LENGTH: 0.1s
    osc.stop(t + 0.1)
  }
}

// 画面をつけっぱなしにするAPI, chromeで動作するらしい
const requestWakeLock = async () => {
  wakeLock = await navigator.wakeLock.request ('screen')
  wakeLock.addEventListener ('release', () => { wakeLock = undefined })
}

const tick = () => {
  const now = Date.now ()

  const elapsed = now - started_timestamp
  const rate = elapsed / duration

  progress_bar.style.strokeDashoffset = rate < 1 ? `${300 - rate * circumference}` : '0'

  if (elapsed < duration)
  {
    time_view.textContent = strftime (Math.ceil ((duration - elapsed) / 1000))
    requestAnimationFrame (tick)
  }
  else
  {
    time_view.textContent = '0'
    duration = undefined
    started_timestamp = undefined
    beep ()
    wakeLock?.release ()
  }
}


const start = async () => {
  duration = input_buf.solve () * 1000
  input_buf.clear ()
  started_timestamp = Date.now ()
  requestAnimationFrame (tick)
  requestWakeLock ()
}


document.addEventListener ('keydown', (ev) => {
  if (duration == null)
  {
    if (('0' <= ev.key && ev.key <= '9') || (ev.key === 'h' || ev.key === 'm' || ev.key === 's'))
    {
      input_buf.push (ev.key)
      time_view.textContent = input_buf.as_str ()
    }
    else if (ev.key === 'Backspace')
    {
      input_buf.pop ()
      time_view.textContent = input_buf.as_str ()
    }
    else if (ev.key === 'Enter')
    {
      start ()
    }
  }
})

document.addEventListener ('touchend', (ev) => {
  if (duration == null && buttons_container.style.display === 'none')
  {
    ev.preventDefault ()
    // ev.stopPropagation ()
    buttons_container.style.display = ''
  }
}, {passive: false})

/** @param {Event} ev*/
const inputButtonHandler = (ev) => {
  if (ev.currentTarget != null)
  {
    const id = ev.currentTarget.getAttribute ('id')
    if (id === 'start_button')
    {
      start ()
      buttons_container.style.display = 'none'
    }
    else if (id === 'backspace_button')
    {
      input_buf.pop ()
      time_view.textContent = input_buf.as_str ()
    }
    else
    {
      const content = ev.currentTarget.textContent
      if (content !== '')
      {
        input_buf.push (content)
        time_view.textContent = input_buf.as_str ()
      }
    }
  }
}

for (const b of buttons_container.children)
{
  if (b instanceof HTMLButtonElement)
  {
    b.addEventListener ('click', inputButtonHandler)
  }
}
