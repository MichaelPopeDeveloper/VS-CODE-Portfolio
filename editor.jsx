/* global React, ReactDOM */
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ============================================================
// SLASH MENU COMMANDS
// ============================================================
const SLASH_COMMANDS = [
  { id: 'h1', label: 'Heading 1', desc: 'Large section title', ico: 'H1', group: 'Text', exec: (e) => exec('formatBlock', 'H1', e) },
  { id: 'h2', label: 'Heading 2', desc: 'Sub-section title', ico: 'H2', group: 'Text', exec: (e) => exec('formatBlock', 'H2', e) },
  { id: 'h3', label: 'Heading 3', desc: 'Smaller heading', ico: 'H3', group: 'Text', exec: (e) => exec('formatBlock', 'H3', e) },
  { id: 'p', label: 'Paragraph', desc: 'Regular body text', ico: '¶', group: 'Text', exec: (e) => exec('formatBlock', 'P', e) },
  { id: 'quote', label: 'Quote', desc: 'Pull-out quote', ico: '"', group: 'Text', exec: (e) => exec('formatBlock', 'BLOCKQUOTE', e) },
  { id: 'ul', label: 'Bullet List', desc: 'Unordered list', ico: '•', group: 'Text', exec: (e) => exec('insertUnorderedList', null, e) },
  { id: 'ol', label: 'Numbered List', desc: 'Ordered list', ico: '1.', group: 'Text', exec: (e) => exec('insertOrderedList', null, e) },
  { id: 'hr', label: 'Divider', desc: 'Horizontal rule', ico: '─', group: 'Text', exec: (e) => exec('insertHorizontalRule', null, e) },
  { id: 'code', label: 'Code Block', desc: 'Syntax-highlighted snippet', ico: '<>', group: 'Embed', open: 'codeblock' },
  { id: 'callout', label: 'Callout', desc: 'Highlighted note/warning', ico: '!', group: 'Embed', exec: insertCallout },
  { id: 'image', label: 'Image', desc: 'Upload screenshot or paste URL', ico: '🖼', group: 'Embed', open: 'image' },
  { id: 'video', label: 'Video Embed', desc: 'YouTube, Vimeo, Loom', ico: '▶', group: 'Embed', open: 'video' },
  { id: 'link', label: 'Link', desc: 'Add hyperlink', ico: '↗', group: 'Embed', open: 'link' }
];

function exec(cmd, val, editorEl) {
  document.execCommand(cmd, false, val);
  if (editorEl) editorEl.focus();
}

function insertCallout(editorEl) {
  const html = '<div class="callout"><strong>Note:</strong> Your callout text here.</div><p><br></p>';
  document.execCommand('insertHTML', false, html);
  editorEl && editorEl.focus();
}

