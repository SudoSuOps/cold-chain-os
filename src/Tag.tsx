export type Kind = 'public' | 'illustrative' | 'founder' | 'planned' | 'hypothesis'
export const KIND_LABEL: Record<Kind, string> = {
  public: 'Documented public evidence',
  illustrative: 'Illustrative',
  founder: 'Founder-reported',
  planned: 'Planned',
  hypothesis: 'Hypothesis',
}
export const Tag = ({ kind }: { kind: Kind }) => <span className={`tag tag--${kind}`}>{KIND_LABEL[kind]}</span>
