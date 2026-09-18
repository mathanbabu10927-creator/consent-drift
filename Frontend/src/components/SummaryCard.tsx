interface SummaryCardProps {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'warning' | 'danger';
}

export function SummaryCard({ label, value, tone = 'neutral' }: SummaryCardProps) {
  return (
    <div className={`summary-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
