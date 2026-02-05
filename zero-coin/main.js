/** @type {<K extends keyof HTMLElementTagNameMap> (tag: K, f: (_: HTMLElementTagNameMap[K]) => unknown) => HTMLElementTagNameMap[K]} */
const createElement = (tag, f) => {
  const el = document.createElement (tag)
  f (el)
  return el
}

add_button.addEventListener ('click', () => {
  products_view.appendChild (createElement ('div', (div) => {
    div.classList.add ('product_view')
    div.appendChild (createElement ('input', (input) => {
      input.type = 'text'
      input.name = 'label'
      input.placeholder = `Label${products_view.children.length + 1}`
    }))
    div.appendChild (createElement ('input', (input) => {
      input.type = 'text'
      input.inputMode = 'numeric'
      input.name = 'price'
      input.placeholder = `円`
    }))
    div.appendChild (createElement ('input', (input) => {
      input.type = 'text'
      input.inputMode = 'numeric'
      input.name = 'count'
      input.value = '1'
    }))
    div.appendChild (createElement ('button', (button) => {
      button.classList.add ('remove_button')
      button.addEventListener ('click', () => {
        div.remove ()
      })
    }))
  }))
})

solve_button.addEventListener ('click', () => {
  const a = parseInt (input_money.value || '0', 10)
  if (! (a >= 0))
  {
    result_view.textContent = '所持金 is invalid'
    return
  }
  const mod = parseInt (input_mod.value || '0', 10)
  if (! (mod > 0))
  {
    result_view.textContent = 'mod must be positive integer'
    return
  }

  const products = []
  for (const el of products_view.children)
  {
    const label = el.querySelector ('input[name="label"]')
    const price = el.querySelector ('input[name="price"]')
    const count = el.querySelector ('input[name="count"]')

    products.push ({
      label: label.value || label.placeholder,
      price: parseInt (price.value || '0', 10),
      count: parseInt (count.value || '0', 10),
    })
  }

  console.log ('products', products)

  /** `dp_sum[i]`: i円を作れる最小の合計金額 */
  let dp_sum = new Float64Array (mod)
  dp_sum.fill (Infinity)
  /**
    @type {(Uint32Array | undefined)[]}
    `dp_purchases[i][j]`: i円を作れるとき、j番目の商品を買った個数
  */
  let dp_purchases = new Array (mod)

  // 何も購入しないことは可能
  dp_sum[0] = 0
  // TypedArrayは0初期化される
  dp_purchases[0] = new Uint32Array (products.length)

  /** @type {typeof dp_sum} */
  let ndp_sum = dp_sum.slice ()
  /** @type {typeof dp_purchases} */
  let ndp_purchases = dp_purchases.slice ()

  for (let pi = 0; pi < products.length; ++ pi)
  {
    const p = products[pi]
    for (let j = 0; j < p.count; ++ j)
    {
      ndp_sum.set (dp_sum)
      for (let i = 0; i < mod; ++ i)
      {
        ndp_purchases[i] = dp_purchases[i]
      }

      for (let i = 0; i < mod; ++ i)
      {
        if (isFinite (dp_sum[i]))
        {
          const ni = (i + p.price) % mod
          const ns = dp_sum[i] + p.price
          if (ns < ndp_sum[ni])
          {
            ndp_sum[ni] = ns
            ndp_purchases[ni] = dp_purchases[i].slice ()
            ++ ndp_purchases[ni][pi]
          }
        }
      }

      // swap
      {
        const tmp = dp_sum
        dp_sum = ndp_sum
        ndp_sum = tmp
      }
      {
        const tmp = dp_purchases
        dp_purchases = ndp_purchases
        ndp_purchases = tmp
      }
    }
  }
  console.log ('dp_sum', dp_sum)
  console.log ('dp_purchases', dp_purchases)

  const res_sum = dp_sum[a % mod]
  const res_purchases = dp_purchases[a % mod]
  if (! isFinite (res_sum))
  {
    result_view.textContent = '解なし'
  }
  else
  {
    const fragment = document.createDocumentFragment ()
    for (let pi = 0; pi < products.length; ++ pi)
    {
      if (res_purchases[pi] > 0)
      {
        fragment.appendChild (createElement ('pre', (pre) => {
          pre.textContent = `${products[pi].label} ×${res_purchases[pi]} ¥${products[pi].price * res_purchases[pi]}`
        }))
      }
    }
    fragment.appendChild (document.createElement ('hr'))
    fragment.appendChild (createElement ('pre', (pre) => {
      pre.textContent = `合計: ¥${res_sum}\n  ${a} - ${res_sum}\n= ${a - res_sum}\n≡ 0 (mod ${mod})`
    }))
    result_view.replaceChildren (fragment)
  }
})
