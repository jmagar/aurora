// components.jsx
// Reusable Aurora-styled pieces for the video.
// All colors come from Aurora tokens via var(--*).

// ── Eyebrow / muted label ──────────────────────────────────
function Eyebrow({ children, color, style }) {
  return (
    <span
      className="aurora-muted-label"
      style={{
        color: color || 'var(--aurora-text-muted)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ── Panel — Aurora tier-2 card with token shadow + highlight ──
function Panel({ children, style, kind = 'medium' }) {
  const bg = kind === 'strong'
    ? 'var(--aurora-panel-strong)'
    : kind === 'control'
      ? 'var(--aurora-control-surface)'
      : 'var(--aurora-panel-medium)';
  return (
    <div style={{
      background: bg,
      border: '1px solid var(--aurora-border-default)',
      borderRadius: 'var(--radius-3)',
      boxShadow: 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Pill — small Aurora chip ───────────────────────────────
function Pill({ children, color, bg, border, mono, style }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)',
      background: bg || 'color-mix(in oklab, var(--aurora-accent-primary) 12%, transparent)',
      border: `1px solid ${border || 'color-mix(in oklab, var(--aurora-accent-primary) 30%, transparent)'}`,
      color: color || 'var(--aurora-accent-strong)',
      fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
      fontSize: 13,
      lineHeight: 1.2,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      ...style,
    }}>
      {children}
    </span>
  );
}

// ── Dot — accent core ──────────────────────────────────────
function Dot({ size = 8, color = 'var(--aurora-accent-primary)', glow = true, style }) {
  return (
    <span style={{
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      boxShadow: glow ? `0 0 12px ${color}` : 'none',
      display: 'inline-block',
      ...style,
    }} />
  );
}

// ── LabbyMark — hub-and-spoke node graph (from design system) ──
function LabbyMark({ size = 120, accent = '#67cbfa', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" style={style}>
      <line x1="256" y1="160" x2="256" y2="416"
            stroke="#1d3d4e" strokeWidth="2" strokeDasharray="6 8" />
      <path d="M 152 144 L 256 104 L 360 144 L 256 184 Z"
            fill="#24536c" stroke={accent} strokeWidth="2.5" />
      <circle cx="256" cy="144" r="6" fill="#0c1a24" stroke={accent} strokeWidth="2.5" />
      <path d="M 152 216 L 256 176 L 360 216 L 256 256 Z"
            fill="#1c7fac" stroke={accent} strokeWidth="2.5" />
      <circle cx="256" cy="216" r="6" fill="#0c1a24" stroke={accent} strokeWidth="2.5" />
      <path d="M 152 288 L 256 248 L 360 288 L 256 328 Z"
            fill="#29b6f6" stroke={accent} strokeWidth="2.5" />
      <circle cx="256" cy="288" r="6" fill="#0c1a24" stroke={accent} strokeWidth="2.5" />
      <path d="M 152 360 L 256 320 L 360 360 L 256 400 Z"
            fill="#67cbfa" stroke={accent} strokeWidth="2.5" />
      <circle cx="256" cy="360" r="9" fill={accent} />
      <circle cx="256" cy="360" r="14" fill="none" stroke={accent}
              strokeWidth="1.5" opacity="0.45" />
    </svg>
  );
}

// ── ServiceChip — a 'foreign' service Labby integrates with ─
// Used in the chaos scene. Renders as a small pill with mono label.
function ServiceChip({ name, tone = 'muted', style }) {
  const tones = {
    muted: {
      bg: 'var(--aurora-control-surface)',
      border: 'var(--aurora-border-default)',
      color: 'var(--aurora-text-muted)',
    },
    warn: {
      bg: 'color-mix(in oklab, var(--aurora-warn) 14%, var(--aurora-control-surface))',
      border: 'color-mix(in oklab, var(--aurora-warn) 35%, transparent)',
      color: 'var(--aurora-warn)',
    },
    rose: {
      bg: 'color-mix(in oklab, var(--aurora-error) 14%, var(--aurora-control-surface))',
      border: 'color-mix(in oklab, var(--aurora-error) 35%, transparent)',
      color: 'var(--aurora-error)',
    },
    success: {
      bg: 'color-mix(in oklab, var(--aurora-success) 14%, var(--aurora-control-surface))',
      border: 'color-mix(in oklab, var(--aurora-success) 35%, transparent)',
      color: 'var(--aurora-success)',
    },
    accent: {
      bg: 'color-mix(in oklab, var(--aurora-accent-primary) 18%, var(--aurora-control-surface))',
      border: 'color-mix(in oklab, var(--aurora-accent-primary) 40%, transparent)',
      color: 'var(--aurora-accent-strong)',
    },
  };
  const t = tones[tone] || tones.muted;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '10px 16px',
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-1)',
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      letterSpacing: '-0.005em',
      color: t.color,
      boxShadow: 'var(--aurora-shadow-subtle)',
      whiteSpace: 'nowrap',
      ...style,
    }}>
      <Dot size={6} color={t.color} glow={false} />
      {name}
    </div>
  );
}

