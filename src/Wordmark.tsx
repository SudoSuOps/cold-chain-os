/**
 * coldchainOS horizontal signature (brand kit, true vector, outlined type).
 * Below 340px the mark alone is shown. The link carries the accessible name.
 */
export default function Wordmark({ href = '#top' }: { href?: string }) {
  return (
    <a className="wordmark" href={href} aria-label="coldchainOS home">
      <img
        className="wordmark__full"
        src="/brand/logo/coldchainos-horizontal-on-dark.svg"
        alt=""
        width="146"
        height="36"
      />
      <img className="wordmark__mark" src="/brand/logo/coldchainos-mark-on-dark.svg" alt="" width="36" height="36" />
    </a>
  )
}
