import { useEffect, useState } from 'react'

// A short wait after an action before it can run again, e.g. to stop a button from flooding an API.
// `start()` begins the wait; `active` and `secondsLeft` update while it counts down.
export function useCooldown(ms) {
  const [until, setUntil] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (until === 0) return
    const timer = setInterval(() => {
      const time = Date.now()
      setNow(time)
      if (time >= until) clearInterval(timer)
    }, 250)
    return () => clearInterval(timer)
  }, [until])

  const remaining = Math.max(0, until - now)

  function start() {
    const time = Date.now()
    setNow(time)
    setUntil(time + ms)
  }

  return { active: remaining > 0, secondsLeft: Math.ceil(remaining / 1000), start }
}