// ── TerminalLine — one line of code/log inside the terminal ─
function TerminalLine({ children, color, dim = false }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 18,
      lineHeight: 1.55,
      color: color || (dim ? 'var(--aurora-text-muted)' : 'var(--aurora-text-primary)'),
      whiteSpace: 'pre',
    }}>
      {children}
    </div>
  );
}

// ── Terminal — Aurora panel with stoplights + content ──────
function Terminal({ children, width = 720, style }) {
  return (
    <div style={{
      width,
      background: '#08161f',
      border: '1px solid var(--aurora-border-strong)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--aurora-shadow-strong), var(--aurora-highlight-strong)',
      overflow: 'hidden',
      ...style,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '12px 16px',
        borderBottom: '1px solid var(--aurora-border-default)',
        background: 'var(--aurora-panel-medium)',
      }}>
        <span style={{width:10, height:10, borderRadius:5, background:'#c78490'}} />
        <span style={{width:10, height:10, borderRadius:5, background:'#c6a36b'}} />
        <span style={{width:10, height:10, borderRadius:5, background:'#7dd3c7'}} />
        <span style={{
          marginLeft: 12,
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--aurora-text-muted)',
          letterSpacing: '0.05em',
        }}>~/lab</span>
      </div>
      <div style={{ padding: '20px 24px' }}>{children}</div>
    </div>
  );
}

