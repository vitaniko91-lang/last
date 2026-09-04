const RUB = new Intl.NumberFormat('ru-RU', { useGrouping: true })

/** «1 490 ₽». Разделитель и отбивка неразрывные — цена не должна рваться переносом. */
export function formatRub(value: number): string {
  return `${RUB.format(value)} ₽`
}
