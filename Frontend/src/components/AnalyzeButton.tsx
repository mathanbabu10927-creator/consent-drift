interface AnalyzeButtonProps {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}

export function AnalyzeButton({ disabled = false, onClick, label = 'Analyze APKs' }: AnalyzeButtonProps) {
  return (
    <button className="btn btn-primary large" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