// ============================================================
// TOOLBAR
// ============================================================
function Toolbar({ editorRef, onOpenModal, words, chars, mode, setMode }) {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force(x => x + 1);
    document.addEventListener('selectionchange', fn);
    return () => document.removeEventListener('selectionchange', fn);
  }, []);

  const isOn = (cmd) => {
    try { return document.queryCommandState(cmd); } catch (e) { return false; }
  };
  const isBlock = (tag) => {
    try { return document.queryCommandValue('formatBlock').toLowerCase() === tag.toLowerCase(); } catch (e) { return false; }
  };

  const Btn = ({ cmd, val, on, children, title }) => (
    <button className={'tb-btn ' + (on ? 'on' : '')} title={title}
      onMouseDown={(e) => { e.preventDefault(); exec(cmd, val, editorRef.current); }}>
      {children}
    </button>
  );

  return (
    <div className="toolbar">
      <select className="tb-select" onChange={(e) => { exec('formatBlock', e.target.value, editorRef.current); e.target.value = 'choose'; }}>
        <option value="choose">paragraph style…</option>
        <option value="P">¶ Paragraph</option>
        <option value="H1">H1 Heading</option>
        <option value="H2">H2 Heading</option>
        <option value="H3">H3 Heading</option>
        <option value="BLOCKQUOTE">" Quote</option>
      </select>
      <div className="tb-sep" />
      <div className="tb-group">
        <Btn cmd="bold" on={isOn('bold')} title="Bold (⌘B)"><b>B</b></Btn>
        <Btn cmd="italic" on={isOn('italic')} title="Italic (⌘I)"><i>I</i></Btn>
        <Btn cmd="underline" on={isOn('underline')} title="Underline (⌘U)"><u>U</u></Btn>
        <Btn cmd="strikeThrough" on={isOn('strikeThrough')} title="Strikethrough"><s>S</s></Btn>
      </div>
      <div className="tb-sep" />
      <div className="tb-group">
        <button className="tb-btn" title="Inline code"
          onMouseDown={(e) => { e.preventDefault(); document.execCommand('insertHTML', false, `<code>${(window.getSelection().toString() || 'code')}</code>`); editorRef.current.focus(); }}>
          <span style={{ fontFamily: 'var(--mono)', color: 'var(--accent-3)' }}>{'<>'}</span>
        </button>
        <button className="tb-btn" title="Link" onMouseDown={(e) => { e.preventDefault(); onOpenModal('link'); }}>↗</button>
      </div>
      <div className="tb-sep" />
      <div className="tb-group">
        <Btn cmd="insertUnorderedList" on={isOn('insertUnorderedList')} title="Bullet list">•</Btn>
        <Btn cmd="insertOrderedList" on={isOn('insertOrderedList')} title="Numbered list">1.</Btn>
        <Btn cmd="formatBlock" val="BLOCKQUOTE" on={isBlock('BLOCKQUOTE')} title="Quote">"</Btn>
        <Btn cmd="insertHorizontalRule" title="Divider">─</Btn>
      </div>
      <div className="tb-sep" />
      <div className="tb-group">
        <button className="tb-btn" title="Code block" onMouseDown={(e) => { e.preventDefault(); onOpenModal('codeblock'); }}>
          <span style={{ color: 'var(--accent-3)' }}>{'</>'}</span>
        </button>
        <button className="tb-btn" title="Image" onMouseDown={(e) => { e.preventDefault(); onOpenModal('image'); }}>🖼</button>
        <button className="tb-btn" title="Video embed" onMouseDown={(e) => { e.preventDefault(); onOpenModal('video'); }}>▶</button>
        <button className="tb-btn" title="Callout"
          onMouseDown={(e) => { e.preventDefault(); insertCallout(editorRef.current); }}>!</button>
      </div>
      <div className="tb-sep" />
      <div className="tb-group">
        <Btn cmd="undo" title="Undo">↶</Btn>
        <Btn cmd="redo" title="Redo">↷</Btn>
      </div>

      <div className="tb-spacer" />
      <span className="word-count">{words} words · {chars} chars · ~{Math.max(1, Math.ceil(words / 220))} min read</span>
      <div className="tb-sep" />
      <div className="tb-group">
        <button className={'tb-btn ' + (mode === 'edit' ? 'on' : '')} onClick={() => setMode('edit')}>edit</button>
        <button className={'tb-btn ' + (mode === 'preview' ? 'on' : '')} onClick={() => setMode('preview')}>preview</button>
      </div>
    </div>
  );
}

