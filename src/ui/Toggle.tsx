interface Props {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  note?: string
}

/**
 * Выключенное состояние читается ОБВОДКОЙ, а не заливкой: заливка
 * border/strong даёт 1.44:1 на белом, и переключатель просто исчезает.
 * Состояние несут положение кнопки и подпись — не только цвет.
 *
 * Переход объявлен на `left`, а не на `transform`: меняется именно `left`,
 * и `transition-transform` про него ничего не знает.
 */
export function Toggle({ checked, onChange, label, note }: Props) {
  return (
    <div className="flex items-start gap-4">
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-11 h-10 flex items-center cursor-pointer"
      >
        <span
          aria-hidden
          className={
            'block w-11 h-6 rounded-full transition-colors duration-200 ' +
            (checked
              ? 'bg-[var(--color-accent-base)]'
              : 'border-[1.5px] border-[var(--color-text-secondary)]')
          }
        />
        <span
          aria-hidden
          className={
            'absolute top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full ' +
            'transition-[left] duration-200 ' +
            (checked
              ? 'left-[23px] bg-[var(--color-text-on-accent)]'
              : 'left-[3px] bg-[var(--color-text-secondary)]')
          }
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className="font-semibold">{label}</p>
        <p className="text-[var(--color-text-secondary)]">
          {checked ? 'Включено' : 'Выключено'}{note ? `. ${note}` : ''}
        </p>
      </div>
    </div>
  )
}
