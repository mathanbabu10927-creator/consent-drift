interface PrivacyChangeCardProps {
  title: string;
  description: string;
  impact: string;
}

export function PrivacyChangeCard({ title, description, impact }: PrivacyChangeCardProps) {
  return (
    <article className="privacy-card">
      <div className="privacy-header">
        <h4>{title}</h4>
      </div>
      <p>{description}</p>
      <small>{impact}</small>
    </article>
  );
}