// ── LayerBox — one stratum of the architecture diagram ────
function LayerBox({ title, subtitle, tint = 'medium', width = 360, style }) {
  const tintBg = {
    medium: 'var(--aurora-panel-medium)',
    strong: 'var(--aurora-panel-strong)',
    surface: 'var(--aurora-control-surface)',
  }[tint];
  return (
    <div style={{
      width,
      padding: '16px 20px',
      background: tintBg,
      border: '1px solid var(--aurora-border-strong)',
      borderRadius: 'var(--radius-1)',
      boxShadow: 'var(--aurora-shadow-subtle), var(--aurora-highlight-medium)',
      ...style,
    }}>
      <div className="aurora-card-title" style={{
        fontFamily: 'var(--font-mono)', fontWeight: 700,
        color: 'var(--aurora-accent-strong)', letterSpacing: '-0.01em',
      }}>{title}</div>
      {subtitle && (
        <div className="aurora-dense-meta" style={{ marginTop: 6, color: 'var(--aurora-text-muted)' }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

// ── Arrow — connector between layers ──────────────────────
function Arrow({ length = 32, dir = 'down', dashed = false }) {
  if (dir === 'down') {
    return (
      <svg width="14" height={length} viewBox={`0 0 14 ${length}`}>
        <line x1="7" y1="0" x2="7" y2={length - 8}
              stroke="var(--aurora-border-strong)"
              strokeWidth="1.5"
              strokeDasharray={dashed ? '4 4' : 'none'} />
        <path d={`M 2 ${length - 10} L 7 ${length - 2} L 12 ${length - 10}`}
              stroke="var(--aurora-accent-primary)" strokeWidth="1.75"
              fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // horizontal
  return (
    <svg width={length} height="14" viewBox={`0 0 ${length} 14`}>
      <line x1="0" y1="7" x2={length - 8} y2="7"
            stroke="var(--aurora-border-strong)"
            strokeWidth="1.5"
            strokeDasharray={dashed ? '4 4' : 'none'} />
      <path d={`M ${length - 10} 2 L ${length - 2} 7 L ${length - 10} 12`}
            stroke="var(--aurora-accent-primary)" strokeWidth="1.75"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── RepoNode — one node in the family node graph ──────────
// Renders absolutely positioned. Caller sets x/y and entry timing.
function RepoNode({ name, tagline, x, y, size = 'md', highlight = false, opacity = 1 }) {
  const dims = {
    sm: { w: 200, p: '12px 16px', titleSize: 16, taglineSize: 11 },
    md: { w: 260, p: '14px 18px', titleSize: 18, taglineSize: 12 },
    lg: { w: 320, p: '18px 22px', titleSize: 22, taglineSize: 13 },
  }[size];
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      width: dims.w,
      padding: dims.p,
      background: highlight
        ? 'color-mix(in oklab, var(--aurora-accent-primary) 14%, var(--aurora-panel-strong))'
        : 'var(--aurora-panel-medium)',
      border: highlight
        ? '1px solid var(--aurora-accent-primary)'
        : '1px solid var(--aurora-border-strong)',
      borderRadius: 'var(--radius-2)',
      boxShadow: highlight
        ? `var(--aurora-shadow-medium), 0 0 24px color-mix(in oklab, var(--aurora-accent-primary) 30%, transparent), var(--aurora-highlight-strong)`
        : 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      opacity,
      transform: 'translate(-50%, -50%)',
      transition: 'background 240ms var(--motion-ease-out), border-color 240ms var(--motion-ease-out), box-shadow 240ms var(--motion-ease-out)',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: dims.titleSize,
        color: highlight ? 'var(--aurora-accent-strong)' : 'var(--aurora-text-primary)',
        letterSpacing: '-0.01em',
        lineHeight: 1.1,
      }}>
        {name}
      </div>
      {tagline && (
        <div style={{
          marginTop: 6,
          fontFamily: 'var(--font-sans)',
          fontSize: dims.taglineSize,
          color: 'var(--aurora-text-muted)',
          lineHeight: 1.35,
        }}>
          {tagline}
        </div>
      )}
    </div>
  );
}

// ── Connector — a line between two points with animatable draw ─
// progress 0..1 controls how much of the line is drawn.
function Connector({ from, to, progress = 1, color, dashed = false, glow = false }) {
  const c = color || 'var(--aurora-border-strong)';
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  const dashOffset = dashed
    ? 0
    : len * (1 - progress);
  return (
    <svg
      style={{
        position: 'absolute',
        left: 0, top: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <line
        x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={c}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '4 6' : len}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{
          filter: glow ? `drop-shadow(0 0 4px ${c})` : 'none',
        }}
      />
    </svg>
  );
}

// ── BigHeadline — page-title display, animatable opacity/y ──
function BigHeadline({ text, x, y, opacity = 1, ty = 0,
                       size = 64, color = 'var(--aurora-text-primary)',
                       align = 'left',
                       weight = 800, letterSpacing = '-0.045em' }) {
  const transformX = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(${transformX}, ${ty}px)`,
      opacity,
      fontFamily: 'var(--font-display)',
      fontWeight: weight,
      fontSize: size,
      letterSpacing,
      lineHeight: 1.04,
      color,
      whiteSpace: 'pre',
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  );
}

// ── Subhead — Display 2 ────────────────────────────────────
function Subhead({ text, x, y, opacity = 1, ty = 0, color, align = 'left', width }) {
  const transformX = align === 'center' ? '-50%' : '0';
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      transform: `translate(${transformX}, ${ty}px)`,
      opacity,
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '-0.02em',
      lineHeight: 1.22,
      color: color || 'var(--aurora-text-muted)',
      width,
      willChange: 'transform, opacity',
    }}>
      {text}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
//                                                          
//  PATTERN / GATEWAY / MARKETPLACE helpers                  
//                                                          
// ══════════════════════════════════════════════════════════

// ── SurfaceChip — one of the four shipping surfaces ───────
// CLI · REST · MCP · Web. Used in the Pattern scene to show
// what the template emits from a single binary.
function SurfaceChip({ kind, lit = 1, style }) {
  const cfg = {
    cli:  { label: 'CLI',     hint: 'cli.rs · stdout',
            icon: <PathIcon d="M 5 8 L 9 12 L 5 16  M 12 17 L 19 17" /> },
    rest: { label: 'REST API', hint: '/v1/<service>',
            icon: <PathIcon d="M 6 12 H 18  M 6 8 H 14  M 6 16 H 14" /> },
    mcp:  { label: 'MCP',     hint: '/mcp · stdio',
            icon: <PathIcon d="M 12 4 V 20  M 4 12 H 20  M 7 7 L 17 17  M 17 7 L 7 17" /> },
    web:  { label: 'Web UI',  hint: 'Labby · same origin',
            icon: <PathIcon d="M 4 6 H 20 V 18 H 4 Z  M 4 10 H 20" /> },
  }[kind];
  return (
    <div style={{
      width: 230,
      padding: '18px 18px 16px',
      background: 'var(--aurora-panel-strong)',
      border: '1px solid var(--aurora-border-strong)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      opacity: 0.35 + 0.65 * lit,
      transform: `scale(${0.96 + 0.04 * lit})`,
      transformOrigin: 'center',
      transition: 'none',
      position: 'relative',
      ...style,
    }}>
      {/* Accent stripe lights up when 'lit' */}
      <div style={{
        position: 'absolute',
        left: 0, top: 0, bottom: 0,
        width: 3,
        borderTopLeftRadius: 'var(--radius-2)',
        borderBottomLeftRadius: 'var(--radius-2)',
        background: 'var(--aurora-accent-primary)',
        opacity: lit,
        boxShadow: lit > 0.5 ? '0 0 12px var(--aurora-accent-primary)' : 'none',
      }}/>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 8,
      }}>
        <div style={{
          width: 28, height: 28,
          color: 'var(--aurora-accent-strong)',
        }}>
          {cfg.icon}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 20,
          letterSpacing: '-0.02em',
          color: 'var(--aurora-text-primary)',
        }}>{cfg.label}</div>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--aurora-text-muted)',
        letterSpacing: '-0.005em',
      }}>{cfg.hint}</div>
    </div>
  );
}

// Tiny stroked-path icon helper.
function PathIcon({ d }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
      <path d={d}
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── OAuthShield — security tile under the four surfaces ───
function OAuthShield({ pulse = 0, style }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '10px 18px',
      background: 'color-mix(in oklab, var(--aurora-accent-primary) 12%, var(--aurora-panel-strong))',
      border: '1px solid var(--aurora-accent-primary)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: `var(--aurora-shadow-medium), 0 0 ${12 + 16 * pulse}px color-mix(in oklab, var(--aurora-accent-primary) ${30 + 30*pulse}%, transparent)`,
      ...style,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="9" rx="2"
              stroke="var(--aurora-accent-strong)" strokeWidth="1.75"/>
        <path d="M 8 11 V 8 a 4 4 0 0 1 8 0 V 11"
              stroke="var(--aurora-accent-strong)" strokeWidth="1.75"
              fill="none" strokeLinecap="round"/>
        <circle cx="12" cy="15" r="1.4" fill="var(--aurora-accent-strong)"/>
      </svg>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--aurora-accent-strong)',
        letterSpacing: '-0.005em',
      }}>
        OAuth · Bearer · Loopback
      </span>
    </div>
  );
}

// ── UpstreamMcpCard — small card for one upstream the gateway proxies
function UpstreamMcpCard({ name, kind = 'http', status = 'ok', style }) {
  const dotColor = status === 'ok'
    ? 'var(--aurora-success)'
    : status === 'warn'
      ? 'var(--aurora-warn)'
      : 'var(--aurora-text-muted)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      background: 'var(--aurora-control-surface)',
      border: '1px solid var(--aurora-border-default)',
      borderRadius: 'var(--radius-1)',
      boxShadow: 'var(--aurora-shadow-subtle)',
      minWidth: 200,
      ...style,
    }}>
      <Dot size={7} color={dotColor} glow={status === 'ok'} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13, fontWeight: 700,
          color: 'var(--aurora-text-primary)',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{name}</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--aurora-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>{kind}</div>
      </div>
    </div>
  );
}

// ── MarketplaceTab — single source tab (Claude / Codex / MCP / ACP)
function MarketplaceTab({ label, count, active = false, accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '10px 16px',
      background: active
        ? 'color-mix(in oklab, var(--aurora-accent-primary) 16%, var(--aurora-panel-strong))'
        : 'var(--aurora-control-surface)',
      border: `1px solid ${active ? 'var(--aurora-accent-primary)' : 'var(--aurora-border-default)'}`,
      borderRadius: 'var(--radius-pill)',
      boxShadow: active
        ? '0 0 16px color-mix(in oklab, var(--aurora-accent-primary) 22%, transparent), var(--aurora-highlight-medium)'
        : 'var(--aurora-shadow-subtle)',
    }}>
      <Dot size={8} color={accent || 'var(--aurora-accent-primary)'} glow={active}/>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '-0.01em',
        color: active ? 'var(--aurora-text-primary)' : 'var(--aurora-text-muted)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--aurora-text-muted)',
        fontVariantNumeric: 'tabular-nums',
      }}>{count}</span>
    </div>
  );
}

// ── MarketplaceCard — one entry in the unified catalog
function MarketplaceCard({ source, name, blurb, target, installed = false, style }) {
  const sourceCfg = {
    claude: { label: 'CLAUDE',  color: 'var(--aurora-accent-pink-strong)' },
    codex:  { label: 'CODEX',   color: 'var(--aurora-warn)' },
    mcp:    { label: 'MCP REG', color: 'var(--aurora-accent-strong)' },
    acp:    { label: 'ACP REG', color: 'var(--aurora-success)' },
  }[source];
  return (
    <div style={{
      width: 320,
      padding: '14px 16px',
      background: 'var(--aurora-panel-medium)',
      border: '1px solid var(--aurora-border-strong)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      ...style,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: '0.16em',
          color: sourceCfg.color,
          padding: '3px 8px',
          background: `color-mix(in oklab, ${sourceCfg.color} 14%, transparent)`,
          border: `1px solid color-mix(in oklab, ${sourceCfg.color} 40%, transparent)`,
          borderRadius: 'var(--radius-pill)',
        }}>{sourceCfg.label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: installed ? 'var(--aurora-success)' : 'var(--aurora-text-muted)',
          letterSpacing: '0.04em',
        }}>{installed ? '✓ INSTALLED' : '→ ' + target}</span>
      </div>
      <div style={{
        marginTop: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 15, fontWeight: 700,
        color: 'var(--aurora-text-primary)',
        letterSpacing: '-0.01em',
      }}>{name}</div>
      <div style={{
        marginTop: 4,
        fontFamily: 'var(--font-sans)',
        fontSize: 12,
        color: 'var(--aurora-text-muted)',
        lineHeight: 1.4,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>{blurb}</div>
    </div>
  );
}

// ── InstallTarget — small destination label used in the marketplace scene
function InstallTarget({ icon, label, sub, accent = 'var(--aurora-accent-strong)', style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 18px',
      background: 'var(--aurora-panel-strong)',
      border: `1px solid ${accent}`,
      borderRadius: 'var(--radius-2)',
      boxShadow: `var(--aurora-shadow-medium), 0 0 18px color-mix(in oklab, ${accent} 20%, transparent), var(--aurora-highlight-strong)`,
      ...style,
    }}>
      <div style={{
        width: 34, height: 34,
        color: accent,
        flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: '-0.02em',
          color: 'var(--aurora-text-primary)',
        }}>{label}</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--aurora-text-muted)',
          marginTop: 2,
        }}>{sub}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Eyebrow, Panel, Pill, Dot, LabbyMark,
  ServiceChip, TerminalLine, Terminal,
  LayerBox, Arrow, RepoNode, Connector,
  BigHeadline, Subhead,
  SurfaceChip, PathIcon, OAuthShield,
  UpstreamMcpCard, MarketplaceTab, MarketplaceCard, InstallTarget,
});
