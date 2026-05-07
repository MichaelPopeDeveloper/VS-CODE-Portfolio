/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// =============================================================
// DATA
// =============================================================
const PROJECTS = [
  {
    id: 'kt-nlp',
    title: 'Legal NLP Agent',
    org: 'Kilpatrick Townsend',
    year: '2024 — now',
    desc: 'ChatGPT-style legal research agent. Multi-LLM router across GPT-4, Gemini 2.5, Claude Sonnet 4 + a custom model trained on Harvard/Cornell scraped corpus.',
    stack: ['C# / .NET', 'Semantic Kernel', 'React', 'Azure Blob', 'Go scraper'],
    stat: { label: 'query time', from: '15h', to: '20m' },
    href: 'project-case-study.html'
  },
  {
    id: 'everi-kiosk',
    title: 'Casino Kiosk Migration',
    org: 'Everi Holdings',
    year: '2022 — 2024',
    desc: 'Migrated hundreds of Flash apps to a single Angular/Electron shell powering player rewards, ATM, and pinpad flows for 1M+ daily player interactions.',
    stack: ['Angular', 'Electron', 'C# / .NET', 'SQL Server', 'MongoDB'],
    stat: { label: 'dev time cut', from: '—', to: '40%' }
  },
  {
    id: 'yum-serverless',
    title: 'Yum! Tracks v2',
    org: 'Yum! Brands',
    year: '2022',
    desc: 'Serverless backend for 7,000+ KFC/Taco Bell locations — timeclock, food waste, payments. Migration from monolith to AWS Lambda + EventBridge.',
    stack: ['Node', 'TypeScript', 'AWS Lambda', 'EventBridge', 'PostgreSQL'],
    stat: { label: 'annual savings', from: '—', to: '$500K' }
  },
  {
    id: 'wbd-privacy',
    title: 'CCPA Privacy ETL',
    org: 'Warner Bros. Discovery',
    year: '2021',
    desc: 'Automated CA data-privacy compliance for 14-day employee data requests across 10K+ legal firms, agencies, actors. Killed a hiring plan, not the deadline.',
    stack: ['Hapi', 'Python', 'MongoDB', 'AWS', 'React + Redux'],
    stat: { label: 'payroll saved', from: '—', to: '$10M' }
  },
  {
    id: 'hulu-cms',
    title: 'Hulu+ CMS Migration',
    org: 'Hulu / Disney+',
    year: '2021',
    desc: 'Ported 1,000+ components from Apostrophe.js to Cannonball (Disney+ internal CMS). Refactored GraphQL resolvers serving 50M+ subscribers.',
    stack: ['TypeScript', 'React', 'GraphQL', 'Node', 'MongoDB'],
    stat: { label: 'subscribers', from: '—', to: '50M+' }
  },
  {
    id: 'tandigm',
    title: 'Healthcare Incentives Engine',
    org: 'Tandigm Health',
    year: '2019 — 2021',
    desc: 'HIPAA-compliant incentives engine for value-based care. Cohort-aware financial calculations across 2M patients, scheduled at 1M+ data points/day.',
    stack: ['Node', 'TypeScript', 'Azure Logic Apps', 'Snowflake', 'D3'],
    stat: { label: 'patients/yr', from: '—', to: '2M+' }
  }
];

const EXPERIENCE = [
  ['2024 — now', 'Kilpatrick Townsend', 'Senior AI Engineer / Data Engineer', 'C#/.NET · Semantic Kernel · React'],
  ['2022 — 2024', 'Everi Holdings', 'Tech Lead / Principal Engineer', 'Angular · Electron · C# · Go'],
  ['2022', 'Yum! Brands', 'Sr Serverless Backend Engineer', 'Node · TS · AWS Lambda'],
  ['2021 — 2022', 'Republic Services', 'Sr Full-Stack Serverless', 'Node · Angular · AWS AppSync'],
  ['2021', 'Warner Bros. Discovery', 'Sr Full-Stack Engineer', 'React · Hapi · Python'],
  ['2021', 'Hulu / Disney+', 'Sr Full-Stack Engineer', 'TS · React · GraphQL'],
  ['2019 — 2021', 'Tandigm Health', 'Fractional CTO / Sr Architect', 'Node · Azure · Snowflake'],
  ['2017 — 2019', 'LPi', 'Sr Tech Lead / DevOps', 'TS · React · AWS'],
  ['2015 — 2017', 'Vapetasia', 'Full-Stack Engineer', 'Node · Angular · MongoDB'],
  ['2013 — 2015', '3-D EDC / Primary Group', 'Full-Stack / DevOps', 'Node · React · PHP · AWS']
];

