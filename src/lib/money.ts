const UAH = new Intl.NumberFormat('ru-RU', { useGrouping: true })

/** «1 490 ₴». Разделитель и отбивка неразрывные — цена не должна рваться переносом. */
export function formatUah(value: number): string {
  return `${UAH.format(value)} ₴`
}