// ============================================================
// SLASH MENU
// ============================================================
function SlashMenu({ pos, query, onPick, onClose, editorRef }) {
  const [sel, setSel] = useState(0);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return SLASH_COMMANDS.filter(c => !q || c.label.toLowerCase().includes(q) || c.id.includes(q) || c.desc.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => { setSel(0); }, [query]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(filtered.length - 1, s + 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(0, s - 1)); }
      else if (e.key === 'Enter') { e.preventDefault(); if (filtered[sel]) onPick(filtered[sel]); }
      else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [filtered, sel, onPick, onClose]);

  if (filtered.length === 0) return null;

  let lastGroup = null;
  return (
    <div className="slash-menu" style={{ left: pos.x, top: pos.y }}>
      {filtered.map((c, i) => {
        const showHeader = c.group !== lastGroup;
        lastGroup = c.group;
        return (
          <React.Fragment key={c.id}>
            {showHeader && <div className="header">{c.group}</div>}
            <div className={'item ' + (i === sel ? 'sel' : '')}
                 onMouseEnter={() => setSel(i)}
                 onMouseDown={(e) => { e.preventDefault(); onPick(c); }}>
              <div className="ico">{c.ico}</div>
              <div className="text"><b>{c.label}</b><small>{c.desc}</small></div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ============================================================
// MODALS
// ============================================================
function LinkModal({ onClose, editorRef }) {
  const [url, setUrl] = useState('https://');
  const [text, setText] = useState('');
  const savedRange = useRef(null);
  useEffect(() => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
      setText(sel.toString());
    }
  }, []);
  function submit() {
    if (!url) return;
    editorRef.current.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    if (window.getSelection().toString()) {
      document.execCommand('createLink', false, url);
    } else {
      const html = `<a href="${url}" target="_blank" rel="noreferrer">${text || url}</a>`;
      document.execCommand('insertHTML', false, html);
    }
    onClose();
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="head"><b>:link</b><span className="x" onClick={onClose}>×</span></div>
        <div className="body">
          <label>url</label>
          <input value={url} onChange={e => setUrl(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && submit()} />
          <label>display text (optional)</label>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Leave blank to use URL" onKeyDown={e => e.key === 'Enter' && submit()} />
          <div className="row">
            <button onClick={onClose}>cancel</button>
            <button className="primary" onClick={submit}>insert link</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageModal({ onClose, editorRef }) {
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  function insert(src) {
    editorRef.current.focus();
    const html = caption
      ? `<figure><img src="${src}" alt="${caption}"/><figcaption>${caption}</figcaption></figure><p><br></p>`
      : `<img src="${src}" alt=""/><p><br></p>`;
    document.execCommand('insertHTML', false, html);
    onClose();
  }
  function onFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => insert(reader.result);
    reader.readAsDataURL(f);
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="head"><b>:image</b><span className="x" onClick={onClose}>×</span></div>
        <div className="body">
          <label>upload from disk</label>
          <input type="file" accept="image/*" onChange={onFile} style={{ padding: 6 }} />
          <label>or paste url</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://…" />
          <label>caption (optional)</label>
          <input value={caption} onChange={e => setCaption(e.target.value)} />
          <div className="row">
            <button onClick={onClose}>cancel</button>
            <button className="primary" disabled={!url} onClick={() => url && insert(url)}>insert</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoModal({ onClose, editorRef }) {
  const [url, setUrl] = useState('');
  function toEmbed(u) {
    try {
      const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/);
      if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
      const vimeo = u.match(/vimeo\.com\/(\d+)/);
      if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
      const loom = u.match(/loom\.com\/share\/([\w-]+)/);
      if (loom) return `https://www.loom.com/embed/${loom[1]}`;
    } catch (e) {}
    return u;
  }
  function submit() {
    if (!url) return;
    editorRef.current.focus();
    const src = toEmbed(url);
    const html = `<iframe src="${src}" allowfullscreen frameborder="0"></iframe><p><br></p>`;
    document.execCommand('insertHTML', false, html);
    onClose();
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="head"><b>:video</b><span className="x" onClick={onClose}>×</span></div>
        <div className="body">
          <label>youtube · vimeo · loom · direct .mp4</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" autoFocus onKeyDown={e => e.key === 'Enter' && submit()} />
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: -8, marginBottom: 14, fontStyle: 'italic' }}>
            Paste any video URL — we'll auto-detect and embed it correctly.
          </div>
          <div className="row">
            <button onClick={onClose}>cancel</button>
            <button className="primary" onClick={submit}>embed</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeBlockModal({ onClose, editorRef }) {
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('typescript');
  const ref = useRef(null);
  useEffect(() => { setTimeout(() => ref.current && ref.current.focus(), 50); }, []);
  function submit() {
    editorRef.current.focus();
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = `<pre data-lang="${lang}"><code>${escaped}</code></pre><p><br></p>`;
    document.execCommand('insertHTML', false, html);
    onClose();
  }
  function onKey(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = ref.current;
      const s = el.selectionStart, en = el.selectionEnd;
      const v = el.value;
      el.value = v.slice(0, s) + '  ' + v.slice(en);
      el.selectionStart = el.selectionEnd = s + 2;
      setCode(el.value);
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault(); submit();
    }
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" style={{ width: 640 }} onClick={e => e.stopPropagation()}>
        <div className="head"><b>:code-block</b><span className="x" onClick={onClose}>×</span></div>
        <div className="body">
          <label>language</label>
          <select value={lang} onChange={e => setLang(e.target.value)}>
            {['typescript','javascript','python','go','rust','csharp','sql','bash','json','yaml','html','css','jsx','tsx'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <label>code</label>
          <textarea ref={ref} className="cb-editor" value={code} onChange={e => setCode(e.target.value)} onKeyDown={onKey} placeholder="// paste or type your code…" rows={12} />
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginTop: -8, marginBottom: 14, fontStyle: 'italic' }}>
            ⌘+enter to insert · tab inserts 2 spaces
          </div>
          <div className="row">
            <button onClick={onClose}>cancel</button>
            <button className="primary" onClick={submit}>insert code</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// META SIDEBAR
// ============================================================
function MetaSidebar({ meta, setMeta, words, chars }) {
  const [tagInput, setTagInput] = useState('');
  function addTag(e) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (!meta.tags.includes(t)) setMeta({ ...meta, tags: [...meta.tags, t] });
      setTagInput('');
    }
  }
  function removeTag(t) { setMeta({ ...meta, tags: meta.tags.filter(x => x !== t) }); }
  const readMin = Math.max(1, Math.ceil(words / 220));

  return (
    <aside className="meta-side">
      <h4>frontmatter</h4>
      <div style={{ display: 'grid', gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginBottom: 4 }}>slug</div>
          <input className="field" value={meta.slug} onChange={e => setMeta({ ...meta, slug: e.target.value })} placeholder="my-blog-post" />
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginBottom: 4 }}>publish date</div>
          <input className="field" type="date" value={meta.date} onChange={e => setMeta({ ...meta, date: e.target.value })} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginBottom: 4 }}>author</div>
          <input className="field" value={meta.author} onChange={e => setMeta({ ...meta, author: e.target.value })} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: 'var(--fg-mute)', marginBottom: 4 }}>excerpt</div>
          <textarea className="field" value={meta.excerpt} onChange={e => setMeta({ ...meta, excerpt: e.target.value })} placeholder="One-sentence summary for the listing page." />
        </div>
      </div>

      <h4>tags</h4>
      <div className="tag-list">
        {meta.tags.map(t => (
          <span key={t} className="tag">#{t} <span className="x" onClick={() => removeTag(t)}>×</span></span>
        ))}
      </div>
      <input className="field" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="add tag + ↵" />

      <h4>options</h4>
      <div className="toggle-row"><span>pinned</span><input type="checkbox" checked={meta.pinned} onChange={e => setMeta({ ...meta, pinned: e.target.checked })} /></div>
      <div className="toggle-row"><span>draft</span><input type="checkbox" checked={meta.draft} onChange={e => setMeta({ ...meta, draft: e.target.checked })} /></div>

      <h4>stats</h4>
      <div className="stat-grid">
        <div className="stat"><b>{words}</b>words</div>
        <div className="stat"><b>{chars}</b>chars</div>
        <div className="stat"><b>{readMin} min</b>read time</div>
        <div className="stat"><b>{meta.tags.length}</b>tags</div>
      </div>

      <h4>shortcuts</h4>
      <div style={{ fontSize: 10, color: 'var(--fg-mute)', lineHeight: 1.9 }}>
        <div><b style={{ color: 'var(--accent-warn)' }}>/</b> slash menu</div>
        <div><b style={{ color: 'var(--accent-warn)' }}>⌘B</b> bold</div>
        <div><b style={{ color: 'var(--accent-warn)' }}>⌘I</b> italic</div>
        <div><b style={{ color: 'var(--accent-warn)' }}>⌘K</b> link</div>
        <div><b style={{ color: 'var(--accent-warn)' }}>⌘S</b> save draft</div>
        <div><b style={{ color: 'var(--accent-warn)' }}>⌘E</b> inline code</div>
      </div>
    </aside>
  );
}