const WRITING = [
  {
    date: '2026-04',
    title: 'Routing across four LLMs without losing your mind',
    tag: 'agents',
    read: '12 min',
    excerpt: 'GPT-4, Claude Sonnet, Gemini, and a custom Llama fine-tune walk into a router. Here is how we picked the cheapest correct answer per query.',
    pinned: true
  },
  {
    date: '2026-02',
    title: 'Why I stopped writing my own scrapers (and started again)',
    tag: 'go',
    read: '8 min',
    excerpt: 'Three years of BrightData, Apify, and ScrapingBee — and why a 200-line Go binary still beats them for legal documents.',
  },
  {
    date: '2025-11',
    title: '15 hours → 20 minutes: a SQL index story',
    tag: 'sql',
    read: '6 min',
    excerpt: 'A partial-text-match search that took 15 hours got cut to 20 minutes with three indexes and one filtered view. The boring SQL that paid for itself.',
    pinned: true,
    href: 'blog-post.html'
  },
  {
    date: '2025-08',
    title: 'Semantic Kernel for skeptical .NET developers',
    tag: 'ai',
    read: '14 min',
    excerpt: 'A LangChain user\u2019s honest guide to Microsoft\u2019s SK. What it nails, what it fumbles, and the patterns that actually shipped to production.',
  },
  {
    date: '2025-05',
    title: 'A field guide to migrating off Flash in 2024',
    tag: 'legacy',
    read: '11 min',
    excerpt: 'Hundreds of Flash apps, one Angular shell, zero downtime. The diff between a migration that works and one that quietly bleeds for two years.',
  },
  {
    date: '2025-02',
    title: 'Splitting a $10M bug across credit and gift cards',
    tag: 'debug',
    read: '5 min',
    excerpt: 'A one-line filter inside a Lambda silently miscalculated split payments for months. The story of finding it, and the type interface that prevents the next one.',
  },
  {
    date: '2024-11',
    title: 'Fractional CTO: shipping advice without shipping code',
    tag: 'leadership',
    read: '9 min',
    excerpt: 'Four years of fractional engagements. When to push back, when to write the PR yourself, and the deck I show every founder in week one.',
  },
  {
    date: '2024-09',
    title: 'HIPAA on a serverless budget',
    tag: 'health',
    read: '10 min',
    excerpt: 'Azure Logic Apps, Snowflake, and a healthcare incentives engine for 2M patients — without a hospital-sized infra bill.',
  },
  {
    date: '2024-06',
    title: 'tmux, ghostty, and the case for owning your shell',
    tag: 'tools',
    read: '7 min',
    excerpt: 'My dotfiles tour. Why I left iTerm2 for Ghostty, why my tmux config fits on a postcard, and the keybinds that earn their rent.',
  }
];

const COMMANDS = [
  { cmd: ':about',       go: 'about',      desc: 'open about.md' },
  { cmd: ':projects',    go: 'projects',   desc: 'open projects/' },
  { cmd: ':experience',  go: 'experience', desc: 'open experience.log' },
  { cmd: ':writing',     go: 'writing',    desc: 'open writing/' },
  { cmd: ':contact',     go: 'contact',    desc: 'open contact.json' },
  { cmd: ':resume',      go: 'resume',     desc: 'open resume.pdf' },
  { cmd: ':theme tokyo', action: 'theme:tokyo',   desc: 'switch theme → tokyo night' },
  { cmd: ':theme gruvbox', action: 'theme:gruvbox', desc: 'switch theme → gruvbox' },
  { cmd: ':theme dracula', action: 'theme:dracula', desc: 'switch theme → dracula' },
  { cmd: ':theme ghostty', action: 'theme:ghostty', desc: 'switch theme → ghostty' },
  { cmd: ':split',       action: 'split',  desc: 'open vertical split (now.md)' },
  { cmd: ':only',        action: 'only',   desc: 'close other splits' },
  { cmd: ':crt',         action: 'crt',    desc: 'toggle CRT scanlines' },
  { cmd: ':help',        go: 'about',      desc: 'show keyboard shortcuts' },
  { cmd: ':q',           action: 'quit',   desc: '(this is a website, you can\u2019t leave)' }
];

const FILES = [
  { id: 'about',      label: 'about.md',        ico: '', dir: '~' },
  { id: 'projects',   label: 'projects/',       ico: '', dir: '~', isDir: true },
  { id: 'experience', label: 'experience.log',  ico: '', dir: '~' },
  { id: 'writing',    label: 'writing/',        ico: '', dir: '~', isDir: true },
  { id: 'contact',    label: 'contact.json',    ico: '', dir: '~' },
  { id: 'resume',     label: 'resume.pdf',      ico: '', dir: '~' }
];

