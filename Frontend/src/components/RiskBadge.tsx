type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

interface RiskBadgeProps {
  level: RiskLevel;
}

export function RiskBadge({ level }: RiskBadgeProps) {
  const className = `risk-badge risk-${level.toLowerCase()}`;
  return <span className={className}>{level}</span>;
}
