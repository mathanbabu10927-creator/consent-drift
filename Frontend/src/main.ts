import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="page-shell">
    <header class="topbar">
      <div class="brand-wrap">
        <div class="brand-mark">V</div>
        <span>Vinhack</span>
      </div>

      <nav class="main-nav" aria-label="Main navigation">
        <a href="#features">Features</a>
        <a href="#solutions">Solutions</a>
        <a href="#reviews">Reviews</a>
        <a href="#pricing">Pricing</a>
      </nav>

      <div class="nav-actions">
        <button class="btn btn-ghost">Log in</button>
        <button class="btn btn-primary">Get started</button>
      </div>
    </header>

    <main>
      <section class="hero section">
        <div class="hero-copy">
          <div class="eyebrow">Built for growth teams</div>
          <h1>Turn ideas into product momentum.</h1>
          <p>
            Design, ship, and optimize digital experiences with one connected workspace built for fast-moving teams.
          </p>

          <div class="hero-actions">
            <button class="btn btn-primary large">Start free</button>
            <button class="btn btn-secondary large">Book demo</button>
          </div>

          <div class="social-proof">
            <div>
              <strong>12k+</strong>
              <span>active teams</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>average rating</span>
            </div>
            <div>
              <strong>2.4x</strong>
              <span>faster launches</span>
            </div>
          </div>
        </div>

        <div class="hero-visual" aria-label="Dashboard preview">
          <div class="panel panel-main">
            <div class="panel-header">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </div>

            <div class="metric-grid">
              <div class="metric-card metric-card-accent">
                <span class="metric-label">Revenue</span>
                <strong>$84.2K</strong>
                <small>+18.4% this month</small>
              </div>
              <div class="metric-card">
                <span class="metric-label">Conversion</span>
                <strong>7.8%</strong>
                <small>+1.2pt uplift</small>
              </div>
            </div>

            <div class="chart-bars" aria-hidden="true">
              <span style="height: 28%"></span>
              <span style="height: 38%"></span>
              <span style="height: 48%"></span>
              <span style="height: 58%"></span>
              <span style="height: 72%"></span>
              <span style="height: 68%"></span>
              <span style="height: 92%"></span>
              <span style="height: 88%"></span>
            </div>
          </div>

          <div class="floating-card floating-card-top">
            <span class="mini-label">Campaign health</span>
            <strong>92%</strong>
            <small>On track</small>
          </div>

          <div class="floating-card floating-card-bottom">
            <div class="avatar-stack" aria-hidden="true">
              <span>A</span>
              <span>M</span>
              <span>J</span>
            </div>
            <div>
              <strong>14 tasks</strong>
              <small>ready to ship</small>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="section feature-section">
        <div class="section-heading">
          <span class="eyebrow">Why teams choose Vinhack</span>
          <h2>Everything your product team needs.</h2>
        </div>

        <div class="feature-grid">
          <article class="feature-card">
            <div class="icon-wrap purple">✦</div>
            <h3>Live collaboration</h3>
            <p>Bring design, product, and engineering into one seamless review loop.</p>
          </article>
          <article class="feature-card">
            <div class="icon-wrap blue">◎</div>
            <h3>Smart automation</h3>
            <p>Trigger updates, reviews, and approvals with workflows that actually scale.</p>
          </article>
          <article class="feature-card">
            <div class="icon-wrap green">↗</div>
            <h3>Insightful analytics</h3>
            <p>Track momentum, conversions, and quality signals from one real-time dashboard.</p>
          </article>
        </div>
      </section>

      <section id="solutions" class="section showcase">
        <div class="showcase-copy">
          <span class="eyebrow">Built to move faster</span>
          <h2>From ideation to launch without the bottlenecks.</h2>
          <ul class="check-list">
            <li>Centralized briefs, design files, and release notes</li>
            <li>Approval flows that keep stakeholders aligned</li>
            <li>Real-time reporting with clear ownership</li>
          </ul>
        </div>

        <div class="showcase-panel">
          <div class="mini-row">
            <span class="status-pill success">Healthy</span>
            <span class="status-pill neutral">Sprint 14</span>
          </div>

          <div class="task-list">
            <div class="task-item">
              <span class="task-dot blue"></span>
              <div>
                <strong>Homepage refresh</strong>
                <small>Design QA in progress</small>
              </div>
              <span class="task-badge">8/10</span>
            </div>
            <div class="task-item">
              <span class="task-dot purple"></span>
              <div>
                <strong>Onboarding flow</strong>
                <small>Ready for review</small>
              </div>
              <span class="task-badge">3/5</span>
            </div>
            <div class="task-item">
              <span class="task-dot green"></span>
              <div>
                <strong>Lifecycle messaging</strong>
                <small>Approved by team</small>
              </div>
              <span class="task-badge">Done</span>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" class="section testimonial-section">
        <div class="section-heading">
          <span class="eyebrow">Customer stories</span>
          <h2>Teams ship with more confidence.</h2>
        </div>

        <div class="testimonial-grid">
          <blockquote class="testimonial-card">
            “We cut review time in half and shipped new features with more clarity across the entire team.”
            <footer>
              <strong>Sarah Lin</strong>
              <span>VP Product, Northstar</span>
            </footer>
          </blockquote>
          <blockquote class="testimonial-card">
            “The workflow is fast, clean, and structured. It feels like our product team finally has a system that keeps up.”
            <footer>
              <strong>Daniel Ruiz</strong>
              <span>Head of Growth, Cinder</span>
            </footer>
          </blockquote>
        </div>
      </section>

      <section id="pricing" class="section pricing-section">
        <div class="section-heading center">
          <span class="eyebrow">Simple pricing</span>
          <h2>Choose the plan that fits your momentum.</h2>
        </div>

        <div class="pricing-grid">
          <div class="price-card">
            <span class="tier">Starter</span>
            <h3>$29<span>/month</span></h3>
            <ul>
              <li>Unlimited projects</li>
              <li>Team comments</li>
              <li>Basic analytics</li>
            </ul>
            <button class="btn btn-secondary">Try starter</button>
          </div>

          <div class="price-card featured">
            <span class="tier">Growth</span>
            <h3>$79<span>/month</span></h3>
            <ul>
              <li>Advanced automations</li>
              <li>Custom workflows</li>
              <li>Priority support</li>
            </ul>
            <button class="btn btn-primary">Get growth</button>
          </div>

          <div class="price-card">
            <span class="tier">Scale</span>
            <h3>$149<span>/month</span></h3>
            <ul>
              <li>Multi-team governance</li>
              <li>AI-powered insights</li>
              <li>Dedicated success manager</li>
            </ul>
            <button class="btn btn-secondary">Talk to sales</button>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="brand-wrap">
        <div class="brand-mark">V</div>
        <span>Vinhack</span>
      </div>
      <p>© 2026 Vinhack. Built for better product execution.</p>
    </footer>
  </div>
`
