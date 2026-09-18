const steps = [
  'Extracting manifest information',
  'Comparing permission declarations',
  'Calculating risk and impact',
  'Drafting privacy summary'
];

export function LoadingIndicator() {
  return (
    <div className="loading-panel section">
      <div className="loading-header">
        <div className="spinner" aria-label="Loading" />
        <div>
          <p className="eyebrow">Scanning package changes</p>
          <h2>Analyzing consent drift</h2>
        </div>
      </div>

      <div className="loading-steps">
        {steps.map((step, index) => (
          <div key={step} className="loading-step active">
            <span className="step-index">{index + 1}</span>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
