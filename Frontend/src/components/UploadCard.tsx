interface UploadCardProps {
  title: string;
  subtitle: string;
  fileName?: string;
  onFileSelect: (file: File | null) => void;
}

export function UploadCard({ title, subtitle, fileName, onFileSelect }: UploadCardProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  return (
    <div className={`upload-card${fileName ? ' upload-card-selected' : ''}`}>
      <div className="upload-header">
        <span className="upload-tag">APK</span>
        <div>
          <span className="upload-title">{title}</span>
          <small className="upload-state">{fileName ? 'Ready for analysis' : 'Awaiting upload'}</small>
        </div>
      </div>

      <label className="dropzone">
        <input type="file" accept=".apk,application/vnd.android.package-archive" onChange={handleChange} />
        <div className="dropzone-inner">
          <div className="drop-icon">⇪</div>
          <div>
            <strong>{fileName ? fileName : 'Drag & drop file here'}</strong>
            <small>{fileName ? 'Click to replace this package' : subtitle}</small>
          </div>
        </div>
      </label>
    </div>
  );
}
