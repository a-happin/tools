const timer_view = document.getElementById ('timer')
const progress_bar = document.getElementById ('progress_bar')
/** @type {string[]} */
const input_buf = []

let duration
let started_timestamp

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

const tick = () => {
  const now = Date.now ()

  const elapsed = now - started_timestamp
  const rate = elapsed / duration
  progress_bar.style.strokeDashoffset = `${300 - rate * circumference}`

  if (elapsed < duration)
  {
    timer_view.textContent = strftime (Math.ceil ((duration - elapsed) / 1000))
    requestAnimationFrame (tick)
  }
  else
  {
    timer_view.textContent = '0'
    duration = undefined
    started_timestamp = undefined
    beep ()
  }
}

const start = () => {
  started_timestamp = Date.now ()
  requestAnimationFrame (tick)
}

document.addEventListener ('keydown', (ev) => {
  if (duration == null)
  {
    if (('0' <= ev.key && ev.key <= '9') || (ev.key === 'h' || ev.key === 'm' || ev.key === 's'))
    {
      input_buf.push (ev.key)
      timer_view.textContent = input_buf.join ('')
    }
    else if (ev.key === 'Backspace')
    {
      input_buf.pop ()
      timer_view.textContent = input_buf.join ('')
    }
    else if (ev.key === 'Enter' || ev.key === 'Space')
    {
      duration = 0
      let tmp = 0
      for (const k of input_buf)
      {
        if (k === 'h')
        {
          duration += tmp * 3600
          tmp = 0
        }
        else if (k === 'm')
        {
          duration += tmp * 60
          tmp = 0
        }
        else if (k === 's')
        {
          duration += tmp
          tmp = 0
        }
        else
        {
          tmp *= 10
          tmp += k.charCodeAt (0) - 48
        }
      }
      duration += tmp
      // console.log ('duration', duration)
      input_buf.length = 0
      duration *= 1000
      start ()
    }
  }
})
