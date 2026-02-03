import {MersenneTwister} from "./mt.js"

const mt = new MersenneTwister ()
const re = /^(\d*)[dD](\d+)$/

/** @type {<K extends keyof HTMLElementTagNameMap> (tag: K, f: (_: HTMLElementTagNameMap[K]) => unknown) => HTMLElementTagNameMap[K]} */
const createElement = (tag, f) => {
  const el = document.createElement (tag)
  f (el)
  return el
}

const log = (text) => {
  result_view.insertBefore (createElement ('p', (p) => {
    p.textContent = text
  }), result_view.firstChild)
}

/** @param {string} instr */
const diceroll = (instr) => {
  const res = instr.match (re)
  if (res == null)
  {
    log (`${instr} => invalid expression`)
    return
  }
  const n = parseInt (res[1] || '1', 10)
  const diceMax = parseInt (res[2], 10)
  if (diceMax === 0)
  {
    log (`${instr} => invalid expression`)
    return
  }
  // console.log ({n, diceMax})
  const results = []
  for (let i = 0; i < n; ++ i)
  {
    results.push (mt.nextInt (0, diceMax) + 1)
  }
  if (results.length === 1)
  {
    log (`${instr} => ${results[0]}`)
  }
  else
  {
    const sum = results.reduce ((acc, val) => acc + val, 0)
    log (`${instr} => [${results.join (', ')}], sum: ${sum}`)
  }
}

/** @param {string} button_text */
const has_button = (button_text) => {
  for (const btn of button_area.children)
  {
    if (btn.textContent === button_text)
    {
      return true
    }
  }
  return false
}

input.addEventListener ('keypress', (ev) => {
  if (ev.key === 'Enter')
  {
    ev.preventDefault ()
    diceroll (input.value)

    if (! has_button (input.value))
    {
      button_area.appendChild (createElement ('button', (button) => {
        button.textContent = input.value
      }))
    }

    input.value = ''
  }
})

button_area.addEventListener ('click', (ev) => {
  if (ev.target instanceof HTMLButtonElement)
  {
    diceroll (ev.target.textContent)
  }
})