// ============================================================
// EDITOR
// ============================================================
const STARTER_HTML = `<p>Start writing — or hit <code>/</code> to open the block menu.</p><p><br></p><p>You can <strong>bold</strong>, <em>italicize</em>, <u>underline</u>, add <a href="#">links</a>, paste <code>inline code</code>, and drop in code blocks, images, callouts, and video embeds.</p>`;

function App() {
  const editorRef = useRef(null);
  const [meta, setMeta] = useState({
    title: '',
    subtitle: '',
    slug: '',
    date: new Date().toISOString().slice(0, 10),
    author: 'Michael Pope',
    excerpt: '',
    tags: ['blog'],
    pinned: false,
    draft: true
  });

  const [mode, setMode] = useState('edit');
  const [modal, setModal] = useState(null);
  const [slash, setSlash] = useState(null);
  const [toast, setToast] = useState(null);
  const [words, setWords] = useState(0);
  const [chars, setChars] = useState(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mp-editor-draft');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.meta) setMeta(d.meta);
        if (d.html && editorRef.current) {
          editorRef.current.innerHTML = d.html;
          updateCounts();
        }
      } else if (editorRef.current) {
        editorRef.current.innerHTML = STARTER_HTML;
        updateCounts();
      }
    } catch (e) {}
  }, []);

  // Auto-save
  useEffect(() => {
    const t = setInterval(() => {
      try {
        const html = editorRef.current ? editorRef.current.innerHTML : '';
        localStorage.setItem('mp-editor-draft', JSON.stringify({ meta, html }));
      } catch (e) {}
    }, 2000);
    return () => clearInterval(t);
  }, [meta]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!meta.slug && meta.title) {
      const slug = meta.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 60);
      setMeta(m => ({ ...m, slug }));
    }
  }, [meta.title]);

  function updateCounts() {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    setChars(text.length);
    setWords(text.trim() ? text.trim().split(/\s+/).length : 0);
  }

  function showToast(msg, type = 'ok') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  }

  function exportHTML() {
    const html = editorRef.current.innerHTML;
    const out = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<title>${meta.title}</title>
<meta name="description" content="${meta.excerpt}"/>
<meta name="author" content="${meta.author}"/>
</head><body>
<article>
<h1>${meta.title}</h1>
${meta.subtitle ? `<p><em>${meta.subtitle}</em></p>` : ''}
<p><small>${meta.date} · ${meta.author} · #${meta.tags.join(' #')}</small></p>
<hr/>
${html}
</article>
</body></html>`;
    const blob = new Blob([out], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (meta.slug || 'post') + '.html'; a.click();
    URL.revokeObjectURL(url);
    showToast('exported · ' + (meta.slug || 'post') + '.html');
  }

  function exportMD() {
    // Very simple HTML→MD conversion for the common cases
    const html = editorRef.current.innerHTML;
    let md = html
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<code>(.*?)<\/code>/gi, '`$1`')
      .replace(/<pre[^>]*data-lang="([^"]*)"[^>]*><code>([\s\S]*?)<\/code><\/pre>/gi, '\n```$1\n$2\n```\n')
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, c) => '\n> ' + c.replace(/<[^>]+>/g, '').trim() + '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<\/?(ul|ol)>/gi, '\n')
      .replace(/<hr[^>]*>/gi, '\n---\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '')
      .replace(/<img[^>]*src="([^"]+)"[^>]*>/gi, '![]($1)')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
      .replace(/\n{3,}/g, '\n\n');
    const front = `---\ntitle: "${meta.title}"\ndate: ${meta.date}\nauthor: ${meta.author}\nexcerpt: "${meta.excerpt}"\ntags: [${meta.tags.map(t => `"${t}"`).join(', ')}]\npinned: ${meta.pinned}\ndraft: ${meta.draft}\n---\n\n`;
    const blob = new Blob([front + md.trim()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (meta.slug || 'post') + '.md'; a.click();
    URL.revokeObjectURL(url);
    showToast('exported · ' + (meta.slug || 'post') + '.md');
  }

  function saveDraft() {
    try {
      const html = editorRef.current.innerHTML;
      localStorage.setItem('mp-editor-draft', JSON.stringify({ meta, html }));
      showToast('draft saved');
    } catch (e) { showToast('save failed', 'error'); }
  }

  // detect "/" for slash menu
  function onInput(e) {
    updateCounts();
    if (editorRef.current) {
      editorRef.current.dataset.empty = !editorRef.current.innerText.trim() ? 'true' : 'false';
    }

    const sel = window.getSelection();
    if (!sel.rangeCount) { setSlash(null); return; }
    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== 3) { setSlash(null); return; }
    const text = node.textContent;
    const offset = range.startOffset;
    // find last "/" at start of word
    const before = text.slice(0, offset);
    const m = before.match(/(?:^|\s)(\/[\w]*)$/);
    if (m) {
      const rect = range.getBoundingClientRect();
      setSlash({ query: m[1].slice(1), pos: { x: rect.left, y: rect.bottom + 6 }, node, offset, slashStart: offset - m[1].length });
    } else {
      setSlash(null);
    }
  }

  function pickSlash(cmd) {
    // delete the "/query" first
    if (slash) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(slash.node, slash.slashStart);
      range.setEnd(slash.node, slash.offset);
      range.deleteContents();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setSlash(null);
    if (cmd.exec) cmd.exec(editorRef.current);
    else if (cmd.open) setModal(cmd.open);
    setTimeout(updateCounts, 50);
  }

  // global shortcuts
  useEffect(() => {
    function onKey(e) {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 's') { e.preventDefault(); saveDraft(); }
      else if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); setModal('link'); }
      else if (meta && e.key.toLowerCase() === 'e') { e.preventDefault();
        const sel = window.getSelection().toString();
        document.execCommand('insertHTML', false, `<code>${sel || 'code'}</code>`);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // paste cleanup — strip styles
  function onPaste(e) {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      // strip inline styles + classes from non-our elements
      tmp.querySelectorAll('*').forEach(el => {
        if (!el.className || !el.className.startsWith('callout')) {
          el.removeAttribute('style');
          el.removeAttribute('class');
        }
      });
      // unwrap font/span
      tmp.querySelectorAll('font, span').forEach(el => {
        const parent = el.parentNode;
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        parent.removeChild(el);
      });
      document.execCommand('insertHTML', false, tmp.innerHTML);
    } else {
      document.execCommand('insertText', false, text);
    }
    setTimeout(updateCounts, 0);
  }

  // drop image
  function onDrop(e) {
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        document.execCommand('insertHTML', false, `<img src="${reader.result}" alt=""/><p><br></p>`);
      };
      reader.readAsDataURL(f);
    }
  }

  return (
    <>
      {/* Title bar */}
      <div className="titlebar">
        <div className="traffic"><span className="r"></span><span className="y"></span><span className="g"></span></div>
        <span style={{ marginLeft: 6 }}>ghostty · :editor</span>
        <div className="path">
          <b>michael@vegas</b> : <b>~/portfolio/posts</b> · <span style={{ color: meta.draft ? 'var(--accent-warn)' : 'var(--accent-3)' }}>{meta.draft ? 'draft' : 'published'}</span>
        </div>
        <div className="actions">
          <a href="portfolio.html">← back</a>
          <button onClick={saveDraft}>⌘S save</button>
          <button onClick={exportMD}>↓ .md</button>
          <button onClick={exportHTML}>↓ .html</button>
          <button className="primary" onClick={() => { setMeta({ ...meta, draft: false }); showToast('marked as published — export to ship'); }}>publish</button>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar editorRef={editorRef} onOpenModal={setModal} words={words} chars={chars} mode={mode} setMode={setMode} />

      {/* Body */}
      <div className="body">
        <MetaSidebar meta={meta} setMeta={setMeta} words={words} chars={chars} />

        <div className="editor-wrap">
          <div className="editor-scroll">
            <div className="doc">
              <textarea
                className="doc-title"
                value={meta.title}
                onChange={e => setMeta({ ...meta, title: e.target.value })}
                placeholder="Untitled post"
                rows={1}
                style={{ overflow: 'hidden' }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              />
              <input
                className="doc-subtitle"
                value={meta.subtitle}
                onChange={e => setMeta({ ...meta, subtitle: e.target.value })}
                placeholder="Optional subtitle / dek"
              />
              <div className="doc-meta">
                <span className="avatar">{(meta.author || 'M').slice(0,1).toUpperCase()}</span>
                <span className="author">{meta.author}</span>
                <span>·</span>
                <span>{meta.date}</span>
                <span>·</span>
                <span>{Math.max(1, Math.ceil(words / 220))} min read</span>
                <span style={{ marginLeft: 'auto', color: 'var(--accent-2)' }}>{meta.tags.map(t => '#' + t).join('  ')}</span>
              </div>

              <div
                ref={editorRef}
                className="doc-body"
                contentEditable={mode === 'edit'}
                suppressContentEditableWarning
                spellCheck
                data-placeholder="Start writing — or hit / for blocks…"
                onInput={onInput}
                onPaste={onPaste}
                onDrop={onDrop}
                onDragOver={e => e.preventDefault()}
              />
            </div>
          </div>

          {/* Status line */}
          <div className="statusline">
            <span className="seg mode">{mode === 'edit' ? 'INSERT' : 'PREVIEW'}</span>
            <span className="seg" style={{ color: 'var(--accent-3)' }}>  drafts</span>
            <span className="seg">~/portfolio/posts/<b style={{ color: 'var(--fg)' }}>{meta.slug || 'untitled'}</b>.md</span>
            <span className="seg" style={{ color: meta.draft ? 'var(--accent-warn)' : 'var(--accent-3)' }}>{meta.draft ? '● draft' : '● ready'}</span>
            <span className="right">
              <span className="seg">markdown</span>
              <span className="seg">utf-8</span>
              <span className="seg">{words}w · {chars}c</span>
              <span className="seg last">{Math.max(1, Math.ceil(words / 220))} min</span>
            </span>
          </div>
        </div>
      </div>

      {/* Slash menu */}
      {slash && <SlashMenu pos={slash.pos} query={slash.query} onPick={pickSlash} onClose={() => setSlash(null)} editorRef={editorRef} />}

      {/* Modals */}
      {modal === 'link' && <LinkModal onClose={() => setModal(null)} editorRef={editorRef} />}
      {modal === 'image' && <ImageModal onClose={() => setModal(null)} editorRef={editorRef} />}
      {modal === 'video' && <VideoModal onClose={() => setModal(null)} editorRef={editorRef} />}
      {modal === 'codeblock' && <CodeBlockModal onClose={() => setModal(null)} editorRef={editorRef} />}

      {/* Toast */}
      {toast && <div className={'toast ' + (toast.type === 'error' ? 'error' : '')}>{toast.msg}</div>}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