// =============================================================
// VIEWS
// =============================================================
function AboutView() {
  return (
    <section className="hero">
      <div className="sub">opening ~/about.md</div>
      <div className="hero-row">
        <div>
          <div className="display">
            Senior AI<br/>
            Engineer <span className="amp">&amp;</span><br/>
            Fractional <em>CTO.</em><span className="cursor"></span>
          </div>
          <div className="lede" style={{ marginTop: 24 }}>
            Hi, I'm <b style={{ color: 'var(--accent)' }}>Michael Pope</b>. A decade-plus shipping production
            systems for OpenAI, Hulu+/Disney+, Warner Bros. Discovery, Yum!, and a stack
            of healthcare and law firms. I write agents, refactor legacy monoliths into
            sane serverless architectures, and lead teams through migrations everyone
            else thinks are too hard.
          </div>
          <div className="lede" style={{ marginTop: 14 }}>
            Based in <span style={{ color: 'var(--accent-3)' }}>Las Vegas</span>. Currently building
            agentic AI tooling for 650+ attorneys at Kilpatrick Townsend.
          </div>
          <div className="tags">
            <span className="t hi">TypeScript</span>
            <span className="t hi">Node.js</span>
            <span className="t hi">React</span>
            <span className="t hi">Angular</span>
            <span className="t">C# / .NET</span>
            <span className="t">Rust</span>
            <span className="t">Go</span>
            <span className="t">Python</span>
            <span className="t">SQL</span>
            <span className="t">LangChain</span>
            <span className="t">Semantic Kernel</span>
            <span className="t">AWS</span>
            <span className="t">Azure</span>
            <span className="t">PostgreSQL</span>
            <span className="t">MongoDB</span>
          </div>
          <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="mailto:Michaelpopedeveloper@gmail.com?subject=Project%20inquiry"
               style={{
                 display: 'inline-flex', alignItems: 'center', gap: 10,
                 padding: '12px 20px',
                 background: 'var(--accent)', color: 'var(--bg)',
                 fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 600,
                 textDecoration: 'none', letterSpacing: '0.5px',
                 border: '1px solid var(--accent)',
                 boxShadow: '0 0 0 0 var(--accent)',
                 transition: 'transform .15s, box-shadow .15s'
               }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 24px -8px var(--accent)'; }}
               onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
              <span>$</span> contact me
              <span style={{ opacity: .7 }}>↵</span>
            </a>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('mp:nav', { detail: 'contact' }))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 20px', background: 'transparent',
                color: 'var(--fg-dim)', fontFamily: 'var(--mono)', fontSize: 12,
                border: '1px solid var(--line-strong)', cursor: 'pointer',
                letterSpacing: '0.5px'
              }}>
              <span style={{ color: 'var(--accent-warn)' }}>:</span>contact
            </button>
            <a href="https://www.linkedin.com/in/michael-p-320063104/" target="_blank" rel="noreferrer"
               style={{
                 display: 'inline-flex', alignItems: 'center', gap: 10,
                 padding: '12px 20px', background: 'transparent',
                 color: 'var(--fg-dim)', fontFamily: 'var(--mono)', fontSize: 12,
                 textDecoration: 'none',
                 border: '1px solid var(--line-strong)',
                 letterSpacing: '0.5px'
               }}>
              <span style={{ color: 'var(--accent-2)' }}>in</span> linkedin
            </a>
          </div>
          <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)' }}>
            <span style={{ color: 'var(--accent-3)' }}>●</span> available for fractional CTO &amp; AI/agent engagements
          </div>
        </div>
        <div>
          <pre className="ascii">{`         *      .        ·         *      .

  ██╗      █████╗ ███████╗    ██╗   ██╗███████╗ ██████╗  █████╗ ███████╗
  ██║     ██╔══██╗██╔════╝    ██║   ██║██╔════╝██╔════╝ ██╔══██╗██╔════╝
  ██║     ███████║███████╗    ██║   ██║█████╗  ██║  ███╗███████║███████╗
  ██║     ██╔══██║╚════██║    ╚██╗ ██╔╝██╔══╝  ██║   ██║██╔══██║╚════██║
  ███████╗██║  ██║███████║     ╚████╔╝ ███████╗╚██████╔╝██║  ██║███████║
  ╚══════╝╚═╝  ╚═╝╚══════╝      ╚═══╝  ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝

       .   ·    .       ·     *      ·    .       *    ·`}</pre>
          <div style={{ marginTop: 18, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', textAlign: 'right', maxWidth: 320, marginLeft: 'auto', lineHeight: 1.7 }}>
            <div><span style={{ color: 'var(--accent-warn)' }}>$</span> uptime</div>
            <div style={{ color: 'var(--fg-dim)' }}> 13y, 2m, shipped</div>
            <div><span style={{ color: 'var(--accent-warn)' }}>$</span> whoami</div>
            <div style={{ color: 'var(--fg-dim)' }}> michael@vegas</div>
            <div><span style={{ color: 'var(--accent-warn)' }}>$</span> currently</div>
            <div style={{ color: 'var(--accent-3)' }}> $ tail -f kilpatrick.log</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsView() {
  return (
    <section>
      <h2><span className="h2-mark">{'//'}</span>selected work</h2>
      <div className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 14 }}>
        Things I <em>actually</em> shipped.
      </div>
      <div className="lede" style={{ marginBottom: 28, maxWidth: '60ch' }}>
        A subset. Six picks across AI, fintech, streaming, and healthcare —
        the ones with the strongest before/after numbers.
      </div>
      <div className="projects">
        {PROJECTS.map((p, i) => {
          const Tag = p.href ? 'a' : 'article';
          const props = p.href
            ? { href: p.href, className: 'card linked', style: { textDecoration: 'none', color: 'inherit', display: 'block' } }
            : { className: 'card', style: { cursor: 'default' } };
          return (
            <Tag key={p.id} {...props}>
              <div className="idx" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{String(i+1).padStart(2,'0')} / {String(PROJECTS.length).padStart(2,'0')}</span>
                {p.href
                  ? <span style={{ color: 'var(--accent)', fontSize: 10 }}>open →</span>
                  : <span style={{ color: 'var(--fg-mute)', fontSize: 10, fontStyle: 'italic' }}>case study soon</span>}
              </div>
              <h3>{p.title}</h3>
              <div className="org">{p.org} · {p.year}</div>
              <div className="desc">{p.desc}</div>
              <div className="meta">{p.stack.map(s => <span key={s}>{s}</span>)}</div>
              <div className="stat">
                {p.stat.label}: {p.stat.from !== '—' && <span style={{ color: 'var(--fg-mute)', textDecoration: 'line-through' }}>{p.stat.from}</span>} <b>{p.stat.to}</b>
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

function ExperienceView() {
  return (
    <section>
      <h2><span className="h2-mark">{'//'}</span>experience.log</h2>
      <div className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 28 }}>
        A <em>decade</em> of production.
      </div>
      <table className="xp">
        <thead>
          <tr><th style={{ width: 130 }}>Year</th><th>Company</th><th>Role</th><th>Stack</th></tr>
        </thead>
        <tbody>
          {EXPERIENCE.map(([yr, co, role, stack]) => (
            <tr key={co + yr}>
              <td className="yr">{yr}</td>
              <td className="co">{co}</td>
              <td className="role">{role}</td>
              <td className="stack">{stack}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function WritingView() {
  const [filter, setFilter] = useState('all');
  const [hovered, setHovered] = useState(null);
  const tags = ['all', ...Array.from(new Set(WRITING.map(w => w.tag)))];
  const list = filter === 'all' ? WRITING : WRITING.filter(w => w.tag === filter);
  const pinned = WRITING.filter(w => w.pinned);
  return (
    <section>
      <h2><span className="h2-mark">{'//'}</span>writing/</h2>
      <div className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 14 }}>
        Notes from the <em>field.</em>
      </div>
      <div className="lede" style={{ marginBottom: 24 }}>
        Long-form notes on agents, migrations, and the unglamorous engineering that pays for itself.
        Roughly one essay a month — sometimes more, sometimes less, depending on what is on fire.
      </div>

      {/* pinned */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--density-gap)', marginBottom: 32 }}>
        {pinned.map(p => (
          <div key={p.title}
               onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-2)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
               onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.transform = 'none'; }}
               onClick={() => { if (p.href) window.location.href = p.href; }}
               style={{
                 background: 'var(--bg-2)', border: '1px solid var(--line)',
                 padding: 18, position: 'relative', cursor: 'pointer',
                 transition: 'border-color .15s, transform .15s'
               }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent-warn)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
              ★ pinned · {p.date}
            </div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, lineHeight: 1.15, color: 'var(--fg)', marginBottom: 8 }}>
              {p.title}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6, marginBottom: 12 }}>
              {p.excerpt}
            </div>
            <div style={{ display: 'flex', gap: 10, fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)' }}>
              <span style={{ color: 'var(--accent-2)' }}>#{p.tag}</span>
              <span>·</span>
              <span>{p.read}</span>
            </div>
          </div>
        ))}
      </div>

      {/* tag filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', textTransform: 'uppercase', letterSpacing: 1.5, marginRight: 6 }}>filter</span>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)}
                  style={{
                    fontFamily: 'var(--mono)', fontSize: 11,
                    background: filter === t ? 'var(--accent)' : 'var(--bg-2)',
                    color: filter === t ? 'var(--bg)' : 'var(--fg-dim)',
                    border: '1px solid ' + (filter === t ? 'var(--accent)' : 'var(--line)'),
                    padding: '3px 10px', cursor: 'pointer',
                    fontWeight: filter === t ? 600 : 400
                  }}>
            {t === 'all' ? 'all' : '#' + t}
            <span style={{ opacity: .6, marginLeft: 6 }}>
              {t === 'all' ? WRITING.length : WRITING.filter(w => w.tag === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* full list */}
      <div className="writing-list">
        {list.map((w, i) => {
          const Tag = w.href ? 'a' : 'div';
          const tagProps = w.href
            ? { href: w.href, style: { textDecoration: 'none', color: 'inherit', display: 'block' } }
            : {};
          return (
          <Tag key={w.title} {...tagProps}>
          <div
               className="row"
               onMouseEnter={() => setHovered(i)}
               onMouseLeave={() => setHovered(null)}
               style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 4, padding: '14px 0', cursor: w.href ? 'pointer' : 'default' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, width: '100%' }}>
              <div className="date" style={{ width: 80, flex: 'none', color: 'var(--fg-mute)' }}>{w.date}</div>
              <div className="title" style={{ flex: 1, color: hovered === i ? 'var(--accent)' : 'var(--fg)' }}>
                {hovered === i && <span style={{ color: 'var(--accent)', marginRight: 6 }}>▸</span>}
                {w.title}
                {!w.href && <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--fg-mute)', fontStyle: 'italic' }}>(draft)</span>}
              </div>
              <div className="tag">#{w.tag}</div>
              <div style={{ color: 'var(--fg-mute)', fontSize: 10, width: 50, textAlign: 'right' }}>{w.read}</div>
            </div>
            {hovered === i && (
              <div style={{ paddingLeft: 94, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-dim)', lineHeight: 1.6, maxWidth: '70ch' }}>
                {w.excerpt}
              </div>
            )}
          </div>
          </Tag>
        );})}
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--line-strong)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <span><span style={{ color: 'var(--accent-warn)' }}>~</span> {list.length} of {WRITING.length} entries</span>
        <span><span style={{ color: 'var(--accent-warn)' }}>~</span> drafts in <span style={{ color: 'var(--accent-3)' }}>~/.drafts</span></span>
        <span><span style={{ color: 'var(--accent-warn)' }}>~</span> rss: <span style={{ color: 'var(--accent)' }}>/feed.xml</span></span>
        <span style={{ marginLeft: 'auto' }}>last build: {new Date().toISOString().slice(0,10)}</span>
      </div>
    </section>
  );
}

