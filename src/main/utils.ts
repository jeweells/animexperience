export const cleanName = (s: string) => {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\s0-9a-zA-Z]/g, ' ')
    .toLowerCase()
}

export const similarity = (s1: string, s2: string) => {
  let longer = s1
  let shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  const longerLength = longer.length
  if (longerLength === 0) {
    return 1.0
  }
  return (longerLength - editDistance(longer, shorter)) / longerLength
}
function editDistance(s1: string, s2: string) {
  s1 = s1.toLowerCase()
  s2 = s2.toLowerCase()

  const costs: number[] = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j
      else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const retry = <T>(call: () => Promise<T>, intervalMs: number) => {
  let _stop = false
  const stop = () => {
    _stop = true
  }

  const loop = async () => {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (_stop) return null
      try {
        return await call()
      } catch {
        await sleep(intervalMs)
        continue
      }
    }
  }

  return { promise: loop(), stop }
}
