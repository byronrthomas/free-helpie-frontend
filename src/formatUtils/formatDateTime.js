export function formatDateTime (date) {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}
