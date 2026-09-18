import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AnalyzeButton } from './components/AnalyzeButton';
import { Footer } from './components/Footer';
import { LoadingIndicator } from './components/LoadingIndicator';
import { Navbar } from './components/Navbar';
import { PermissionTable } from './components/PermissionTable';
import { PrivacyChangeCard } from './components/PrivacyChangeCard';
import { RiskBadge } from './components/RiskBadge';
import { SummaryCard } from './components/SummaryCard';
import { UploadCard } from './components/UploadCard';
import type { AnalysisResponse, AnalysisResult } from './types';

const API_URL = 'http://127.0.0.1:8000/analyze';
const initialUploadState = { olderApk: null as File | null, newerApk: null as File | null };

async function analyzeApk(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_URL, { method: 'POST', body: formData });
  const payload = (await response.json().catch(() => null)) as { detail?: string } | AnalysisResponse | null;

  if (!response.ok) {
    const detail = payload && 'detail' in payload ? payload.detail : undefined;
    throw new Error(detail ?? `Analysis failed with HTTP ${response.status}.`);
  }

  return payload as AnalysisResponse;
}

interface HomePageProps {
  loading: boolean;
  error: string | null;
  onAnalyze: (uploads: typeof initialUploadState) => void;
}

function HomePage({ loading, error, onAnalyze }: HomePageProps) {
  const [uploads, setUploads] = useState(initialUploadState);
  const readyToAnalyze = Boolean(uploads.olderApk && uploads.newerApk);

  return (
    <main className="page-content home-page">
      <section className="hero-panel section">
        <div className="hero-copy">
          <p className="eyebrow">Privacy compliance intelligence</p>
          <h1>Detect consent drift between Android builds.</h1>
          <p className="lead">
            Compare permissions and app behavior across versions to identify risky privacy changes before release.
          </p>
        </div>

        <div className="upload-grid">
          <UploadCard
            title="Older APK"
            subtitle="Upload the base package for comparison"
            fileName={uploads.olderApk?.name}
            onFileSelect={(file) => setUploads((prev) => ({ ...prev, olderApk: file }))}
          />
          <UploadCard
            title="Newer APK"
            subtitle="Upload the updated release candidate"
            fileName={uploads.newerApk?.name}
            onFileSelect={(file) => setUploads((prev) => ({ ...prev, newerApk: file }))}
          />
        </div>

        {error && <p className="api-error" role="alert">{error}</p>}
        <div className="cta-row">
          <AnalyzeButton
            disabled={!readyToAnalyze || loading}
            onClick={() => onAnalyze(uploads)}
            label={loading ? 'Analyzing APKs...' : !readyToAnalyze ? 'Upload both APKs' : 'Analyze APKs'}
          />
        </div>
      </section>
    </main>
  );
}

function ResultsPage({ results }: { results: AnalysisResult[] }) {
  const navigate = useNavigate();
  const totalSensitive = results.reduce((sum, result) => sum + result.data.analysis.sensitive_permission_count, 0);
  const totalPermissions = results.reduce((sum, result) => sum + result.data.analysis.total_permissions, 0);
  const summary = useMemo(
    () => [
      { label: 'APK Reports', value: String(results.length), tone: 'neutral' as const },
      { label: 'Total Permissions', value: String(totalPermissions), tone: 'neutral' as const },
      { label: 'Sensitive Findings', value: String(totalSensitive), tone: totalSensitive ? 'danger' as const : 'warning' as const }
    ],
    [results, totalPermissions, totalSensitive]
  );

  return (
    <main className="page-content dashboard-page">
      <section className="section dashboard-header">
        <div>
          <p className="eyebrow">Live API response</p>
          <h2>Package analysis dashboard</h2>
        </div>
        <div className="header-actions">
          <RiskBadge level={totalSensitive ? 'HIGH' : 'LOW'} />
          <button className="btn btn-secondary" onClick={() => navigate('/changelog')}>View changelog</button>
        </div>
      </section>

      <section className="summary-grid">
        {summary.map((item) => <SummaryCard key={item.label} label={item.label} value={item.value} tone={item.tone} />)}
      </section>

      {results.map((result) => (
        <section className="section privacy-panel" key={result.fileName}>
          <div className="panel-header-row">
            <div>
              <h3>{result.label}: {result.fileName}</h3>
              <p className="muted-link">{result.data.apk_info.package_name || 'Package name unavailable'}</p>
            </div>
          </div>
          <div className="mini-stat-list">
            <div><span>App</span><strong>{result.data.apk_info.app_name || 'Unknown'}</strong></div>
            <div><span>Version</span><strong>{result.data.apk_info.version_name || 'Unknown'}</strong></div>
            <div><span>Sensitive</span><strong>{result.data.analysis.sensitive_permission_count}</strong></div>
          </div>
          <PermissionTable permissions={result.data.permissions.all} />
        </section>
      ))}
    </main>
  );
}

function ChangelogPage({ results }: { results: AnalysisResult[] }) {
  return (
    <main className="page-content dashboard-page">
      <section className="section dashboard-header">
        <div><p className="eyebrow">Live API response</p><h2>Permission and privacy details</h2></div>
      </section>
      <section className="section privacy-panel">
        <div className="privacy-grid">
          {results.map((result) => (
            <PrivacyChangeCard
              key={result.fileName}
              title={`${result.label} sensitive permissions`}
              description={`${result.data.permissions.sensitive.length} sensitive permission(s) were detected.`}
              impact={result.data.permissions.sensitive.join(', ') || 'No sensitive permissions detected.'}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  const navigate = useNavigate();
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (uploads: typeof initialUploadState) => {
    if (!uploads.olderApk || !uploads.newerApk) return;
    setError(null);
    setLoading(true);

    try {
      const analyzed = await Promise.all([
        analyzeApk(uploads.olderApk),
        analyzeApk(uploads.newerApk)
      ]);
      setResults([
        { label: 'Older APK', fileName: uploads.olderApk.name, data: analyzed[0] },
        { label: 'Newer APK', fileName: uploads.newerApk.name, data: analyzed[1] }
      ]);
      navigate('/results');
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'The APK analysis request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage loading={loading} error={error} onAnalyze={handleAnalyze} />} />
        <Route path="/results" element={results.length ? <ResultsPage results={results} /> : <Navigate to="/" replace />} />
        <Route path="/changelog" element={results.length ? <ChangelogPage results={results} /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {loading && <LoadingIndicator />}
    </div>
  );
}

export default App;
