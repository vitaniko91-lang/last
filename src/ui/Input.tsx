import { useId } from 'react'

interface Props {
  label: string
  value: string
  onChange: (v: string) => void
  /** По назначению. «off» браузеры на этих полях игнорируют по спецификации. */
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'email' | 'tel'
  error?: string
}

export function Input({ label, value, onChange, autoComplete, inputMode = 'text', error }: Props) {
  const id = useId()
  const hintId = `${id}-hint`
  return (
    <div className="flex flex-col gap-2">
      {/* Видимый лейбл всегда: placeholder исчезает при первом же символе,
          и человек, отвлёкшийся на середине формы, теряет, что это за поле. */}
      <label htmlFor={id} className="label text-[var(--color-text-secondary)]">{label}</label>
      <input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={error ? hintId : undefined}
        aria-invalid={error ? true : undefined}
        className={
          'w-full min-h-12 px-4 py-3 bg-[var(--color-surface)] border ' +
          (error ? 'border-[var(--color-semantic-error)]' : 'border-[var(--color-border-default)]')
        }
      />
      {error && <p id={hintId} className="text-[var(--color-semantic-error)]">{error}</p>}
    </div>
  )
}
