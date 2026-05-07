/* global React, ReactDOM, DesignCanvas, DCSection, DCArtboard */

const { useState } = React;

// ============================================================
// W1 — IDE Split Pane (NERDTree + buffer + minimap)
// ============================================================
function W1_IDESplit() {
  return (
    <div className="wf">
      {/* tab bar */}
      <div className="tabbar">
        <div className="tab active">~/about.md</div>
        <div className="tab">~/projects.tsx</div>
        <div className="tab">~/experience.log</div>
        <div className="tab">~/contact.json</div>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 11, color: '#888', alignSelf: 'center' }}>4 buffers</div>
      </div>

      <div className="row" style={{ height: 'calc(100% - 26px - 22px)' }}>
        {/* sidebar / NERDTree */}
        <div style={{ width: 180, borderRight: '1.5px solid var(--line)', padding: '12px 10px', background: '#f4f1e8' }}>
          <div className="mono" style={{ marginBottom: 8, color: '#555' }}>~/portfolio</div>
          <div className="scribble" style={{ lineHeight: 1.7 }}>
            <div>▾ <span className="accent">about/</span></div>
            <div style={{ paddingLeft: 14 }}>· bio.md</div>
            <div style={{ paddingLeft: 14 }}>· stack.yml</div>
            <div>▾ projects/</div>
            <div style={{ paddingLeft: 14 }}>· kilpatrick.tsx</div>
            <div style={{ paddingLeft: 14 }}>· everi.tsx</div>
            <div style={{ paddingLeft: 14 }}>· hulu.tsx</div>
            <div style={{ paddingLeft: 14 }}>· yum.tsx</div>
            <div>▸ experience/</div>
            <div>▸ writing/</div>
            <div>· resume.pdf</div>
            <div>· contact.json</div>
          </div>
        </div>

        {/* main buffer */}
        <div className="col" style={{ flex: 1, position: 'relative' }}>
          <div style={{ padding: '20px 18px', flex: 1 }}>
            <div className="row" style={{ gap: 8 }}>
              <div className="gutter" style={{ width: 24 }}>
                {Array.from({length: 14}, (_,i) => <div key={i}>{i+1}</div>)}
              </div>
              <div style={{ flex: 1 }}>
                <div className="mono" style={{ color: 'var(--accent-2)', fontSize: 12 }}>{"# Michael Pope"}</div>
                <div style={{ height: 4 }}></div>
                <div className="label" style={{ fontSize: 38, lineHeight: 1.05, fontFamily: 'var(--display)' }}>
                  Senior AI Engineer<br />
                  <span style={{ color: '#888' }}>&amp; Fractional CTO</span>
                </div>
                <div style={{ height: 12 }}></div>
                <div className="scribble">10+ yrs · OpenAI · Disney+ · WB Discovery · Yum!</div>
                <div style={{ height: 8 }}></div>
                <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
                  <span className="chip">TypeScript</span>
                  <span className="chip">Rust</span>
                  <span className="chip">Go</span>
                  <span className="chip">Python</span>
                  <span className="chip">LangChain</span>
                  <span className="chip">+8</span>
                </div>
                <div style={{ height: 14 }}></div>
                <div className="squiggle"></div>
                <div style={{ height: 14 }}></div>
                <div className="mono" style={{ color: 'var(--accent-2)', fontSize: 12 }}>{"## currently"}</div>
                <div className="scribble" style={{ lineHeight: 1.6 }}>
                  building agentic AI tooling at Kilpatrick Townsend<span className="cursor-block"></span>
                </div>
              </div>
            </div>
          </div>

          {/* annotation arrow */}
          <div className="annot" style={{ top: 60, right: 20 }}>
            <span>:e projects ↓</span>
          </div>
        </div>

        {/* minimap */}
        <div style={{ width: 60, borderLeft: '1.5px solid var(--line)', background: '#f4f1e8', padding: 8 }}>
          <div className="tiny" style={{ textAlign: 'center', marginBottom: 6 }}>map</div>
          {Array.from({length: 30}, (_,i) => (
            <div key={i} style={{
              height: 3, marginBottom: 2,
              background: i === 4 || i === 12 || i === 20 ? 'var(--accent)' : '#bbb',
              width: `${30 + (i*7)%50}%`
            }}></div>
          ))}
        </div>
      </div>

      {/* statusbar */}
      <div className="statusbar">
        <span className="mode-pill">NORMAL</span>
        <span>~/about.md</span>
        <span style={{ color: '#888' }}>main</span>
        <span style={{ marginLeft: 'auto' }}>utf-8 · markdown · 8:42</span>
      </div>
    </div>
  );
}

