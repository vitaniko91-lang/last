import { useId } from 'react'
import type { Task } from '../kit/types'
import { TASK_INFO } from '../lib/tasks'

interface Props {
  task: Task
  checked: boolean
  /** Задача невозможна для выбранного материала. Помечена — но кликабельна:
   *  заблокировать значило бы сказать «нельзя» вместо «вот почему». */
  marked: boolean
  markLabel?: string
  explanation?: string
  substitute?: { title: string; note: string }
  onToggle: (next: boolean) => void
}

export function TaskRow({ task, checked, marked, markLabel, explanation, substitute, onToggle }: Props) {
  const info = TASK_INFO[task]
  const id = useId()
  const noteId = `${id}-note`

  return (
    <div>
      <button
        role="checkbox"
        type="button"
        aria-checked={checked}
        aria-describedby={explanation ? noteId : undefined}
        onClick={() => onToggle(!checked)}
        className="@container w-full flex flex-wrap items-center gap-x-4 gap-y-3 px-4 sm:px-6 py-5 text-left bg-[var(--color-surface)] border border-[var(--color-border-default)] cursor-pointer"
      >
        <span
          aria-hidden
          className={
            'shrink-0 w-6 h-6 flex items-center justify-center border-[1.5px] ' +
            (checked
              ? 'bg-[var(--color-accent-base)] border-[var(--color-accent-base)]'
              : 'border-[var(--color-border-strong)]')
          }
        >
          {checked && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="var(--color-text-on-accent)" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12.5 10 16.5 18 8" />
            </svg>
          )}
        </span>
        <span className="flex-1 basis-[calc(100%-2.5rem)] @sm:basis-0 min-w-0">
          <span className="block font-semibold">{info.title}</span>
          <span className="block text-[var(--color-text-secondary)]">{info.hint}</span>
        </span>
        {marked && markLabel && (
          // Тег уходит на свою строку, когда строка задачи узкая: рядом с
          // текстом он сдавливает подсказку в колонку шириной с одно слово.
          <span className="label shrink-0 ml-10 @sm:ml-0 px-3 py-2 border border-[var(--color-semantic-warning)] text-[var(--color-semantic-warning)]">
            {markLabel}
          </span>
        )}
      </button>

      {/* Объяснение появляется на месте, рядом с флажком, а не модалкой,
          и анонсируется вежливо — не перебивая то, что человек читает. */}
      <div aria-live="polite">
        {explanation && (
          <div id={noteId} className="flex flex-col gap-4 p-4 sm:p-6 bg-[var(--color-surface)] border border-t-0 border-[var(--color-semantic-warning)]">
            <p>{explanation}</p>
            {substitute && (
              <div className="p-4 bg-[var(--color-surface-alpha-accent)]">
                <p className="font-semibold">Вместо этого — {substitute.title}</p>
                <p className="text-[var(--color-text-secondary)]">{substitute.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
