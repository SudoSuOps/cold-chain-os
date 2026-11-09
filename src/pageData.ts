/** Build-time data embedded in the page (<script type="application/json" id="page-data">), so large content stays out of the JS bundle. */
export function readPageData<T>(): T | undefined {
  if (typeof document === 'undefined') return undefined
  const el = document.getElementById('page-data')
  if (!el?.textContent) return undefined
  try { return JSON.parse(el.textContent) as T } catch { return undefined }
}