// ============================================================
// W2 — Single Buffer / Scroll Document (cleanest)
// ============================================================
function W2_SingleBuffer() {
  return (
    <div className="wf">
      <div className="titlebar">
        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        <div className="mono" style={{ marginLeft: 8, fontSize: 11, color: '#555' }}>michaelpope — :portfolio</div>
        <div style={{ marginLeft: 'auto' }} className="mono tiny">━ ━ ━</div>
      </div>

      <div style={{ padding: '28px 60px 40px', height: 'calc(100% - 22px - 22px)', overflow: 'hidden' }}>
        <div className="row">
          <div className="gutter" style={{ width: 28, marginRight: 12 }}>
            {Array.from({length: 24}, (_,i) => <div key={i}>{i+1}</div>)}
          </div>

          <div style={{ flex: 1 }}>
            <div className="mono" style={{ color: '#888', fontSize: 11 }}>{"# 1. INTRO"}</div>
            <div style={{ height: 4 }}></div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 56, lineHeight: 1, fontWeight: 700 }}>
              Michael <span className="underline-hand">Pope</span>
            </div>
            <div style={{ height: 6 }}></div>
            <div className="scribble" style={{ fontSize: 16 }}>
              Senior AI Engineer · Fractional CTO · Las Vegas
            </div>

            <div style={{ height: 22 }}></div>
            <div className="mono" style={{ color: '#888', fontSize: 11 }}>{"# 2. EXPERIENCE"}</div>
            <div style={{ height: 8 }}></div>
            <div className="col" style={{ gap: 6 }}>
              <div className="row" style={{ justifyContent: 'space-between', borderBottom: '1px dotted #999', paddingBottom: 4 }}>
                <span className="scribble">Kilpatrick Townsend — Sr AI Engineer</span>
                <span className="mono tiny">'24 — now</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', borderBottom: '1px dotted #999', paddingBottom: 4 }}>
                <span className="scribble">Everi — Tech Lead / Principal</span>
                <span className="mono tiny">'22 — '24</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', borderBottom: '1px dotted #999', paddingBottom: 4 }}>
                <span className="scribble">Yum! Brands — Sr Serverless</span>
                <span className="mono tiny">'22</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between', borderBottom: '1px dotted #999', paddingBottom: 4 }}>
                <span className="scribble">WB Discovery / Hulu</span>
                <span className="mono tiny">'21</span>
              </div>
            </div>

            <div style={{ height: 22 }}></div>
            <div className="mono" style={{ color: '#888', fontSize: 11 }}>{"# 3. PROJECTS"}</div>
            <div style={{ height: 8 }}></div>
            <div className="row" style={{ gap: 8 }}>
              <div className="box hatched" style={{ flex: 1, height: 70, padding: 6 }}>
                <div className="scribble">NLP AI tool</div>
                <div className="tiny">.NET · SK · GPT-4</div>
              </div>
              <div className="box hatched" style={{ flex: 1, height: 70, padding: 6 }}>
                <div className="scribble">Kiosk migration</div>
                <div className="tiny">Angular · Electron</div>
              </div>
              <div className="box hatched" style={{ flex: 1, height: 70, padding: 6 }}>
                <div className="scribble">Privacy ETL</div>
                <div className="tiny">Hapi · Py · AWS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* annotation */}
      <div className="annot" style={{ top: 130, right: 30, transform: 'rotate(-2deg)' }}>
        ← scroll = j/k<br />
        most readable ✓
      </div>

      <div className="statusbar">
        <span className="mode-pill">NORMAL</span>
        <span>~/portfolio.md</span>
        <span style={{ color: '#888' }}>1,1   Top</span>
        <span style={{ marginLeft: 'auto' }}>main · utf-8</span>
      </div>
    </div>
  );
}

