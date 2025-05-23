export const formatBigNumber = (num: number, hasCurrencySymbol?: boolean) => {
  return (
    new Intl.NumberFormat("de-DE").format(num).toString() +
    (hasCurrencySymbol ? "₫" : "")
  )
}
