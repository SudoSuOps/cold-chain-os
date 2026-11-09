/** Typographic placeholder wordmark. Replace the contents with the supplied brand asset later. */
export default function Wordmark({ href = '#top' }: { href?: string }) {
  return (
    <a className="wordmark" href={href} aria-label="coldchainOS home">
      <span className="wordmark__cold">coldchain</span>
      <span className="wordmark__os">OS</span>
    </a>
  )
}
