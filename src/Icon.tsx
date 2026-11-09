// Generated from the coldchainOS brand kit (07-icons-favicons/icons). Decorative: hidden from assistive tech.
export const ICONS = {
  'cold-storage-facility': "<path d=\"M3 20V9.5L12 5l9 4.5V20\"/><path d=\"M3 20h18\"/><path d=\"M6.5 20v-5h4v5\"/><path d=\"M13.5 20v-5h4v5\"/><path d=\"M9 10.5h6\"/>",
  'community': "<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3.5 20v-1a5.5 5.5 0 0 1 11 0v1\"/><path d=\"M16 5.5a3 3 0 0 1 0 5.2\"/><path d=\"M17.5 14.2a5.5 5.5 0 0 1 3 4.8v1\"/>",
  'dataset': "<ellipse cx=\"12\" cy=\"5.5\" rx=\"7\" ry=\"2.5\"/><path d=\"M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13\"/><path d=\"M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5\"/>",
  'energy': "<path d=\"M13 3L5.5 13.5H12L11 21l7.5-10.5H12z\"/>",
  'evidence': "<path d=\"M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z\"/><path d=\"M14 3v5h5\"/><path d=\"M8.5 13.5l2.2 2.2 4.3-4.4\"/>",
  'local-compute': "<rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"1.5\"/><rect x=\"9.5\" y=\"9.5\" width=\"5\" height=\"5\" rx=\".5\"/><path d=\"M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3\"/>",
  'refrigeration': "<path d=\"M10 14.8V5a2 2 0 0 1 4 0v9.8a4 4 0 1 1-4 0z\"/><path d=\"M12 9v7.5\"/><path d=\"M17.5 5.5h2.5M17.5 9h2.5\"/>",
  'underwriting': "<rect x=\"5\" y=\"3\" width=\"14\" height=\"18\" rx=\"2\"/><path d=\"M8.5 7h7\"/><path d=\"M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M8.5 18h.01M12 18h.01\"/><path d=\"M15.5 15v3\"/>",
} as const
export type IconName = keyof typeof ICONS

export default function Icon({ name }: { name: IconName }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  )
}
