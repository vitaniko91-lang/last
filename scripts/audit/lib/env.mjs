// cases/last/scripts/audit/lib/env.mjs

// Вкладка может быть невидимой, а скриншот при этом снимется нормально — поэтому
// решающий признак здесь частота кадров, а не visibilityState. Фокус окна отдельно:
// он часто false в автоматизации и сам по себе замер не портит.
export function isMeasurable({ fps, visibilityState, hasFocus } = {}) {
  const blockers = []
  const warnings = []

  if (visibilityState !== 'visible') blockers.push(`visibilityState=${visibilityState}`)
  if (!(fps >= 30)) blockers.push(`fps=${Number.isFinite(fps) ? fps : 'unknown'}`)
  if (hasFocus === false) warnings.push('window not focused')

  return { ok: blockers.length === 0, blockers, warnings }
}