// ============================================================
// W3 — Tiled Dashboard / Tmux-style splits
// ============================================================
function W3_Tiled() {
  return (
    <div className="wf">
      <div className="titlebar">
        <div className="dot"></div><div className="dot"></div><div className="dot"></div>
        <div className="mono" style={{ marginLeft: 8, fontSize: 11, color: '#555' }}>tmux: portfolio · 4 panes</div>
      </div>

      <div style={{ padding: 8, height: 'calc(100% - 22px - 22px)' }} className="col">
        {/* top row */}
        <div className="row" style={{ flex: 1, gap: 8 }}>
          {/* hero pane */}
          <div className="box" style={{ flex: 1.6, padding: 14, position: 'relative', background: '#fbf9f1' }}>
            <div className="mono tiny" style={{ position: 'absolute', top: 4, right: 8, color: '#888' }}>[1] hero</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 32, lineHeight: 1, marginTop: 12 }}>
              Michael Pope
            </div>
            <div className="scribble">Sr. AI Engineer</div>
            <div style={{ height: 6 }}></div>
            <pre className="mono" style={{ fontSize: 9, color: '#666', margin: 0, lineHeight: 1.05 }}>{`   _____  _____ 
  |     ||  _  |
  | | | ||   __|
  |_|_|_||__|   `}</pre>
          </div>

          {/* now pane */}
          <div className="box" style={{ flex: 1, padding: 12, position: 'relative', background: '#fbf9f1' }}>
            <div className="mono tiny" style={{ position: 'absolute', top: 4, right: 8, color: '#888' }}>[2] :now</div>
            <div className="scribble" style={{ fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>
              <div className="accent">▸ now</div>
              building agents @ Kilpatrick<br/>
              learning Rust<br/>
              ☕ las vegas
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div style={{ height: 8 }}></div>
        <div className="row" style={{ flex: 1.2, gap: 8 }}>
          {/* projects grid */}
          <div className="box" style={{ flex: 2, padding: 10, position: 'relative', background: '#fbf9f1' }}>
            <div className="mono tiny" style={{ position: 'absolute', top: 4, right: 8, color: '#888' }}>[3] :projects</div>
            <div className="scribble accent" style={{ marginBottom: 6 }}>▸ projects</div>
            <div className="row" style={{ gap: 6 }}>
              <div className="box-dashed" style={{ flex: 1, padding: 6, height: 56 }}>
                <div className="scribble" style={{ fontSize: 12 }}>NLP AI tool</div>
                <div className="tiny">SK · GPT-4 · React</div>
              </div>
              <div className="box-dashed" style={{ flex: 1, padding: 6, height: 56 }}>
                <div className="scribble" style={{ fontSize: 12 }}>Kiosk migration</div>
                <div className="tiny">Angular · Electron</div>
              </div>
              <div className="box-dashed" style={{ flex: 1, padding: 6, height: 56 }}>
                <div className="scribble" style={{ fontSize: 12 }}>Privacy ETL</div>
                <div className="tiny">Node · AWS</div>
              </div>
            </div>
          </div>
          {/* contact */}
          <div className="box" style={{ flex: 1, padding: 12, position: 'relative', background: '#fbf9f1' }}>
            <div className="mono tiny" style={{ position: 'absolute', top: 4, right: 8, color: '#888' }}>[4] :contact</div>
            <div className="scribble" style={{ fontSize: 12, marginTop: 12, lineHeight: 1.5 }}>
              <div className="accent">▸ reach me</div>
              gh: MichaelPopeDev<br/>
              in: michael-p-3200…<br/>
              ✉ michaelpope…@gmail
            </div>
          </div>
        </div>
      </div>

      <div className="annot" style={{ top: 80, right: -8, transform: 'rotate(8deg)' }}>
        ↘ Ctrl+w to switch panes
      </div>

      <div className="statusbar">
        <span className="mode-pill">NORMAL</span>
        <span style={{ color: 'var(--accent)' }}>● 1:hero</span>
        <span style={{ color: '#888' }}>2:now  3:projects  4:contact</span>
        <span style={{ marginLeft: 'auto' }}>tmux 3.4 · main</span>
      </div>
    </div>
  );
}

// ============================================================
// Mount
// ============================================================
function App() {
  return (
    <DesignCanvas title="Michael Pope · Portfolio Wireframes" subtitle="Three low-fi directions — pick one and I'll take it hi-fi">
      <DCSection id="layouts" title="Layout Directions" subtitle="Same content, different spatial vocabularies">
        <DCArtboard id="ide-split" label="W1 · IDE Split (NERDTree + minimap)" width={920} height={580}>
          <W1_IDESplit />
        </DCArtboard>
        <DCArtboard id="single-buffer" label="W2 · Single Buffer (scrolling doc)" width={760} height={580}>
          <W2_SingleBuffer />
        </DCArtboard>
        <DCArtboard id="tiled" label="W3 · Tmux Tiled (dashboard)" width={820} height={580}>
          <W3_Tiled />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
