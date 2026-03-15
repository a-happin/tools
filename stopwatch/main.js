
const time_view = /** @type {HTMLElement} */ (document.getElementById ('time_view'))
const progress_bar = /** @type {HTMLElement} */ (document.getElementById ('progress_bar'))

/** @param {{on_tick: (elapsed: number) => void}} _ */
const create_timer_engine = ({on_tick}) => {
  let elapsed = 0

  /** @type {number | undefined} */
  let raf_id

  const pause = () => {
    if (raf_id != null)
    {
      raf_id = void cancelAnimationFrame (raf_id)
    }
  }

  const stop = () => {
    pause ()
    elapsed = 0
  }

  const start = () => {
    raf_id ??= requestAnimationFrame ((now) => {
      let started = now - elapsed
      /** @param {number} now */
      const tick = (now) => {
        elapsed = now - started
        on_tick (elapsed)
        raf_id = requestAnimationFrame (tick)
      }
      tick (now)
    })
  }

  return {
    start,
    stop,
    pause,
    is_running: () => raf_id != null,
  }
}

/** @param {number} sec */
const strftime = (sec) => {
  const h = Math.floor (sec / 3600)
  const m = Math.floor (sec % 3600 / 60)
  const s = sec % 60
  if (h > 0)
  {
    return `${h}:${m.toString ().padStart (2, '0')}:${s.toString ().padStart (2, '0')}`
  }
  else
  {
    return `${m.toString ().padStart (2, '0')}:${s.toString ().padStart (2, '0')}`
  }
}

const duration = 300000
const circumference = 90 * Math.PI

/** @param {number} elapsed */
const render = (elapsed) => {
  time_view.textContent = strftime (Math.floor (elapsed / 1000))
  const rate = elapsed / duration
  progress_bar.style.strokeDashoffset = rate < 1 ? `${300 - rate * circumference}` : '0'
}

const timer = create_timer_engine ({on_tick: render})

document.getElementById ('start_button')?.addEventListener ('click', () => {
  if (timer.is_running ())
  {
    timer.pause ()
    document.body.setAttribute ('timer_status', "pause")
  }
  else
  {
    timer.start ()
    document.body.setAttribute ('timer_status', "running")
  }
})

document.getElementById ('stop_button')?.addEventListener ('click', () => {
  timer.stop ()
  render (0)
  document.body.setAttribute ('timer_status', "stopped")
})

export {}
