// cases/last/scripts/audit/lib/metrics.mjs

// Порог из design.md: 40×40. WCAG 2.2 §2.5.8 разрешает 24, дом держит 40,
// потому что 40 покрывает ещё и досягаемость большого пальца.
export const TAP_TARGET_MIN = 40

// Замер, который не состоялся, обязан падать, а не отвечать благоприятно.
// Утвердительное «у этого магазина всё в порядке», выведенное из пустоты, —
// это ложное заявление о чужом живом бизнесе.
function requireFinite(name, value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name}: ожидалось конечное число, получено ${JSON.stringify(value)}`)
  }
  return value
}

export function overflowReport({ scrollWidth, clientWidth, offenders = [] } = {}) {
  requireFinite('scrollWidth', scrollWidth)
  requireFinite('clientWidth', clientWidth)
  const overflowBy = scrollWidth - clientWidth
  const overflows = overflowBy > 1
  return { overflows, overflowBy, offenders: overflows ? offenders : [] }
}

export function tapTargetReport(targets, min = TAP_TARGET_MIN) {
  if (!Array.isArray(targets)) {
    throw new TypeError(`targets: ожидался массив, получено ${JSON.stringify(targets)}`)
  }
  targets.forEach((t, i) => {
    requireFinite(`targets[${i}].width`, t?.width)
    requireFinite(`targets[${i}].height`, t?.height)
  })

  const failing = targets
    .filter(t => t.width < min || t.height < min)
    .map(t => ({ tag: t.tag, width: Math.round(t.width), height: Math.round(t.height) }))

  // null, а не true: нулевая выборка означает несостоявшийся замер, а не порядок.
  const passes = targets.length > 0 ? failing.length === 0 : null

  return { min, total: targets.length, failing, passes }
}
