// cases/last/scripts/audit/lib/metrics.mjs

// Порог из design.md: 40×40. WCAG 2.2 §2.5.8 разрешает 24, дом держит 40,
// потому что 40 покрывает ещё и досягаемость большого пальца.
export const TAP_TARGET_MIN = 40

export function overflowReport({ scrollWidth, clientWidth, offenders = [] }) {
  const overflowBy = scrollWidth - clientWidth
  const overflows = overflowBy > 1
  return { overflows, overflowBy, offenders: overflows ? offenders : [] }
}

export function tapTargetReport(targets, min = TAP_TARGET_MIN) {
  const failing = targets
    .filter(t => t.width < min || t.height < min)
    .map(t => ({ tag: t.tag, width: Math.round(t.width), height: Math.round(t.height) }))
  return { min, total: targets.length, failing, passes: failing.length === 0 }
}