function ContactView() {
  return (
    <section>
      <h2><span className="h2-mark">{'//'}</span>contact.json</h2>
      <div className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 18 }}>
        Let's <em>build</em> something.
      </div>
      <div className="lede" style={{ marginBottom: 24 }}>
        Open to fractional CTO roles, AI/agent work, and large migrations.
        Fastest reply via email.
      </div>
      <div className="contact-card">
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)' }}>{'{'}</div>
        <div className="links">
          <a className="lk" href="mailto:Michaelpopedeveloper@gmail.com">
            <span className="key">"email":</span>
            <span className="val">"Michaelpopedeveloper@gmail.com"</span>
          </a>
          <a className="lk" href="https://github.com/MichaelPopeDeveloper" target="_blank" rel="noreferrer">
            <span className="key">"github":</span>
            <span className="val">"@MichaelPopeDeveloper"</span>
          </a>
          <a className="lk" href="https://www.linkedin.com/in/michael-p-320063104/" target="_blank" rel="noreferrer">
            <span className="key">"linkedin":</span>
            <span className="val">"michael-p-320063104"</span>
          </a>
          <a className="lk" href="#" onClick={(e)=>{e.preventDefault(); window.dispatchEvent(new CustomEvent('mp:nav', {detail:'resume'}));}}>
            <span className="key">"resume":</span>
            <span className="val">"~/resume.pdf"</span>
          </a>
          <div className="lk" style={{ cursor: 'default' }}>
            <span className="key">"location":</span>
            <span className="val">"Las Vegas, NV"</span>
          </div>
          <div className="lk" style={{ cursor: 'default' }}>
            <span className="key">"status":</span>
            <span className="val" style={{ color: 'var(--accent-3)' }}>"available"</span>
          </div>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', marginTop: 12 }}>{'}'}</div>
      </div>
    </section>
  );
}

