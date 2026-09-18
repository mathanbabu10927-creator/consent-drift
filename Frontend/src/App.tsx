import { useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AnalyzeButton } from './components/AnalyzeButton';
import { Footer } from './components/Footer';
import { LoadingIndicator } from './components/LoadingIndicator';
import { Navbar } from './components/Navbar';
import { PermissionTable } from './components/PermissionTable';
import { PrivacyChangeCard } from './components/PrivacyChangeCard';
import { RiskBadge } from './components/RiskBadge';
import { SummaryCard } from './components/SummaryCard';
import { UploadCard } from './components/UploadCard';
import { mockAnalysisData } from './data/mockData';

const initialUploadState = { olderApk: null as File | null, newerApk: null as File | null };

const mockState: typeof mockAnalysisData = {
  old_version: '1.0',
  new_version: '1.1',
  permissions_added: ['android.permission.RECORD_AUDIO'],
  permissions_removed: ['android.permission.READ_CONTACTS'],
  risk_level: 'HIGH',
  permissions: [
    {
      name: 'android.permission.RECORD_AUDIO',
      status: 'Added',
      oldValue: 'Not declared',
      newValue: 'Declared',
      description: 'New microphone capability was added for voice capture during onboarding.'
    },
    {
      name: 'android.permission.CAMERA',
      status: 'Unchanged',
      oldValue: 'Granted',
      newValue: 'Granted',
      description: 'Camera access remains active and unchanged.'
    },
    {
      name: 'android.permission.READ_CONTACTS',
      status: 'Removed',
      oldValue: 'Declared',
      newValue: 'Not declared',
      description: 'Contact access was removed from the newer build.'
    }
  ],
  privacyChanges: [
    {
      title: 'Microphone permission was newly added',
      description: 'The app now requests audio capture during login and onboarding.',
      impact: 'This broadens the user consent surface and should be clearly disclosed.',
      severity: 'High'
    },
    {
      title: 'Contact access was removed',
      description: 'The app no longer reads the contact list from the device.',
      impact: 'This reduces data exposure, but the remaining recording permission still requires review.',
      severity: 'Medium'
    }
  ]
};

function HomePage() {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState(initialUploadState);
  const readyToAnalyze = Boolean(uploads.olderApk && uploads.newerApk);

  const handleAnalyze = () => {
    if (!readyToAnalyze) return;
    navigate('/analyzing');
  };

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

        <div className="cta-row">
          <AnalyzeButton
            disabled={!readyToAnalyze}
            onClick={handleAnalyze}
            label={!readyToAnalyze ? 'Upload both APKs' : 'Analyze APKs'}
          />
        </div>
      </section>
    </main>
  );
}

function AnalyzingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/results', { state: mockState });
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="page-content">
      <LoadingIndicator />
    </main>
  );
}

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const payload = (location.state as typeof mockState | undefined) ?? mockState;
  const analysis = { ...mockAnalysisData, ...payload };

  const summary = useMemo<Array<{ label: string; value: string; tone: 'neutral' | 'warning' | 'danger' }>>(
    () => [
      { label: 'Old Version', value: analysis.old_version, tone: 'neutral' },
      { label: 'New Version', value: analysis.new_version, tone: 'neutral' },
      { label: 'Added', value: String(analysis.permissions_added.length), tone: 'warning' },
      { label: 'Removed', value: String(analysis.permissions_removed.length), tone: 'danger' },
      { label: 'Risk Level', value: analysis.risk_level, tone: analysis.risk_level === 'HIGH' ? 'danger' : 'warning' }
    ],
    [analysis]
  );

  return (
    <main className="page-content dashboard-page">
      <section className="section dashboard-header">
        <div>
          <p className="eyebrow">Risk summary</p>
          <h2>Package comparison dashboard</h2>
        </div>
        <div className="header-actions">
          <RiskBadge level={analysis.risk_level} />
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/changelog', { state: payload })}
          >
            View changelog
          </button>
        </div>
      </section>

      <section className="summary-grid">
        {summary.map((item) => (
          <SummaryCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
        ))}
      </section>

      <section className="details-grid">
        <div className="section">
          <div className="panel-header-row">
            <h3>Permission breakdown</h3>
            <span className="muted-link">View all</span>
          </div>
          <div className="mini-stat-list">
            <div>
              <span>Added</span>
              <strong>{analysis.permissions_added.length}</strong>
            </div>
            <div>
              <span>Removed</span>
              <strong>{analysis.permissions_removed.length}</strong>
            </div>
            <div>
              <span>Unchanged</span>
              <strong>{analysis.permissions.filter((p) => p.status === 'Unchanged').length}</strong>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="panel-header-row">
            <h3>Consent impact</h3>
            <span className="muted-link">Security policy</span>
          </div>
          <ul className="impact-list">
            <li>Background tracking increased</li>
            <li>Microphone access was added</li>
            <li>Contact access was removed</li>
          </ul>
          <button
            className="btn btn-primary new-analysis-btn"
            onClick={() => navigate('/')}
          >
            New Analysis
          </button>
        </div>
      </section>

      <div className="permission-card-group">
        <div className="permission-card">
          <h4>Added permissions</h4>
          <div className="permission-meta">
            <span className="status-pill added">Added</span>
            <strong>android.permission.RECORD_AUDIO</strong>
          </div>
          <p>Used for voice-enabled verification and guided prompts.</p>
        </div>
        <div className="permission-card">
          <h4>Unchanged permissions</h4>
          <div className="permission-meta">
            <span className="status-pill unchanged">Unchanged</span>
            <strong>android.permission.CAMERA</strong>
          </div>
          <p>Still required for document capture and verification.</p>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={() => navigate('/changelog', { state: payload })}
      >
        Review Risk Details
      </button>

      <PermissionTable rows={analysis.permissions} />
    </main>
  );
}

function ChangelogPage() {
  const location = useLocation();
  const payload = (location.state as typeof mockState | undefined) ?? mockState;
  const analysis = { ...mockAnalysisData, ...payload };

  return (
    <main className="page-content dashboard-page">
      <section className="section dashboard-header">
        <div>
          <p className="eyebrow">Privacy changelog</p>
          <h2>Risk details and consent changes</h2>
        </div>
        <div className="header-actions">
          <RiskBadge level={analysis.risk_level} />
        </div>
      </section>

      <section className="section privacy-panel">
        <div className="panel-header-row">
          <h3>Permission delta</h3>
        </div>
        <div className="permission-card-group">
          <div className="permission-card">
            <h4>Added permissions</h4>
            <div className="permission-meta">
              <span className="status-pill added">Added</span>
              <strong>android.permission.RECORD_AUDIO</strong>
            </div>
            <p>Voice capture is now requested during onboarding and verification.</p>
          </div>
          <div className="permission-card">
            <h4>Unchanged permissions</h4>
            <div className="permission-meta">
              <span className="status-pill unchanged">Unchanged</span>
              <strong>android.permission.CAMERA</strong>
            </div>
            <p>Camera permission remains necessary for identity validation and document scanning.</p>
          </div>
        </div>
        <PermissionTable rows={analysis.permissions} />
      </section>

      <section className="section privacy-panel">
        <div className="panel-header-row">
          <h3>Privacy changelog</h3>
        </div>
        <div className="privacy-grid">
          {(analysis.privacyChanges ?? []).map((item) => (
            <PrivacyChangeCard key={item.title} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
