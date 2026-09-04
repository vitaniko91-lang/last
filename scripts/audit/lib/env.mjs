// cases/last/scripts/audit/lib/env.mjs

// Вкладка может быть невидимой, а скриншот при этом снимется нормально — поэтому
// решающий признак здесь частота кадров, а не visibilityState. Фокус окна отдельно:
// он часто false в автоматизации и сам по себе замер не портит.
const FPS_FLOOR = 30
// Счётчик кадров за реальную секунду физически не может уйти выше этого.
// Значение сверху означает сломанный замер, а не отличную страницу.
const FPS_CEILING = 240

export function isMeasurable({ fps, visibilityState, hasFocus } = {}) {
  const blockers = []
  const warnings = []

  if (visibilityState !== 'visible') blockers.push(`visibilityState=${visibilityState}`)

  const fpsIsNumber = typeof fps === 'number' && Number.isFinite(fps)
  if (!fpsIsNumber || fps < FPS_FLOOR || fps > FPS_CEILING) {
    blockers.push(`fps=${fpsIsNumber ? fps : 'unknown'}`)
  }

  if (hasFocus === false) warnings.push('window not focused')
  else if (typeof hasFocus !== 'boolean') warnings.push('hasFocus не снят')

  return { ok: blockers.length === 0, blockers, warnings }
}

// Утверждение о ВЁРСТКЕ не зависит от частоты кадров. Замер 2026-09-04:
// одна страница дала 9, 12 и 34 fps в трёх режимах запуска и одинаковый
// scrollWidth во всех трёх. Поэтому вёрстку гейтим по вёрстке.
// isMeasurable выше остаётся для утверждений про анимацию и тайминги.
const MIN_BODY_TEXT = 500

export function isLayoutMeasurable({ visibilityState, innerWidth, expectedWidth, bodyTextLength, url } = {}) {
  const blockers = []

  if (visibilityState !== 'visible') blockers.push(`visibilityState=${visibilityState}`)

  if (typeof innerWidth !== 'number' || innerWidth !== expectedWidth) {
    blockers.push(`innerWidth=${innerWidth}, ожидалось ${expectedWidth}`)
  }

  // Слишком короткое тело — это не пустой магазин, это заглушка антибота
  // или недогруженная страница.
  if (!(bodyTextLength >= MIN_BODY_TEXT)) {
    blockers.push(`bodyTextLength=${Number.isFinite(bodyTextLength) ? bodyTextLength : 'unknown'}`)
  }

  if (typeof url !== 'string' || url === 'about:blank') blockers.push(`url=${url}`)

  return { ok: blockers.length === 0, blockers }
}