function ResumeView() {
  return (
    <section>
      <h2><span className="h2-mark">{'//'}</span>resume.pdf</h2>
      <div className="display" style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: 18 }}>
        The <em>long</em> version.
      </div>
      <div className="lede">
        Full CV with project deep-dives, dollar-impact numbers, and references on request.
      </div>
      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a className="lk" href="mailto:Michaelpopedeveloper@gmail.com?subject=Resume%20request" style={{
          display: 'inline-flex', gap: 10, alignItems: 'center',
          padding: '12px 20px', border: '1px solid var(--accent)',
          color: 'var(--accent)', fontFamily: 'var(--mono)', fontSize: 12,
          textDecoration: 'none', background: 'var(--bg-2)'
        }}>
          <span style={{ color: 'var(--accent-warn)' }}>$</span> request resume.pdf
        </a>
        <a className="lk" href="https://www.linkedin.com/in/michael-p-320063104/" target="_blank" rel="noreferrer" style={{
          display: 'inline-flex', gap: 10, alignItems: 'center',
          padding: '12px 20px', border: '1px solid var(--line-strong)',
          color: 'var(--fg-dim)', fontFamily: 'var(--mono)', fontSize: 12,
          textDecoration: 'none', background: 'var(--bg-2)'
        }}>
          <span style={{ color: 'var(--fg-mute)' }}>$</span> view on linkedin
        </a>
      </div>
      <div style={{ marginTop: 28, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.8 }}>
        <div><span style={{ color: 'var(--accent-warn)' }}>--</span> tip: see <span style={{ color: 'var(--accent)' }}>:experience</span> for the rendered version</div>
        <div><span style={{ color: 'var(--accent-warn)' }}>--</span> or <span style={{ color: 'var(--accent)' }}>:projects</span> for shipping highlights</div>
      </div>
    </section>
  );
}

function NowSplit() {
  return (
    <div style={{ padding: 'var(--density-pad)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--fg-mute)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>~/now.md</div>
      <div style={{ fontFamily: 'var(--display)', fontSize: 28, fontStyle: 'italic', color: 'var(--fg)', lineHeight: 1.1, marginBottom: 16 }}>
        right <span style={{ color: 'var(--accent)' }}>now.</span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.9, color: 'var(--fg-dim)' }}>
        <li><span style={{ color: 'var(--accent)' }}>▸</span> Building agents @ Kilpatrick Townsend</li>
        <li><span style={{ color: 'var(--accent)' }}>▸</span> Multi-LLM router across 4 frontier models</li>
        <li><span style={{ color: 'var(--accent)' }}>▸</span> Picking up Rust on side projects</li>
        <li><span style={{ color: 'var(--accent)' }}>▸</span> Open to fractional CTO conversations</li>
      </ul>
      <div style={{ marginTop: 22, paddingTop: 14, borderTop: '1px dashed var(--line-strong)', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)' }}>
        <div>{'//'} updated {new Date().toISOString().slice(0,10)}</div>
        <div>{'//'} from <span style={{ color: 'var(--accent-3)' }}>las vegas</span></div>
      </div>
    </div>
  );
}

const VIEWS = {
  about: AboutView,
  projects: ProjectsView,
  experience: ExperienceView,
  writing: WritingView,
  contact: ContactView,
  resume: ResumeView
};

const FILE_META = {
  about:      { path: '~/about.md',       name: 'about.md',       lang: 'markdown', ext: 'md' },
  projects:   { path: '~/projects/',      name: 'projects/',      lang: 'tsx',      ext: 'tsx' },
  experience: { path: '~/experience.log', name: 'experience.log', lang: 'log',      ext: 'log' },
  writing:    { path: '~/writing/',       name: 'writing/',       lang: 'markdown', ext: 'md' },
  contact:    { path: '~/contact.json',   name: 'contact.json',   lang: 'json',     ext: 'json' },
  resume:     { path: '~/resume.pdf',     name: 'resume.pdf',     lang: 'pdf',      ext: 'pdf' }
};

// =============================================================
// SIDEBAR
// =============================================================
function Sidebar({ active, openTabs, onOpen }) {
  const [openProjects, setOpenProjects] = useState(true);
  const [openWriting, setOpenWriting] = useState(false);

  return (
    <aside className="sidebar">
      <h4>~/portfolio</h4>
      <div className="tree">
        <div className={'row ' + (active === 'about' ? 'active' : '')} onClick={() => onOpen('about')}>
          <span className="caret">·</span><span className="file">about.md</span>
        </div>
        <div className="row" onClick={() => { setOpenProjects(v => !v); onOpen('projects'); }}>
          <span className="caret">{openProjects ? '▾' : '▸'}</span><span className="dir">projects/</span>
        </div>
        {openProjects && PROJECTS.map(p => (
          <div key={p.id} className="row indent" onClick={() => onOpen('projects')}>
            <span className="caret">·</span><span className="file">{p.id}.tsx</span>
          </div>
        ))}
        <div className={'row ' + (active === 'experience' ? 'active' : '')} onClick={() => onOpen('experience')}>
          <span className="caret">·</span><span className="file">experience.log</span>
        </div>
        <div className="row" onClick={() => { setOpenWriting(v => !v); onOpen('writing'); }}>
          <span className="caret">{openWriting ? '▾' : '▸'}</span><span className="dir">writing/</span>
        </div>
        {openWriting && WRITING.map(w => (
          <div key={w.title} className="row indent" onClick={() => onOpen('writing')}>
            <span className="caret">·</span><span className="file" title={w.title}>{w.date.replace('-','')}.md</span>
          </div>
        ))}
        <div className={'row ' + (active === 'contact' ? 'active' : '')} onClick={() => onOpen('contact')}>
          <span className="caret">·</span><span className="file">contact.json</span>
        </div>
        <div className={'row ' + (active === 'resume' ? 'active' : '')} onClick={() => onOpen('resume')}>
          <span className="caret">·</span><span className="file">resume.pdf</span>
        </div>
      </div>

      <h4 style={{ marginTop: 28 }}>git</h4>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.8 }}>
        <div><span style={{ color: 'var(--accent-3)' }}> </span> main · clean</div>
        <div style={{ color: 'var(--fg-mute)' }}>147 commits · last 2d ago</div>
      </div>

      <h4 style={{ marginTop: 28 }}>buffers</h4>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--fg-mute)', lineHeight: 1.8 }}>
        {openTabs.map((t, i) => (
          <div key={t} style={{ color: t === active ? 'var(--accent)' : 'var(--fg-mute)' }}>
            {i+1} {FILE_META[t].name}
          </div>
        ))}
      </div>
    </aside>
  );
}

