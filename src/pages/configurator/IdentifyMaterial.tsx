import { useState } from 'react'
import { SIGN_QUESTIONS, identifyMaterial, type Signs } from '../../kit/identify'
import { MATERIAL_INFO } from '../../lib/materials'
import { MaterialTexture } from '../../ui/MaterialTexture'
import { Button } from '../../ui/Button'
import type { Material } from '../../kit/types'

interface Props {
  onDone: (m: Material) => void
  onCancel: () => void
}

/**
 * Ни в одном вопросе нет названия материала: ветку сделали ровно для тех, кто
 * этих названий не знает. Вопрос про потемнение задаётся, только если первые
 * два «нет» — иначе он бессмыслен.
 */
export function IdentifyMaterial({ onDone, onCancel }: Props) {
  const [signs, setSigns] = useState<Partial<Signs>>({})

  const asked = SIGN_QUESTIONS.filter((_, i) => {
    if (i === 0) return true
    if (i === 1) return signs.nap === false
    return signs.nap === false && signs.glossy === false
  })
  const current = asked.find(q => signs[q.key] === undefined)
  const decided =
    signs.nap === true ||
    signs.glossy === true ||
    signs.darkensUnderThumb !== undefined
  const guess = decided ? identifyMaterial(signs as Signs) : null

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[length:var(--font-size-h2)] leading-[var(--line-height-h2)]">Посмотрите на вещь</h1>
        <p className="mt-3 text-[var(--color-text-secondary)] max-w-[60ch]">
          Вопросы про то, что видно и что чувствуется под пальцем. Ни одного
          названия материала — их знать не нужно.
        </p>
      </div>

      {current && (
        <div className="p-5 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-5">
          <p className="label text-[var(--color-text-secondary)] tnum">
            Вопрос {asked.indexOf(current) + 1} из {SIGN_QUESTIONS.length}
          </p>
          <h2 className="text-[length:var(--font-size-h3)] leading-[var(--line-height-h3)]">{current.text}</h2>
          <div className="flex gap-3">
            <Button onClick={() => setSigns(s => ({ ...s, [current.key]: true }))}>Да</Button>
            <Button styleName="secondary" onClick={() => setSigns(s => ({ ...s, [current.key]: false }))}>Нет</Button>
          </div>
        </div>
      )}

      {guess && (
        <div className="p-5 sm:p-8 bg-[var(--color-surface)] border-2 border-[var(--color-accent-base)] flex flex-col gap-5">
          <div className="flex items-center gap-5">
            <div className="w-18 shrink-0">
              <MaterialTexture material={guess} sizes="72px" />
            </div>
            <div>
              <p className="label text-[var(--color-text-secondary)]">Похоже на</p>
              <p className="font-[family-name:var(--font-family-display)] font-semibold text-[length:var(--font-size-h3)]">
                {MATERIAL_INFO[guess].title}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Button onClick={() => onDone(guess)}>Верно, дальше</Button>
            <Button styleName="ghost" onClick={onCancel}>Выбрать самой</Button>
          </div>
        </div>
      )}
    </div>
  )
}
