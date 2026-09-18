import type { PrivacyChange } from '../data/mockData';

interface PrivacyChangeCardProps {
  item: PrivacyChange;
}

export function PrivacyChangeCard({ item }: PrivacyChangeCardProps) {
  return (
    <article className="privacy-card">
      <div className="privacy-header">
        <h4>{item.title}</h4>
        <span className={`severity severity-${item.severity.toLowerCase()}`}>{item.severity}</span>
      </div>
      <p>{item.description}</p>
      <small>{item.impact}</small>
    </article>
  );
}