// =============================================================
// MAIN BUFFER
// =============================================================
function Buffer({ active, totalLines, splitOpen }) {
  const View = VIEWS[active] || AboutView;
  const lines = useMemo(() => Array.from({ length: totalLines }, (_, i) => i + 1), [totalLines]);
  const meta = FILE_META[active];

  return (
    <div className="pane">
      <div className="buffer-head">
        <span className="badge">{meta.ext}</span>
        <span style={{ color: 'var(--fg-dim)' }}>{meta.path}</span>
        <span style={{ marginLeft: 'auto' }}>● modified by you · {new Date().toLocaleDateString()}</span>
      </div>
      <div className="buffer">
        <div className="gutter">
          {lines.map(n => (
            <div key={n} className={'ln ' + (n === 1 ? 'active' : '')}>{n}</div>
          ))}
        </div>
        <div className="content">
          <View />
        </div>
      </div>
    </div>
  );
}

// =============================================================
// COMMAND BAR
// =============================================================
function CommandBar({ open, onClose, onCommand }) {
  const [q, setQ] = useState(':');
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ(':');
      setSel(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 10);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    if (term === ':' || term === '') return COMMANDS.slice(0, 8);
    return COMMANDS.filter(c => c.cmd.toLowerCase().includes(term) || c.desc.toLowerCase().includes(term));
  }, [q]);

  if (!open) return null;

  function run(cmd) {
    onCommand(cmd);
    onClose();
  }

  function onKey(e) {
    if (e.key === 'Escape') { onClose(); }
    else if (e.key === 'Enter') {
      if (filtered[sel]) run(filtered[sel]);
      else {
        // try direct match
        const hit = COMMANDS.find(c => c.cmd === q.trim());
        if (hit) run(hit);
        else onClose();
      }
    }
    else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p'))   { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
    else if (e.key === 'Tab' && filtered[sel]) {
      e.preventDefault();
      setQ(filtered[sel].cmd);
    }
  }

  return (
    <>
      {filtered.length > 0 && (
        <div className="cmd-suggestions">
          {filtered.map((c, i) => (
            <div key={c.cmd} className={'item ' + (i === sel ? 'sel' : '')}
                 onMouseEnter={() => setSel(i)}
                 onClick={() => run(c)}>
              <span className="k">{c.cmd}</span>
              <span className="d">{c.desc}</span>
            </div>
          ))}
        </div>
      )}
      <div className="cmdbar">
        <span className="prompt">:</span>
        <input
          ref={inputRef}
          value={q.startsWith(':') ? q.slice(1) : q}
          onChange={e => setQ(':' + e.target.value)}
          onKeyDown={onKey}
          spellCheck="false"
          autoCorrect="off"
          autoCapitalize="off"
        />
        <span style={{ color: 'var(--fg-mute)', fontSize: 10 }}>↵ run · ⇥ complete · esc</span>
      </div>
    </>
  );
}

// =============================================================
// SEARCH BAR (/)
// =============================================================
function SearchBar({ open, onClose, onMatch }) {
  const [q, setQ] = useState('');
  const ref = useRef(null);
  useEffect(() => { if (open) { setQ(''); setTimeout(() => ref.current && ref.current.focus(), 10); } }, [open]);
  if (!open) return null;
  function onKey(e) {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'Enter') {
      const term = q.toLowerCase().trim();
      const hit = ['about','projects','experience','writing','contact','resume'].find(s => s.includes(term));
      if (hit) onMatch(hit);
      onClose();
    }
  }
  return (
    <div className="cmdbar" style={{ borderTopColor: 'var(--accent-3)' }}>
      <span className="prompt" style={{ color: 'var(--accent-3)' }}>/</span>
      <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onKey} placeholder="search… (try 'proj', 'cont')" spellCheck="false" />
      <span style={{ color: 'var(--fg-mute)', fontSize: 10 }}>↵ jump · esc</span>
    </div>
  );
}

