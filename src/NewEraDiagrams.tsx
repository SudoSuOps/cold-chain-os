export function EcosystemDiagram() {
  const layers = [
    ['Intelligence', 'Extraction · retrieval · review'],
    ['Evidence', 'Records · bills · inventories · logs'],
    ['Coordination', 'WMS · WES · TMS · vendors'],
    ['Automation', 'AS/RS · conveyors · robots'],
    ['Physical', 'Product · refrigeration · docks · power'],
  ]
  return (
    <svg className="diagram" viewBox="0 0 520 470" role="img" aria-labelledby="eco-t eco-d">
      <title id="eco-t">The connected cold chain in five layers</title>
      <desc id="eco-d">
        Five stacked layers: Intelligence, Evidence, Coordination, Automation and Physical. A solid bracket on the left marks
        equipment-control authority, which sits with operational technology controllers and authorized operators across the
        Automation and Physical layers. A dashed upward arrow on the right shows information flowing from the physical
        layers up to Evidence and Intelligence. There is no control path from Intelligence down to the equipment.
      </desc>
      <text x="260" y="22" className="dg-label dg-label--bad" textAnchor="middle">No control path down from Intelligence</text>
      {layers.map(([name, sub], i) => (
        <g key={name} transform={`translate(90 ${40 + i * 78})`}>
          <rect width="320" height="64" rx="6" className="dg-box" />
          <text x="16" y="27" className="dg-title">{name}</text>
          <text x="16" y="49" className="dg-sub">{sub}</text>
        </g>
      ))}
      {/* control authority bracket: Automation + Physical */}
      <path d="M80 274 H66 V418 H80" className="dg-solid" fill="none" />
      <text x="40" y="346" className="dg-label" textAnchor="middle" transform="rotate(-90 40 346)">Control authority</text>
      <text x="22" y="346" className="dg-label dg-label--dim" textAnchor="middle" transform="rotate(-90 22 346)">OT controllers + operators</text>
      {/* information flow */}
      <path d="M452 420 V60" className="dg-dash" fill="none" />
      <path d="M452 54 l-7 12 M452 54 l7 12" className="dg-arrow" />
      <text x="482" y="240" className="dg-label" textAnchor="middle" transform="rotate(90 482 240)">Information flow (read-only)</text>
    </svg>
  )
}

export function EdgeDiagram() {
  return (
    <svg className="diagram" viewBox="0 0 520 700" role="img" aria-labelledby="edge-t edge-d">
      <title id="edge-t">Edge appliance trust boundaries (design goal)</title>
      <desc id="edge-d">
        A design goal, not an implemented system. Three stacked zones. At the top, operational technology with refrigeration
        controllers, PLCs, robots and safety systems. In the middle, an owner-controlled zone holding the appliance. At the
        bottom, external services. Data moves from the operational technology zone down to the owner-controlled zone only
        through a read-only export. There is no control path from the appliance up to operational technology. Connections
        to external services are off by default and need explicit approval.
      </desc>
      {/* OT zone */}
      <rect x="20" y="16" width="480" height="140" rx="10" className="dg-zone dg-zone--ot" />
      <text x="40" y="44" className="dg-zonelabel">Operational technology (OT)</text>
      <text x="40" y="78" className="dg-sub dg-sub--lg">Refrigeration controllers</text>
      <text x="40" y="104" className="dg-sub dg-sub--lg">PLCs · robots · safety systems</text>
      <text x="40" y="136" className="dg-sub">Outside the appliance’s authority</text>

      {/* read-only export (OT -> owner) */}
      <path d="M150 156 V212" className="dg-solid" fill="none" />
      <path d="M150 214 l-7 -12 M150 214 l7 -12" className="dg-arrow" />
      <text x="166" y="190" className="dg-label">read-only export</text>

      {/* no control path (owner -> OT) */}
      <path d="M370 212 V158" className="dg-bad" fill="none" strokeDasharray="4 5" />
      <path d="M358 178 l24 -14 M358 164 l24 14" className="dg-bad" />
      <text x="386" y="190" className="dg-label dg-label--bad">no control path</text>

      {/* owner zone */}
      <rect x="20" y="214" width="480" height="318" rx="10" className="dg-zone dg-zone--own" />
      <text x="40" y="242" className="dg-zonelabel">Owner-controlled zone · managed IT</text>
      {['Authorized documents', 'Local models', 'Deterministic calculations', 'Source retrieval', 'Evidence-linked brief (human review)'].map((t, i) => (
        <g key={t} transform={`translate(40 ${258 + i * 53})`}>
          <rect width="440" height="42" rx="5" className="dg-box" />
          <text x="16" y="26" className="dg-sub dg-sub--lg">{t}</text>
        </g>
      ))}

      {/* gated (owner -> external) */}
      <path d="M260 532 V590" className="dg-dash" fill="none" />
      <path d="M260 592 l-7 -12 M260 592 l7 -12" className="dg-arrow" />
      <text x="276" y="566" className="dg-label">gated · explicit approval</text>

      {/* external zone */}
      <rect x="20" y="592" width="480" height="96" rx="10" className="dg-zone dg-zone--ext" />
      <text x="40" y="620" className="dg-zonelabel">External services · off by default</text>
      <text x="40" y="650" className="dg-sub dg-sub--lg">Cloud models · vendors · remote support</text>
      <text x="40" y="674" className="dg-sub">Updates and telemetry reviewed</text>
    </svg>
  )
}