// =============================================================
// TWEAKS PANEL
// =============================================================
function TweaksPanel({ tweaks, setTweak, open, onClose }) {
  if (!open) return null;
  const themes = [
    { id: 'tokyo',   label: 'Tokyo Night',  c: '#7aa2f7' },
    { id: 'gruvbox', label: 'Gruvbox',      c: '#fabd2f' },
    { id: 'dracula', label: 'Dracula',      c: '#bd93f9' },
    { id: 'ghostty', label: 'Ghostty',      c: '#ff6b35' }
  ];
  return (
    <div className="tweaks open">
      <div className="head">
        <b>:tweaks</b>
        <span style={{ color: 'var(--fg-mute)', fontSize: 10 }}>configure.lua</span>
        <span className="x" onClick={onClose}>✕</span>
      </div>
      <div className="body">
        <div>
          <label>theme</label>
          <div className="swatches">
            {themes.map(t => (
              <div key={t.id} className={'sw ' + (tweaks.theme === t.id ? 'on' : '')}
                   style={{ background: t.c }}
                   title={t.label}
                   onClick={() => setTweak('theme', t.id)} />
            ))}
          </div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: 6 }}>
            {themes.find(t => t.id === tweaks.theme)?.label}
          </div>
        </div>
        <div>
          <label>font pairing</label>
          <div className="seg">
            <button className={tweaks.font === 'mono-serif' ? 'on' : ''} onClick={() => setTweak('font', 'mono-serif')}>mono+serif</button>
            <button className={tweaks.font === 'all-mono' ? 'on' : ''} onClick={() => setTweak('font', 'all-mono')}>all mono</button>
            <button className={tweaks.font === 'mono-sans' ? 'on' : ''} onClick={() => setTweak('font', 'mono-sans')}>mono+sans</button>
          </div>
        </div>
        <div>
          <label>density</label>
          <div className="seg">
            <button className={tweaks.density === 'compact' ? 'on' : ''} onClick={() => setTweak('density', 'compact')}>compact</button>
            <button className={tweaks.density === 'normal' ? 'on' : ''} onClick={() => setTweak('density', 'normal')}>normal</button>
            <button className={tweaks.density === 'roomy' ? 'on' : ''} onClick={() => setTweak('density', 'roomy')}>roomy</button>
          </div>
        </div>
        <div>
          <label>vim intensity</label>
          <div className="seg">
            <button className={tweaks.vim === 'subtle' ? 'on' : ''} onClick={() => setTweak('vim', 'subtle')}>subtle</button>
            <button className={tweaks.vim === 'balanced' ? 'on' : ''} onClick={() => setTweak('vim', 'balanced')}>balanced</button>
            <button className={tweaks.vim === 'full' ? 'on' : ''} onClick={() => setTweak('vim', 'full')}>full</button>
          </div>
        </div>
        <div className="toggle">
          <span>CRT scanlines</span>
          <input type="checkbox" checked={tweaks.crt} onChange={e => setTweak('crt', e.target.checked)} />
        </div>
        <div className="toggle">
          <span>cursor trail</span>
          <input type="checkbox" checked={tweaks.trail} onChange={e => setTweak('trail', e.target.checked)} />
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-mute)', borderTop: '1px dashed var(--line)', paddingTop: 8, lineHeight: 1.7 }}>
          press <kbd style={{ background: 'var(--bg)', padding: '1px 4px', border: '1px solid var(--line)', color: 'var(--accent-warn)' }}>:</kbd> for command mode<br/>
          <kbd style={{ background: 'var(--bg)', padding: '1px 4px', border: '1px solid var(--line)', color: 'var(--accent-warn)' }}>/</kbd> to search · <kbd style={{ background: 'var(--bg)', padding: '1px 4px', border: '1px solid var(--line)', color: 'var(--accent-warn)' }}>g h</kbd> for help
        </div>
      </div>
    </div>
  );
}

// =============================================================
// CURSOR TRAIL
// =============================================================
function useCursorTrail(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const trails = [];
    const N = 6;
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div');
      d.className = 'trail';
      d.style.opacity = String(0.35 - i * 0.05);
      document.body.appendChild(d);
      trails.push(d);
    }
    let mx = -100, my = -100;
    const positions = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf;
    function tick() {
      let px = mx, py = my;
      for (let i = 0; i < N; i++) {
        positions[i].x += (px - positions[i].x) * 0.35;
        positions[i].y += (py - positions[i].y) * 0.35;
        trails[i].style.transform = `translate(${positions[i].x - 4}px, ${positions[i].y - 7}px)`;
        px = positions[i].x; py = positions[i].y;
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      trails.forEach(d => d.remove());
    };
  }, [enabled]);
}

// =============================================================
// APP
// =============================================================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "tokyo",
  "font": "mono-serif",
  "density": "normal",
  "vim": "full",
  "crt": false,
  "trail": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [active, setActive] = useState('about');
  const [openTabs, setOpenTabs] = useState(['about', 'projects', 'experience', 'contact']);
  const [mode, setMode] = useState('NORMAL');
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [splitOpen, setSplitOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [keyHintShown, setKeyHintShown] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  const setTweak = useCallback((k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*'); } catch (e) {}
      return next;
    });
  }, []);

  // apply theme/font/density to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-font', tweaks.font);
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks.theme, tweaks.font, tweaks.density]);

  useCursorTrail(tweaks.trail);

  const openFile = useCallback((id) => {
    setActive(id);
    setOpenTabs(prev => prev.includes(id) ? prev : [...prev, id]);
    setStatusMsg(`"${FILE_META[id].path}" opened`);
    setTimeout(() => setStatusMsg(''), 2000);
  }, []);

  const closeTab = useCallback((id, e) => {
    if (e) e.stopPropagation();
    setOpenTabs(prev => {
      const next = prev.filter(t => t !== id);
      if (active === id && next.length > 0) {
        const idx = prev.indexOf(id);
        setActive(next[Math.max(0, idx - 1)] || next[0]);
      }
      return next.length > 0 ? next : ['about'];
    });
  }, [active]);

  const runCommand = useCallback((c) => {
    if (c.go) { openFile(c.go); }
    else if (c.action) {
      if (c.action.startsWith('theme:')) setTweak('theme', c.action.split(':')[1]);
      else if (c.action === 'split') setSplitOpen(true);
      else if (c.action === 'only') setSplitOpen(false);
      else if (c.action === 'crt') setTweak('crt', !tweaks.crt);
      else if (c.action === 'quit') {
        setStatusMsg("E37: this is a website, you can't :q ;)");
        setTimeout(() => setStatusMsg(''), 2500);
      }
    }
  }, [openFile, setTweak, tweaks.crt]);

  // listen for nav events from buttons inside views
  useEffect(() => {
    const fn = (e) => openFile(e.detail);
    window.addEventListener('mp:nav', fn);
    return () => window.removeEventListener('mp:nav', fn);
  }, [openFile]);

  // keyboard shortcuts
  useEffect(() => {
    let pending = '';
    let pendingTimer = null;
    function handler(e) {
      // ignore if typing in any input
      if (e.target.matches && e.target.matches('input, textarea')) return;

      if (e.key === ':') { e.preventDefault(); setMode('COMMAND'); setCmdOpen(true); return; }
      if (e.key === '/') { e.preventDefault(); setMode('COMMAND'); setSearchOpen(true); return; }
      if (e.key === 'i' || e.key === 'I') { setMode('INSERT'); setStatusMsg('-- INSERT --'); return; }
      if (e.key === 'v' || e.key === 'V') { setMode('VISUAL'); setStatusMsg('-- VISUAL --'); return; }
      if (e.key === 'Escape') { setMode('NORMAL'); setStatusMsg(''); setCmdOpen(false); setSearchOpen(false); return; }

      if (mode !== 'NORMAL') return;

      // single-key navigation
      if (e.key === 'j' || e.key === 'k' || e.key === 'h' || e.key === 'l') {
        e.preventDefault();
        const order = ['about','projects','experience','writing','contact','resume'];
        const idx = order.indexOf(active);
        let next = idx;
        if (e.key === 'j' || e.key === 'l') next = Math.min(order.length - 1, idx + 1);
        if (e.key === 'k' || e.key === 'h') next = Math.max(0, idx - 1);
        if (next !== idx) openFile(order[next]);
        return;
      }
      // gg / G
      if (e.key === 'G') { e.preventDefault(); openFile('contact'); return; }

      // gh = help / about, gp = projects, etc
      if (e.key === 'g') {
        pending = 'g';
        clearTimeout(pendingTimer);
        pendingTimer = setTimeout(() => { pending = ''; }, 800);
        return;
      }
      if (pending === 'g') {
        pending = '';
        clearTimeout(pendingTimer);
        const map = { h: 'about', a: 'about', p: 'projects', e: 'experience', w: 'writing', c: 'contact', r: 'resume' };
        if (map[e.key]) { e.preventDefault(); openFile(map[e.key]); }
        return;
      }

      if (e.key === 't') { e.preventDefault(); setTweaksOpen(v => !v); return; }
      if (e.key === '?') { e.preventDefault(); setKeyHintShown(true); return; }
    }
    window.addEventListener('keydown', handler);
    return () => { window.removeEventListener('keydown', handler); clearTimeout(pendingTimer); };
  }, [mode, active, openFile]);

  // tab order
  const tabs = openTabs.map(id => ({ id, label: FILE_META[id].name }));

  // cursor positions (random-ish for status)
  const lineCount = active === 'projects' ? 247 : active === 'experience' ? 180 : active === 'writing' ? 92 : 64;

  return (
    <div className={'frame' + (tweaks.crt ? ' crt' : '')}>
      {/* Title bar */}
      <div className="titlebar">
        <div className="traffic"><span className="r"></span><span className="y"></span><span className="g"></span></div>
        <span style={{ marginLeft: 6 }}>ghostty</span>
        <div className="path">
          <b>michael@vegas</b> : <b>~/portfolio</b>  <span style={{ color: 'var(--accent-3)' }}>(main)</span>
        </div>
        <span style={{ display: 'flex', gap: 10 }}>
          <span style={{ color: 'var(--accent-3)' }}>● connected</span>
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </span>
      </div>

      {/* Tab bar */}
      <div className="tabbar">
        {tabs.map(t => (
          <div key={t.id} className={'tab ' + (t.id === active ? 'active' : '')} onClick={() => openFile(t.id)}>
            <span style={{ color: t.id === active ? 'var(--accent)' : 'var(--fg-mute)' }}>{FILE_META[t.id].ext}</span>
            <span>{t.label}</span>
            {openTabs.length > 1 && <span className="close" onClick={(e) => closeTab(t.id, e)}>×</span>}
          </div>
        ))}
        <div className="spacer" />
      </div>

      <div className="body">
        <Sidebar active={active} openTabs={openTabs} onOpen={openFile} />

        <main className="main">
          <div className="pane-container">
            <Buffer active={active} totalLines={lineCount} />
            {splitOpen && (
              <div className="pane" style={{ flex: '0 0 320px' }}>
                <div className="buffer-head">
                  <span className="badge">md</span>
                  <span style={{ color: 'var(--fg-dim)' }}>~/now.md</span>
                  <span className="close" style={{ marginLeft: 'auto', cursor: 'pointer', color: 'var(--fg-mute)' }} onClick={() => setSplitOpen(false)}>×</span>
                </div>
                <div className="buffer">
                  <NowSplit />
                </div>
              </div>
            )}
          </div>

          {/* Command bar / search */}
          <CommandBar open={cmdOpen} onClose={() => { setCmdOpen(false); setMode('NORMAL'); }} onCommand={runCommand} />
          <SearchBar open={searchOpen} onClose={() => { setSearchOpen(false); setMode('NORMAL'); }} onMatch={openFile} />

          {/* Status line */}
          <div className="statusline">
            <span className={'seg mode ' + mode.toLowerCase()}>{mode}</span>
            <span className="seg branch">  main</span>
            <span className="seg file">
              <b>{FILE_META[active].path}</b>
              {statusMsg && <span style={{ marginLeft: 14, color: 'var(--accent-warn)', fontStyle: 'italic' }}>{statusMsg}</span>}
            </span>
            <span className="right">
              <span className="seg">{FILE_META[active].lang}</span>
              <span className="seg">utf-8</span>
              <span className="seg">spaces:2</span>
              <span className="seg last">{Math.floor(Math.random() * lineCount) + 1}:1   {Math.round((1/lineCount) * 100)}%</span>
            </span>
          </div>

          {/* Key hint */}
          {keyHintShown && (
            <div className="keyhint">
              <span className="x" onClick={() => setKeyHintShown(false)}>×</span>
              <div style={{ color: 'var(--accent)', marginBottom: 6 }}>keymap</div>
              <kbd>:</kbd> command · <kbd>/</kbd> search<br/>
              <kbd>h</kbd> <kbd>j</kbd> <kbd>k</kbd> <kbd>l</kbd> navigate<br/>
              <kbd>g</kbd> + <kbd>p</kbd>/<kbd>e</kbd>/<kbd>c</kbd> jump<br/>
              <kbd>t</kbd> tweaks · <kbd>esc</kbd> normal
            </div>
          )}
        </main>
      </div>

      {/* Tweaks */}
      <TweaksPanel tweaks={tweaks} setTweak={setTweak} open={tweaksOpen} onClose={() => setTweaksOpen(false)} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
