// scenes.jsx
// 78-second video. Seven scenes:
//   1. Chaos        0  → 6     A homelab is a tangle of services
//   2. Pattern      6  → 18    rmcp-template — 4 surfaces, OAuth, 1 binary 1 port
//   3. Family      18  → 32    The Rust server family fans out from the template
//   4. Gateway     32  → 46    Labby proxies upstream MCP servers, secured by OAuth
//   5. Marketplace 46  → 60    Unified catalog: Claude · Codex · MCP Registry · ACP
//   6. Aurora      60  → 70    100+ shadcn components · Kotlin counterparts for Android
//   7. Outro       70  → 78    Rust · MCP · Operator-first

// ── Scene boundaries (single source of truth) ─────────────
const SCENES = {
  chaos:       { start: 0,  end: 6  },
  pattern:     { start: 6,  end: 18 },
  family:      { start: 18, end: 32 },
  gateway:     { start: 32, end: 46 },
  marketplace: { start: 46, end: 60 },
  aurora:      { start: 60, end: 70 },
  outro:       { start: 70, end: 78 },
};

// ── Top-level composition ─────────────────────────────────
function VideoScenes() {
  return (
    <React.Fragment>
      <Sprite start={SCENES.chaos.start} end={SCENES.chaos.end}>
        <SceneChaos />
      </Sprite>
      <Sprite start={SCENES.pattern.start} end={SCENES.pattern.end}>
        <ScenePattern />
      </Sprite>
      <Sprite start={SCENES.family.start} end={SCENES.family.end}>
        <SceneFamily />
      </Sprite>
      <Sprite start={SCENES.gateway.start} end={SCENES.gateway.end}>
        <SceneGateway />
      </Sprite>
      <Sprite start={SCENES.marketplace.start} end={SCENES.marketplace.end}>
        <SceneMarketplace />
      </Sprite>
      <Sprite start={SCENES.aurora.start} end={SCENES.aurora.end}>
        <SceneAurora />
      </Sprite>
      <Sprite start={SCENES.outro.start} end={SCENES.outro.end}>
        <SceneOutro />
      </Sprite>
    </React.Fragment>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 1 — Chaos
// ══════════════════════════════════════════════════════════
function SceneChaos() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  // Headline fades in, then out at the end
  const headlineOpacity =
    animate({ from: 0, to: 1, start: 0.3, end: 1.2, ease: Easing.easeOutCubic })(t)
    * (1 - animate({ from: 0, to: 1, start: 5.0, end: 5.8, ease: Easing.easeInQuad })(t));
  const headlineY =
    animate({ from: 18, to: 0, start: 0.3, end: 1.2, ease: Easing.easeOutCubic })(t);

  const eyebrowOpacity =
    animate({ from: 0, to: 1, start: 0.1, end: 0.7, ease: Easing.easeOutCubic })(t)
    * (1 - animate({ from: 0, to: 1, start: 5.0, end: 5.7, ease: Easing.easeInQuad })(t));

  // Services scatter with staggered entry, drift subtly, then all fade together
  const services = [
    {name: 'Plex',        x: 250,  y: 178, tone: 'warn',    delay: 1.2},
    {name: 'Sonarr',      x: 500,  y: 132, tone: 'muted',   delay: 1.3},
    {name: 'Radarr',      x: 760,  y: 168, tone: 'rose',    delay: 1.4},
    {name: 'Prowlarr',    x: 1050, y: 130, tone: 'muted',   delay: 1.5},
    {name: 'qBittorrent', x: 1340, y: 178, tone: 'success', delay: 1.6},
    {name: 'SABnzbd',     x: 1600, y: 138, tone: 'muted',   delay: 1.7},

    {name: 'UniFi',       x: 138,  y: 386, tone: 'muted',   delay: 1.7},
    {name: 'Unraid',      x: 120,  y: 540, tone: 'warn',    delay: 1.85},
    {name: 'Docker',      x: 198,  y: 686, tone: 'success', delay: 2.0},
    {name: 'Tailscale',   x: 160,  y: 832, tone: 'muted',   delay: 2.15},

    {name: 'Gotify',      x: 1568, y: 380, tone: 'muted',   delay: 1.8},
    {name: 'Apprise',     x: 1612, y: 528, tone: 'rose',    delay: 1.95},
    {name: 'ntfy',        x: 1660, y: 676, tone: 'muted',   delay: 2.1},
    {name: 'Pi-hole',     x: 1568, y: 824, tone: 'warn',    delay: 2.25},

    {name: 'Tautulli',    x: 392,  y: 938, tone: 'muted',   delay: 2.3},
    {name: 'Overseerr',   x: 690,  y: 968, tone: 'success', delay: 2.4},
    {name: 'Arcane',      x: 980,  y: 932, tone: 'muted',   delay: 2.5},
    {name: 'Qdrant',      x: 1250, y: 968, tone: 'rose',    delay: 2.6},
    {name: 'rsyslog',     x: 1480, y: 932, tone: 'warn',    delay: 2.7},
  ];

  return (
    <React.Fragment>
      {/* Eyebrow */}
      <div style={{
        position:'absolute', left: 960, top: 380,
        transform: `translate(-50%, 0)`,
        opacity: eyebrowOpacity,
      }}>
        <Eyebrow style={{ fontSize: 13 }}>OPERATIONS</Eyebrow>
      </div>

      {/* Headline — Aurora Display 1 */}
      <BigHeadline
        text="Your homelab is a tangle"
        x={960} y={430}
        align="center"
        size={88}
        ty={headlineY}
        opacity={headlineOpacity}
        color="var(--aurora-text-primary)"
      />
      <BigHeadline
        text="of services."
        x={960} y={530}
        align="center"
        size={88}
        ty={headlineY}
        opacity={headlineOpacity}
        color="var(--aurora-accent-strong)"
      />

      {/* Drifting service chips */}
      {services.map((s, i) => {
        // entry
        const entryT = animate({
          from: 0, to: 1,
          start: s.delay, end: s.delay + 0.5,
          ease: Easing.easeOutCubic
        })(t);
        // joint exit
        const exitT = animate({
          from: 0, to: 1,
          start: 4.8, end: 5.8,
          ease: Easing.easeInQuad
        })(t);
        const opacity = entryT * (1 - exitT);

        // gentle drift
        const driftX = Math.sin((t - s.delay) * 0.6 + i) * 5;
        const driftY = Math.cos((t - s.delay) * 0.5 + i * 1.3) * 4;
        const scale = 0.7 + 0.3 * entryT - 0.05 * exitT;

        return (
          <div
            key={s.name}
            style={{
              position: 'absolute',
              left: s.x + driftX,
              top: s.y + driftY,
              opacity,
              transform: `scale(${scale})`,
              transformOrigin: 'center',
            }}
          >
            <ServiceChip name={s.name} tone={s.tone} />
          </div>
        );
      })}
    </React.Fragment>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 2 — One pattern (rmcp-template)
// 12 seconds. Client → Service → 4 surfaces (CLI · REST · MCP · Web),
// all secured by OAuth, all from one binary on one port.
// ══════════════════════════════════════════════════════════
function ScenePattern() {
  const { localTime } = useSprite();
  const t = localTime;

  // Global exit window
  const exitT = animate({from:0,to:1,start:10.6,end:11.7,ease:Easing.easeInQuad})(t);
  const alpha = 1 - exitT;

  // Eyebrow + headline
  const eyebrowOp = animate({from:0,to:1,start:0.2,end:1.0,ease:Easing.easeOutCubic})(t) * alpha;
  const titleOp = animate({from:0,to:1,start:0.4,end:1.4,ease:Easing.easeOutCubic})(t) * alpha;
  const titleY = animate({from:14,to:0,start:0.4,end:1.4,ease:Easing.easeOutCubic})(t);
  const subOp = animate({from:0,to:1,start:1.2,end:2.0,ease:Easing.easeOutCubic})(t) * alpha;

  // Layer entry timings
  const clientEntry  = animate({from:0,to:1,start:2.1,end:2.7,ease:Easing.easeOutBack})(t);
  const serviceEntry = animate({from:0,to:1,start:2.8,end:3.4,ease:Easing.easeOutBack})(t);
  const arrow1Op = animate({from:0,to:1,start:2.6,end:3.0,ease:Easing.easeOutCubic})(t) * alpha;
  const arrow2Op = animate({from:0,to:1,start:3.4,end:3.8,ease:Easing.easeOutCubic})(t) * alpha;

  function layerStyle(entry) {
    return {
      opacity: entry * alpha,
      transform: `translateY(${(1-entry)*20}px) scale(${0.95 + 0.05*entry})`,
    };
  }

  // 4 surface chips light up one at a time
  const surfaceDelays = [3.7, 4.05, 4.4, 4.75];
  const surfaceEntries = surfaceDelays.map(d =>
    animate({from:0,to:1,start:d,end:d+0.45,ease:Easing.easeOutBack})(t)
  );

  // OAuth shield
  const shieldEntry = animate({from:0,to:1,start:5.3,end:6.0,ease:Easing.easeOutBack})(t);
  const shieldPulse = Math.max(0, Math.sin((t - 5.7) * 2.4)) * 0.4 + 0.2;

  // "1 binary · 1 port" callout
  const calloutOp = animate({from:0,to:1,start:6.4,end:7.1,ease:Easing.easeOutCubic})(t) * alpha;

  // Lab anchor points
  const CENTER_X = 960;
  const CLIENT_Y = 460;
  const SERVICE_Y = 560;

  return (
    <React.Fragment>
      {/* Eyebrow */}
      <div style={{position:'absolute', left: CENTER_X, top: 100, transform:'translate(-50%, 0)', opacity: eyebrowOp}}>
        <Eyebrow style={{ fontSize: 13, color: 'var(--aurora-accent-strong)' }}>
          RMCP-TEMPLATE · THE REFERENCE
        </Eyebrow>
      </div>

      {/* Headline */}
      <BigHeadline
        text="One template."
        x={CENTER_X} y={146} align="center" size={84}
        opacity={titleOp} ty={titleY}
      />
      <BigHeadline
        text="Every server follows it."
        x={CENTER_X} y={238} align="center" size={84}
        opacity={titleOp} ty={titleY}
        color="var(--aurora-accent-strong)"
      />

      {/* Subtitle */}
      <Subhead
        text="Client → Service → CLI · REST · MCP · Web. Zero business logic in the shims."
        x={CENTER_X} y={362} align="center" opacity={subOp}
        width={1300}
        color="var(--aurora-text-muted)"
      />

      {/* Architecture stack — center column */}
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: CLIENT_Y,
        transform: 'translate(-50%, 0)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 0,
      }}>
        {/* Client */}
        <div style={layerStyle(clientEntry)}>
          <LayerBox
            title="Client"
            subtitle="HTTP · GraphQL · auth headers · retries · redacted errors"
            tint="surface"
            width={560}
          />
        </div>
        {/* arrow */}
        <div style={{ opacity: arrow1Op, marginTop: 4, marginBottom: 4 }}>
          <Arrow length={28} dir="down" />
        </div>
        {/* Service */}
        <div style={layerStyle(serviceEntry)}>
          <LayerBox
            title="Service"
            subtitle="validation · scopes · destructive-action gates · response shaping"
            tint="medium"
            width={560}
          />
        </div>
        {/* fan-out arrow */}
        <div style={{ opacity: arrow2Op, marginTop: 4, marginBottom: 14, position: 'relative', width: 560, height: 36 }}>
          <FanArrows width={560} />
        </div>
      </div>

      {/* Row of 4 surface chips */}
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: 790,
        transform: 'translate(-50%, 0)',
        display: 'flex', gap: 18,
      }}>
        {[
          {kind: 'cli'},
          {kind: 'rest'},
          {kind: 'mcp'},
          {kind: 'web'},
        ].map((s, i) => (
          <div key={s.kind} style={{
            transform: `translateY(${(1 - surfaceEntries[i]) * 16}px)`,
            opacity: alpha,
          }}>
            <SurfaceChip kind={s.kind} lit={surfaceEntries[i]} />
          </div>
        ))}
      </div>

      {/* OAuth shield + 1-binary callout (right-side of surface row) */}
      <div style={{
        position: 'absolute',
        left: CENTER_X, top: 970,
        transform: 'translate(-50%, 0)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          opacity: shieldEntry * alpha,
          transform: `scale(${0.85 + 0.15 * shieldEntry})`,
        }}>
          <OAuthShield pulse={shieldPulse} />
        </div>
        <div style={{
          opacity: calloutOp,
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: 'var(--aurora-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          1 binary · 1 port · stdio + http
        </div>
      </div>
    </React.Fragment>
  );
}

// ── FanArrows — 4-way fan from the service box down to the surface row
function FanArrows({ width = 560 }) {
  // Four target X offsets relative to the center (matching surface chip positions).
  // Chips are 230 wide, gap 18, so centers are at:
  //   -(115+18+115), -(115), +(115), +(115+18+115)  but compressed visually
  const dy = 36;
  return (
    <svg width={width} height={dy} viewBox={`0 0 ${width} ${dy}`}
         style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
      {[-368, -123, 123, 368].map((dx, i) => (
        <g key={i}>
          <path d={`M ${width/2} 0 Q ${width/2} ${dy*0.5}, ${width/2 + dx} ${dy}`}
                fill="none"
                stroke="var(--aurora-border-strong)"
                strokeWidth="1.5"
                opacity="0.75" />
          {/* arrowhead */}
          <path d={`M ${width/2 + dx - 5} ${dy - 6} L ${width/2 + dx} ${dy} L ${width/2 + dx + 5} ${dy - 6}`}
                fill="none"
                stroke="var(--aurora-accent-primary)"
                strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 3 — The family
// ══════════════════════════════════════════════════════════

const FAMILY_NODES = [
  // angle (deg from +x axis, -90 = top), name, tagline
  { angle: -90,  name: 'lab',          tagline: 'the homelab control plane', highlight: true, size: 'lg' },
  { angle: -54,  name: 'axon',         tagline: 'self-hosted RAG · Qdrant + Qwen3' },
  { angle: -18,  name: 'syslog-mcp',   tagline: 'homelab log intelligence · FTS5' },
  { angle:  18,  name: 'rustarr',      tagline: 'media automation · Sonarr · Radarr · Plex' },
  { angle:  54,  name: 'unrust',       tagline: 'Unraid GraphQL bridge · 24 actions' },
  { angle:  90,  name: 'rustify',      tagline: 'Gotify push notifications' },
  { angle: 126,  name: 'rustifi',      tagline: 'UniFi network · clients · sites · alarms' },
  { angle: 162,  name: 'rustcane',     tagline: 'Arcane Docker control plane' },
  { angle: -162, name: 'apprise-mcp',  tagline: 'one tool · 80+ notification services' },
  { angle: -126, name: 'synapse2',     tagline: 'Docker + guarded command exec' },
];

const FAMILY_CENTER = { x: 960, y: 620 };
const FAMILY_RX = 520;
const FAMILY_RY = 320;

function nodeXY(angleDeg) {
  const r = (angleDeg * Math.PI) / 180;
  return {
    x: FAMILY_CENTER.x + FAMILY_RX * Math.cos(r),
    y: FAMILY_CENTER.y + FAMILY_RY * Math.sin(r),
  };
}

function SceneFamily() {
  const { localTime } = useSprite();
  const t = localTime;

  // Headline
  const eyebrowOp = animate({from:0,to:1,start:0.1,end:0.8,ease:Easing.easeOutCubic})(t)
                  * (1 - animate({from:0,to:1,start:12.8,end:13.6,ease:Easing.easeInQuad})(t));
  const titleOp = animate({from:0,to:1,start:0.4,end:1.4,ease:Easing.easeOutCubic})(t)
                * (1 - animate({from:0,to:1,start:12.8,end:13.6,ease:Easing.easeInQuad})(t));
  const titleY = animate({from:14,to:0,start:0.4,end:1.4,ease:Easing.easeOutCubic})(t);

  // Center node (rmcp-template) appears first, then nodes fan out.
  const centerEntry = animate({from:0,to:1,start:1.4,end:2.3,ease:Easing.easeOutBack})(t);
  const centerExit = animate({from:0,to:1,start:12.8,end:13.6,ease:Easing.easeInQuad})(t);
  const centerOpacity = centerEntry * (1 - centerExit);

  // Each family node has its own delay (cascading sweep around the circle)
  const nodeDelays = FAMILY_NODES.map((_, i) => 2.4 + i * 0.4);

  // Connectors entry timing — same as the node
  const exitGlobal = animate({from:0,to:1,start:12.8,end:13.6,ease:Easing.easeInQuad})(t);
  const globalAlpha = 1 - exitGlobal;

  // Count of repos badge — animates up as nodes appear
  const visibleCount = nodeDelays.filter(d => t >= d).length;

  return (
    <React.Fragment>
      {/* Eyebrow */}
      <div style={{position:'absolute', left: 960, top: 80, transform:'translate(-50%, 0)', opacity: eyebrowOp}}>
        <Eyebrow style={{ fontSize: 13, color: 'var(--aurora-accent-strong)' }}>
          RUST SERVER FAMILY
        </Eyebrow>
      </div>

      <BigHeadline
        text="Ten services. One pattern."
        x={960} y={120} align="center" size={56} weight={800}
        opacity={titleOp} ty={titleY}
      />

      {/* Connectors — drawn beneath nodes */}
      {FAMILY_NODES.map((n, i) => {
        const delay = nodeDelays[i];
        const draw = animate({from:0,to:1,start:delay-0.15,end:delay+0.45,ease:Easing.easeOutCubic})(t);
        const xy = nodeXY(n.angle);
        return (
          <Connector
            key={`conn-${n.name}`}
            from={FAMILY_CENTER}
            to={xy}
            progress={draw}
            color={n.highlight
              ? 'var(--aurora-accent-primary)'
              : 'var(--aurora-border-strong)'}
            glow={n.highlight}
          />
        );
      })}

      {/* Center: rmcp-template */}
      <div style={{
        position: 'absolute',
        left: FAMILY_CENTER.x, top: FAMILY_CENTER.y,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * centerEntry})`,
        opacity: centerOpacity,
        willChange: 'transform, opacity',
      }}>
        <div style={{
          padding: '22px 28px',
          background: 'var(--aurora-panel-strong)',
          border: '1px solid var(--aurora-accent-strong)',
          borderRadius: 'var(--radius-3)',
          boxShadow: 'var(--aurora-shadow-strong), 0 0 32px color-mix(in oklab, var(--aurora-accent-primary) 30%, transparent), var(--aurora-highlight-strong)',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--aurora-accent-strong)',
          }}>
            REFERENCE
          </div>
          <div style={{
            marginTop: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 28, fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--aurora-text-primary)',
          }}>
            rmcp-template
          </div>
          <div style={{
            marginTop: 4,
            fontFamily: 'var(--font-sans)',
            fontSize: 12,
            color: 'var(--aurora-text-muted)',
          }}>
            shared scaffold for every Rust MCP server
          </div>
        </div>
      </div>

      {/* Family nodes */}
      {FAMILY_NODES.map((n, i) => {
        const delay = nodeDelays[i];
        const entry = animate({from:0,to:1,start:delay,end:delay+0.55,ease:Easing.easeOutBack})(t);
        const opacity = entry * globalAlpha;
        const xy = nodeXY(n.angle);
        // slight drift on entry
        const dx = (1 - entry) * Math.cos((n.angle * Math.PI) / 180) * 24;
        const dy = (1 - entry) * Math.sin((n.angle * Math.PI) / 180) * 24;
        return (
          <RepoNode
            key={n.name}
            name={n.name}
            tagline={n.tagline}
            x={xy.x + dx}
            y={xy.y + dy}
            size={n.size || 'md'}
            highlight={n.highlight}
            opacity={opacity}
          />
        );
      })}

      {/* Bottom counter */}
      <div style={{
        position: 'absolute', left: 960, bottom: 64,
        transform: 'translate(-50%, 0)',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 18px',
        background: 'var(--aurora-control-surface)',
        border: '1px solid var(--aurora-border-strong)',
        borderRadius: 'var(--radius-pill)',
        opacity: globalAlpha * animate({from:0,to:1,start:1.6,end:2.4,ease:Easing.easeOutCubic})(t),
        boxShadow: 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 24, fontWeight: 700,
          color: 'var(--aurora-accent-strong)',
          fontVariantNumeric: 'tabular-nums',
          minWidth: 32, textAlign: 'right',
        }}>
          {String(visibleCount).padStart(2,'0')}
        </span>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 13,
          color: 'var(--aurora-text-muted)',
          letterSpacing: '0.05em',
        }}>
          binaries · MCP + CLI · same Rust scaffold
        </span>
      </div>
    </React.Fragment>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 4 — Gateway (Labby as MCP gateway)
// 14 seconds. Upstream MCP servers in, AI clients out,
// OAuth in the middle, all flowing through one /mcp endpoint.
// ══════════════════════════════════════════════════════════
function SceneGateway() {
  const { localTime } = useSprite();
  const t = localTime;

  const exit = animate({from:0,to:1,start:12.8,end:13.7,ease:Easing.easeInQuad})(t);
  const alpha = 1 - exit;

  // Eyebrow + headline
  const eyebrowOp = animate({from:0,to:1,start:0.2,end:0.9,ease:Easing.easeOutCubic})(t) * alpha;
  const titleOp = animate({from:0,to:1,start:0.5,end:1.5,ease:Easing.easeOutCubic})(t) * alpha;
  const titleY = animate({from:14,to:0,start:0.5,end:1.5,ease:Easing.easeOutCubic})(t);
  const subOp = animate({from:0,to:1,start:1.5,end:2.3,ease:Easing.easeOutCubic})(t) * alpha;

  // Labby hub center
  const LABBY_HUB = { x: 960, y: 600 };
  const hubEntry = animate({from:0,to:1,start:1.0,end:2.0,ease:Easing.easeOutBack})(t);
  const hubOpacity = hubEntry * alpha;

  // Upstream MCP cards — left column, fly toward Labby
  const upstreams = [
    { name: 'syslog-mcp',  kind: 'http',  status: 'ok',   y: 290 },
    { name: 'unrust',      kind: 'stdio', status: 'ok',   y: 360 },
    { name: 'rustarr',     kind: 'http',  status: 'ok',   y: 430 },
    { name: 'axon',        kind: 'http',  status: 'ok',   y: 500 },
    { name: 'rustcane',    kind: 'http',  status: 'ok',   y: 570 },
    { name: 'rustifi',     kind: 'http',  status: 'ok',   y: 640 },
    { name: 'rustify',     kind: 'http',  status: 'warn', y: 710 },
    { name: 'rustscale',   kind: 'http',  status: 'ok',   y: 780 },
    { name: 'apprise-mcp', kind: 'http',  status: 'ok',   y: 850 },
    { name: 'synapse2',    kind: 'stdio', status: 'ok',   y: 920 },
  ];

  // AI clients — right column, connect TO Labby
  const clients = [
    { name: 'Claude',  y: 380, delay: 5.4 },
    { name: 'Codex',   y: 580, delay: 5.7 },
    { name: 'Gemini',  y: 780, delay: 6.0 },
  ];

  const UPSTREAM_X = 240;
  const CLIENT_X   = 1680;

  return (
    <React.Fragment>
      {/* Eyebrow */}
      <div style={{position:'absolute', left: 960, top: 80, transform:'translate(-50%, 0)', opacity: eyebrowOp}}>
        <Eyebrow style={{ fontSize: 13, color: 'var(--aurora-accent-strong)' }}>
          THE MCP GATEWAY
        </Eyebrow>
      </div>

      {/* Headline */}
      <BigHeadline
        text="Point your agents at Labby."
        x={960} y={120} align="center" size={56}
        opacity={titleOp} ty={titleY}
      />
      <BigHeadline
        text="It proxies the rest."
        x={960} y={192} align="center" size={56}
        opacity={titleOp} ty={titleY}
        color="var(--aurora-accent-strong)"
      />

      {/* Column eyebrows */}
      <div style={{ position:'absolute', left: UPSTREAM_X, top: 240, transform:'translate(-50%,0)', opacity: subOp }}>
        <Eyebrow style={{ fontSize: 11 }}>UPSTREAM MCP</Eyebrow>
      </div>
      <div style={{ position:'absolute', left: CLIENT_X, top: 320, transform:'translate(-50%,0)', opacity: subOp }}>
        <Eyebrow style={{ fontSize: 11 }}>MCP CLIENTS</Eyebrow>
      </div>

      {/* Connectors: upstreams → hub (drawn first so they sit under) */}
      {upstreams.map((u, i) => {
        const delay = 2.2 + i * 0.16;
        const draw = animate({from:0,to:1,start:delay,end:delay+0.5,ease:Easing.easeOutCubic})(t);
        return (
          <Connector
            key={`uc-${u.name}`}
            from={{ x: UPSTREAM_X + 110, y: u.y }}
            to={LABBY_HUB}
            progress={draw}
            color="var(--aurora-border-strong)"
          />
        );
      })}

      {/* Upstream cards */}
      {upstreams.map((u, i) => {
        const delay = 2.0 + i * 0.16;
        const entry = animate({from:0,to:1,start:delay,end:delay+0.45,ease:Easing.easeOutBack})(t);
        const dx = animate({from:-30,to:0,start:delay,end:delay+0.45,ease:Easing.easeOutCubic})(t);
        return (
          <div key={u.name} style={{
            position: 'absolute',
            left: UPSTREAM_X + dx, top: u.y,
            opacity: entry * alpha,
            transform: 'translate(-50%, -50%)',
          }}>
            <UpstreamMcpCard name={u.name} kind={u.kind} status={u.status} />
          </div>
        );
      })}

      {/* Hub label above */}
      <div style={{
        position: 'absolute',
        left: LABBY_HUB.x, top: LABBY_HUB.y - 220,
        transform: 'translate(-50%, 0)',
        opacity: hubOpacity,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 18, fontWeight: 700,
          color: 'var(--aurora-accent-strong)',
          letterSpacing: '0.04em',
        }}>labby gateway</div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12, fontWeight: 500,
          color: 'var(--aurora-text-muted)',
          marginTop: 4,
        }}>https://lab.example.com/mcp</div>
      </div>

      {/* Labby hub mark */}
      <div style={{
        position: 'absolute',
        left: LABBY_HUB.x, top: LABBY_HUB.y,
        transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * hubEntry})`,
        opacity: hubOpacity,
      }}>
        <LabbyMark size={280} />
      </div>

      {/* OAuth shield under the hub */}
      <div style={{
        position: 'absolute',
        left: LABBY_HUB.x, top: LABBY_HUB.y + 180,
        transform: 'translate(-50%, 0)',
        opacity: animate({from:0,to:1,start:4.6,end:5.4,ease:Easing.easeOutCubic})(t) * alpha,
      }}>
        <OAuthShield pulse={Math.sin(t * 2) * 0.3 + 0.3} />
      </div>

      {/* Connectors: hub → clients */}
      {clients.map((c) => (
        <Connector
          key={`cc-${c.name}`}
          from={LABBY_HUB}
          to={{ x: CLIENT_X - 130, y: c.y + 30 }}
          progress={animate({from:0,to:1,start:c.delay+0.2,end:c.delay+0.7,ease:Easing.easeOutCubic})(t)}
          color="var(--aurora-accent-primary)"
          glow
        />
      ))}

      {/* AI client chips on the right */}
      {clients.map((c) => {
        const entry = animate({from:0,to:1,start:c.delay,end:c.delay+0.5,ease:Easing.easeOutBack})(t);
        const dx = animate({from:30,to:0,start:c.delay,end:c.delay+0.5,ease:Easing.easeOutCubic})(t);
        return (
          <div key={c.name} style={{
            position: 'absolute',
            left: CLIENT_X + dx, top: c.y,
            opacity: entry * alpha,
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 20px',
            background: 'var(--aurora-panel-strong)',
            border: '1px solid var(--aurora-accent-primary)',
            borderRadius: 'var(--radius-2)',
            boxShadow: 'var(--aurora-shadow-medium), 0 0 18px color-mix(in oklab, var(--aurora-accent-primary) 24%, transparent), var(--aurora-highlight-strong)',
            minWidth: 220,
            transform: 'translateY(-50%)',
          }}>
            <ClientGlyph name={c.name} />
            <div>
              <div style={{
                fontFamily:'var(--font-display)', fontSize: 22, fontWeight: 800,
                color: 'var(--aurora-text-primary)', letterSpacing: '-0.02em',
              }}>
                {c.name}
              </div>
              <div style={{
                fontFamily:'var(--font-mono)', fontSize: 11,
                color: 'var(--aurora-text-muted)', marginTop: 2,
              }}>
                via /mcp · bearer
              </div>
            </div>
          </div>
        );
      })}

      {/* Bottom CLI tip */}
      <div style={{
        position: 'absolute',
        left: 960, bottom: 50,
        transform: 'translate(-50%, 0)',
        opacity: animate({from:0,to:1,start:7.4,end:8.4,ease:Easing.easeOutCubic})(t) * alpha,
        padding: '12px 20px',
        background: 'var(--aurora-control-surface)',
        border: '1px solid var(--aurora-border-strong)',
        borderRadius: 'var(--radius-2)',
        fontFamily: 'var(--font-mono)',
        fontSize: 15,
        color: 'var(--aurora-text-muted)',
        boxShadow: 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      }}>
        <span style={{color: 'var(--aurora-text-muted)'}}>$ </span>
        <span style={{color: 'var(--aurora-accent-strong)'}}>labby gateway add</span>
        <span> --url https://remote.example.com/mcp --bearer-token-env REMOTE_TOKEN</span>
      </div>
    </React.Fragment>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 5 — Marketplace (Unified catalog)
// 14 seconds. Four sources (Claude · Codex · MCP · ACP) → three
// install destinations (Gateway · Chat · Devices).
// ══════════════════════════════════════════════════════════
function SceneMarketplace() {
  const { localTime } = useSprite();
  const t = localTime;

  const exit = animate({from:0,to:1,start:12.8,end:13.7,ease:Easing.easeInQuad})(t);
  const alpha = 1 - exit;

  const eyebrowOp = animate({from:0,to:1,start:0.2,end:0.9,ease:Easing.easeOutCubic})(t) * alpha;
  const titleOp = animate({from:0,to:1,start:0.5,end:1.5,ease:Easing.easeOutCubic})(t) * alpha;
  const titleY = animate({from:14,to:0,start:0.5,end:1.5,ease:Easing.easeOutCubic})(t);
  const subOp = animate({from:0,to:1,start:1.3,end:2.1,ease:Easing.easeOutCubic})(t) * alpha;

  // Marketplace frame entry
  const frameEntry = animate({from:0,to:1,start:1.6,end:2.4,ease:Easing.easeOutCubic})(t);
  const frameY = animate({from:30,to:0,start:1.6,end:2.4,ease:Easing.easeOutCubic})(t);

  // Tabs entry
  const tabsEntry = animate({from:0,to:1,start:2.2,end:2.9,ease:Easing.easeOutCubic})(t);

  // Marketplace card definitions
  const cards = [
    { source: 'mcp',    name: 'syslog-mcp',   blurb: 'log intelligence · FTS5',     target: 'GATEWAY', delay: 3.0, targetIdx: 0 },
    { source: 'acp',    name: 'claude-agent', blurb: 'official ACP adapter',        target: 'CHAT',    delay: 3.3, targetIdx: 1 },
    { source: 'claude', name: 'ops-pack',     blurb: 'skills · agents · commands',  target: 'DEVICES', delay: 3.6, targetIdx: 2 },
    { source: 'codex',  name: 'syslog-dr',    blurb: 'codex plugin · DR runbook',   target: 'DEVICES', delay: 3.9, targetIdx: 2 },
  ];

  // Install targets (right column)
  const targets = [
    { label: 'Labby gateway', sub: 'upstream MCP · OAuth merged',     accent: 'var(--aurora-accent-strong)' },
    { label: 'Labby chat',    sub: 'ACP session providers',           accent: 'var(--aurora-success)'       },
    { label: 'Your devices',  sub: 'Claude · Codex · cherry-picked',  accent: 'var(--aurora-accent-pink-strong)' },
  ];

  // Target absolute Y positions (used for connector destinations)
  const TARGET_BASE_Y = 380;
  const TARGET_STRIDE = 180;
  const targetCenterY = (i) => TARGET_BASE_Y + i * TARGET_STRIDE + 32;

  // Frame layout constants used for connector source calculations
  const FRAME_X = 80;
  const FRAME_TOP = 290;
  const TABS_HEIGHT = 110;   // header + tabs row
  const GRID_X_PAD = 24;
  const CARD_W = 472;
  const CARD_H = 88;
  const CARD_GAP = 18;

  function cardCenter(i) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = FRAME_X + GRID_X_PAD + col * (CARD_W + CARD_GAP) + CARD_W - 6;
    const y = FRAME_TOP + 50 + TABS_HEIGHT + row * (CARD_H + CARD_GAP) + CARD_H / 2;
    return { x, y };
  }

  return (
    <React.Fragment>
      {/* Eyebrow */}
      <div style={{position:'absolute', left: 960, top: 70, transform:'translate(-50%, 0)', opacity: eyebrowOp}}>
        <Eyebrow style={{ fontSize: 13, color: 'var(--aurora-accent-strong)' }}>
          UNIFIED MARKETPLACE
        </Eyebrow>
      </div>

      {/* Headline */}
      <BigHeadline
        text="Browse. Install. Done."
        x={960} y={108} align="center" size={62}
        opacity={titleOp} ty={titleY}
      />
      <Subhead
        text="Claude · Codex · MCP Registry · ACP Registry — one catalog, three destinations."
        x={960} y={200} align="center" opacity={subOp}
        width={1380}
        color="var(--aurora-text-muted)"
      />

      {/* Marketplace frame */}
      <div style={{
        position: 'absolute',
        left: FRAME_X, top: FRAME_TOP,
        opacity: frameEntry * alpha,
        transform: `translateY(${frameY}px)`,
        width: 1080,
        background: 'var(--aurora-panel-strong)',
        border: '1px solid var(--aurora-border-strong)',
        borderRadius: 'var(--radius-3)',
        boxShadow: 'var(--aurora-shadow-strong), var(--aurora-highlight-strong)',
        overflow: 'hidden',
      }}>
        {/* Frame header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px',
          background: 'var(--aurora-panel-medium)',
          borderBottom: '1px solid var(--aurora-border-default)',
        }}>
          <span style={{width:10, height:10, borderRadius:5, background:'#c78490'}} />
          <span style={{width:10, height:10, borderRadius:5, background:'#c6a36b'}} />
          <span style={{width:10, height:10, borderRadius:5, background:'#7dd3c7'}} />
          <span style={{
            marginLeft: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            color: 'var(--aurora-text-muted)',
          }}>labby · /marketplace</span>
        </div>

        {/* Tabs row */}
        <div style={{
          padding: '20px 24px 14px',
          display: 'flex', gap: 10, flexWrap: 'wrap',
          opacity: tabsEntry,
        }}>
          <MarketplaceTab label="Claude Code"  count="184"  active={false} accent="var(--aurora-accent-pink-strong)" />
          <MarketplaceTab label="Codex"        count="62"   active={false} accent="var(--aurora-warn)" />
          <MarketplaceTab label="MCP Registry" count="2.4k" active={true}  accent="var(--aurora-accent-strong)" />
          <MarketplaceTab label="ACP Registry" count="47"   active={false} accent="var(--aurora-success)" />
        </div>

        {/* Card grid */}
        <div style={{
          padding: '8px 24px 24px',
          display: 'grid',
          gridTemplateColumns: `repeat(2, ${CARD_W}px)`,
          gap: CARD_GAP,
        }}>
          {cards.map((c, i) => {
            const entry = animate({from:0,to:1,start:c.delay,end:c.delay+0.5,ease:Easing.easeOutBack})(t);
            const installed = t > c.delay + 1.7;
            return (
              <div key={i} style={{
                opacity: entry,
                transform: `translateY(${(1 - entry) * 12}px)`,
                width: CARD_W,
              }}>
                <MarketplaceCard
                  source={c.source}
                  name={c.name}
                  blurb={c.blurb}
                  target={c.target}
                  installed={installed}
                  style={{ width: '100%' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Install destinations — right column */}
      <div style={{
        position: 'absolute',
        left: 1280, top: 320,
        opacity: subOp,
      }}>
        <Eyebrow style={{ fontSize: 11 }}>INSTALL DESTINATIONS</Eyebrow>
      </div>
      {targets.map((tg, i) => {
        const targetEntry = animate({from:0,to:1,start:2.5 + i*0.22,end:3.0 + i*0.22,ease:Easing.easeOutBack})(t);
        return (
          <div key={tg.label} style={{
            position: 'absolute',
            left: 1280, top: TARGET_BASE_Y + i * TARGET_STRIDE,
            opacity: targetEntry * alpha,
            transform: `translateY(${(1 - targetEntry) * 14}px)`,
            width: 520,
          }}>
            <InstallTarget
              icon={<TargetIcon kind={['gateway','chat','devices'][i]} />}
              label={tg.label}
              sub={tg.sub}
              accent={tg.accent}
            />
          </div>
        );
      })}

      {/* Bezier connectors: each card → its install destination */}
      {cards.map((c, i) => {
        const startTime = c.delay + 1.0;
        const draw = animate({from:0,to:1,start:startTime,end:startTime+0.8,ease:Easing.easeOutCubic})(t);
        const src = cardCenter(i);
        const dst = { x: 1280, y: targetCenterY(c.targetIdx) };
        return (
          <Connector
            key={`mc-${i}`}
            from={src}
            to={dst}
            progress={draw}
            color={
              c.targetIdx === 0 ? 'var(--aurora-accent-strong)' :
              c.targetIdx === 1 ? 'var(--aurora-success)' :
                                  'var(--aurora-accent-pink-strong)'
            }
            glow
          />
        );
      })}
    </React.Fragment>
  );
}

// ── TargetIcon — tiny stroked glyph per install destination
function TargetIcon({ kind }) {
  if (kind === 'gateway') {
    return (
      <svg viewBox="0 0 36 36" fill="none" width="100%" height="100%">
        <circle cx="7"  cy="18" r="3.5" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="29" cy="18" r="3.5" stroke="currentColor" strokeWidth="1.75"/>
        <circle cx="18" cy="18" r="6"   stroke="currentColor" strokeWidth="1.75"/>
        <line x1="10.5" y1="18" x2="12" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        <line x1="24"   y1="18" x2="25.5" y2="18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
      </svg>
    );
  }
  if (kind === 'chat') {
    return (
      <svg viewBox="0 0 36 36" fill="none" width="100%" height="100%">
        <path d="M 6 9 H 30 V 24 H 16 L 10 30 V 24 H 6 Z"
              stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
        <circle cx="13" cy="16.5" r="1.4" fill="currentColor"/>
        <circle cx="18" cy="16.5" r="1.4" fill="currentColor"/>
        <circle cx="23" cy="16.5" r="1.4" fill="currentColor"/>
      </svg>
    );
  }
  // devices
  return (
    <svg viewBox="0 0 36 36" fill="none" width="100%" height="100%">
      <rect x="5"  y="9"  width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.75"/>
      <rect x="25" y="13" width="8"  height="14" rx="1.5" stroke="currentColor" strokeWidth="1.75"/>
      <line x1="9" y1="26" x2="19" y2="26" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
    </svg>
  );
}

// ── Tiny glyph for an AI client ────────────────────────────
function ClientGlyph({ name }) {
  // Abstract glyphs — three different geometric marks per agent.
  if (name === 'Claude') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="14" fill="none"
                stroke="var(--aurora-accent-strong)" strokeWidth="2"/>
        <path d="M 10 18 L 18 10 L 26 18 L 18 26 Z"
              fill="none" stroke="var(--aurora-accent-strong)" strokeWidth="2"/>
      </svg>
    );
  }
  if (name === 'Codex') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36">
        <rect x="6" y="6" width="24" height="24" rx="6"
              fill="none" stroke="var(--aurora-accent-strong)" strokeWidth="2"/>
        <path d="M 12 14 L 8 18 L 12 22 M 24 14 L 28 18 L 24 22"
              fill="none" stroke="var(--aurora-accent-strong)" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  // Gemini
  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <path d="M 18 4 C 18 12, 26 18, 32 18 C 26 18, 18 24, 18 32 C 18 24, 10 18, 4 18 C 10 18, 18 12, 18 4 Z"
            fill="none" stroke="var(--aurora-accent-strong)" strokeWidth="2"
            strokeLinejoin="round"/>
    </svg>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 5 — Outro
// ══════════════════════════════════════════════════════════
function SceneOutro() {
  const { localTime, duration } = useSprite();
  const t = localTime;

  const markEntry = animate({from:0,to:1,start:0.0,end:1.2,ease:Easing.easeOutBack})(t);
  const eyebrowOp = animate({from:0,to:1,start:1.0,end:1.8,ease:Easing.easeOutCubic})(t);
  const titleOp  = animate({from:0,to:1,start:1.4,end:2.4,ease:Easing.easeOutCubic})(t);
  const titleY   = animate({from:16,to:0,start:1.4,end:2.4,ease:Easing.easeOutCubic})(t);

  const facts = [
    { label: 'Rust-backed',     delay: 2.4 },
    { label: 'MCP-native',      delay: 2.7 },
    { label: 'Operator-first',  delay: 3.0 },
  ];

  const reposOpacity = animate({from:0,to:1,start:3.4,end:4.2,ease:Easing.easeOutCubic})(t);

  // Whole scene fades at very end
  const sceneExit = animate({from:0,to:1,start:duration-0.6,end:duration,ease:Easing.easeInQuad})(t);
  const sceneAlpha = 1 - sceneExit;

  return (
    <div style={{
      position:'absolute', inset: 0, opacity: sceneAlpha,
    }}>
      {/* Labby mark, scaled up center-top */}
      <div style={{
        position: 'absolute',
        left: 960, top: 320,
        transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * markEntry})`,
        opacity: markEntry,
      }}>
        <LabbyMark size={280} />
      </div>

      {/* Eyebrow */}
      <div style={{position:'absolute', left: 960, top: 530, transform:'translate(-50%, 0)', opacity: eyebrowOp}}>
        <Eyebrow style={{ fontSize: 13, color: 'var(--aurora-accent-strong)' }}>
          A RUST MCP HOMELAB
        </Eyebrow>
      </div>

      {/* Three facts as eyebrow-style pills */}
      <BigHeadline
        text="Premium. Dense. Calm."
        x={960} y={580} align="center" size={64}
        opacity={titleOp} ty={titleY}
      />

      <div style={{
        position: 'absolute',
        left: 960, top: 700,
        transform: 'translate(-50%, 0)',
        display: 'flex', gap: 14,
      }}>
        {facts.map((f, i) => {
          const op = animate({from:0,to:1,start:f.delay,end:f.delay+0.5,ease:Easing.easeOutBack})(t);
          const y = animate({from:14,to:0,start:f.delay,end:f.delay+0.5,ease:Easing.easeOutCubic})(t);
          return (
            <div key={f.label} style={{ opacity: op, transform: `translateY(${y}px)` }}>
              <Pill mono style={{ padding: '10px 18px', fontSize: 15 }}>
                {f.label}
              </Pill>
            </div>
          );
        })}
      </div>

      {/* Repo names roll */}
      <div style={{
        position: 'absolute', left: 960, top: 820,
        transform: 'translate(-50%, 0)',
        opacity: reposOpacity,
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
        gap: '10px 18px',
        maxWidth: 1200,
        fontFamily: 'var(--font-mono)',
        fontSize: 16,
        color: 'var(--aurora-text-muted)',
        lineHeight: 1.5,
      }}>
        {['lab','axon','syslog-mcp','rustarr','unrust','rustify','rustifi','rustcane','apprise-mcp','synapse2','rmcp-template'].map((n, i, arr) => (
          <React.Fragment key={n}>
            <span style={{ color: n === 'lab' ? 'var(--aurora-accent-strong)' : 'var(--aurora-text-muted)' }}>
              {n}
            </span>
            {i < arr.length - 1 && (
              <span style={{ color: 'var(--aurora-border-strong)' }}>·</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* GH handle */}
      <div style={{
        position: 'absolute',
        left: 960, top: 960,
        transform: 'translate(-50%, 0)',
        opacity: reposOpacity,
        fontFamily: 'var(--font-mono)', fontSize: 14,
        color: 'var(--aurora-text-muted)',
        letterSpacing: '0.04em',
      }}>
        github.com/jmagar
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 6 — Aurora design system
// 10 seconds. 128 shadcn components + Android Compose mirror.
// Shows a tile grid of representative components.
// ══════════════════════════════════════════════════════════
function SceneAurora() {
  const { localTime } = useSprite();
  const t = localTime;

  const exit = animate({from:0,to:1,start:8.8,end:9.7,ease:Easing.easeInQuad})(t);
  const alpha = 1 - exit;

  const eyebrowOp = animate({from:0,to:1,start:0.2,end:0.9,ease:Easing.easeOutCubic})(t) * alpha;
  const titleOp   = animate({from:0,to:1,start:0.4,end:1.4,ease:Easing.easeOutCubic})(t) * alpha;
  const titleY    = animate({from:14,to:0,start:0.4,end:1.4,ease:Easing.easeOutCubic})(t);
  const subOp     = animate({from:0,to:1,start:1.1,end:1.9,ease:Easing.easeOutCubic})(t) * alpha;
  const urlOp     = animate({from:0,to:1,start:1.5,end:2.3,ease:Easing.easeOutCubic})(t) * alpha;
  const footerOp  = animate({from:0,to:1,start:5.8,end:6.6,ease:Easing.easeOutCubic})(t) * alpha;

  // 8 tiles in a 4×2 grid
  const tiles = [
    { col: 0, row: 0, demo: 'buttons',  title: 'Button' },
    { col: 1, row: 0, demo: 'prompt',   title: 'Prompt Input' },
    { col: 2, row: 0, demo: 'terminal', title: 'Terminal' },
    { col: 3, row: 0, demo: 'stat',     title: 'Stat Card' },
    { col: 0, row: 1, demo: 'thinking', title: 'Thinking' },
    { col: 1, row: 1, demo: 'tool',     title: 'Tool Calls' },
    { col: 2, row: 1, demo: 'tree',     title: 'File Tree' },
    { col: 3, row: 1, demo: 'oauth',    title: 'OAuth' },
  ];

  const TILE_W = 410;
  const TILE_H = 270;
  const TILE_GAP = 18;
  const GRID_TOTAL_W = 4 * TILE_W + 3 * TILE_GAP;
  const GRID_X = (1920 - GRID_TOTAL_W) / 2;
  const GRID_Y = 400;

  return (
    <React.Fragment>
      {/* Eyebrow */}
      <div style={{position:'absolute', left: 960, top: 80, transform:'translate(-50%, 0)', opacity: eyebrowOp}}>
        <Eyebrow style={{ fontSize: 13, color: 'var(--aurora-accent-strong)' }}>
          AURORA · THE DESIGN SYSTEM
        </Eyebrow>
      </div>

      {/* Headline */}
      <BigHeadline
        text="And it all looks like this."
        x={960} y={130} align="center" size={62}
        opacity={titleOp} ty={titleY}
      />
      <Subhead
        text="128 shadcn components for agentic web apps. Jetpack Compose mirror for Android."
        x={960} y={220} align="center" opacity={subOp}
        width={1380}
        color="var(--aurora-text-muted)"
      />

      {/* Gallery URL pill */}
      <div style={{
        position: 'absolute',
        left: 960, top: 286,
        transform: 'translate(-50%, 0)',
        opacity: urlOp,
        display: 'inline-flex', alignItems: 'center', gap: 12,
        padding: '10px 22px',
        background: 'color-mix(in oklab, var(--aurora-accent-primary) 12%, var(--aurora-panel-strong))',
        border: '1px solid var(--aurora-accent-primary)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: `var(--aurora-shadow-medium), 0 0 ${14 + 10 * Math.sin(t*2)}px color-mix(in oklab, var(--aurora-accent-primary) ${28 + 12*Math.sin(t*2)}%, transparent)`,
      }}>
        <span style={{
          fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
          color: 'var(--aurora-text-muted)', letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>Browse the gallery</span>
        <span style={{
          color: 'var(--aurora-border-strong)',
        }}>→</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700,
          color: 'var(--aurora-accent-strong)', letterSpacing: '-0.005em',
        }}>aurora.tootie.tv</span>
      </div>

      {/* Tile grid */}
      {tiles.map((tile, i) => {
        const delay = 2.2 + i * 0.18;
        const entry = animate({from:0,to:1,start:delay,end:delay+0.5,ease:Easing.easeOutBack})(t);
        const x = GRID_X + tile.col * (TILE_W + TILE_GAP);
        const y = GRID_Y + tile.row * (TILE_H + TILE_GAP);
        return (
          <div key={tile.demo} style={{
            position: 'absolute',
            left: x, top: y,
            width: TILE_W, height: TILE_H,
            opacity: entry * alpha,
            transform: `translateY(${(1-entry)*16}px) scale(${0.96 + 0.04*entry})`,
          }}>
            <AuroraDemoTile title={tile.title}>
              <AuroraDemoContent kind={tile.demo} t={t - delay} />
            </AuroraDemoTile>
          </div>
        );
      })}

      {/* Footer strip */}
      <div style={{
        position: 'absolute',
        left: 960, bottom: 56,
        transform: 'translate(-50%, 0)',
        opacity: footerOp,
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--aurora-text-muted)',
        letterSpacing: '0.04em',
        display: 'flex', gap: 16, alignItems: 'center',
      }}>
        <span>shadcn registry</span>
        <span style={{color: 'var(--aurora-border-strong)'}}>·</span>
        <span>jetpack compose mirror</span>
        <span style={{color: 'var(--aurora-border-strong)'}}>·</span>
        <span style={{color:'var(--aurora-accent-strong)'}}>npx shadcn add @aurora/aurora-button</span>
      </div>
    </React.Fragment>
  );
}

// ── AuroraDemoTile — outer card with header + body ────────
function AuroraDemoTile({ title, children }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'var(--aurora-panel-medium)',
      border: '1px solid var(--aurora-border-default)',
      borderRadius: 'var(--radius-2)',
      boxShadow: 'var(--aurora-shadow-medium), var(--aurora-highlight-medium)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--aurora-border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 13,
          color: 'var(--aurora-text-primary)',
          letterSpacing: '-0.01em',
        }}>{title}</span>
        <Dot size={6} color="var(--aurora-success)" />
      </div>
      <div style={{
        flex: 1, padding: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

// ── AuroraDemoContent — content for one tile ──────────────
function AuroraDemoContent({ kind, t }) {
  if (kind === 'buttons') {
    return (
      <div style={{display:'flex', gap:10, flexDirection:'column', alignItems:'flex-start', width:'100%'}}>
        <div style={{
          padding:'10px 16px', borderRadius:'var(--radius-1)',
          background:'var(--aurora-accent-primary)',
          color:'#072532', fontWeight:700, fontSize:14,
          fontFamily:'var(--font-sans)',
          boxShadow: '0 0 0 1px color-mix(in oklab, var(--aurora-accent-primary) 30%, transparent), 0 0 18px color-mix(in oklab, var(--aurora-accent-primary) 26%, transparent)',
        }}>Primary action</div>
        <div style={{
          padding:'10px 16px', borderRadius:'var(--radius-1)',
          background:'color-mix(in oklab, var(--aurora-accent-pink-strong) 14%, transparent)',
          border:'1px solid var(--aurora-accent-pink-strong)',
          color:'var(--aurora-accent-pink-strong)', fontWeight:600, fontSize:14,
          fontFamily:'var(--font-sans)',
        }}>Secondary</div>
        <div style={{
          padding:'10px 16px', borderRadius:'var(--radius-1)',
          border:'1px solid var(--aurora-border-strong)',
          color:'var(--aurora-text-muted)', fontWeight:600, fontSize:14,
          fontFamily:'var(--font-sans)',
        }}>Ghost</div>
      </div>
    );
  }
  if (kind === 'prompt') {
    return (
      <div style={{
        width:'100%', height: '100%',
        background:'var(--aurora-control-surface)',
        border:'1px solid var(--aurora-border-strong)',
        borderRadius:'var(--radius-2)',
        padding:'12px 14px',
        display:'flex', flexDirection:'column', justifyContent:'space-between',
      }}>
        <div style={{
          fontFamily:'var(--font-sans)', fontSize:13,
          color:'var(--aurora-text-muted)',
          lineHeight: 1.5,
        }}>
          Why are my media downloads
          <br/>failing tonight?
          <span className="caret" style={{
            display:'inline-block', width:1.5, height:14,
            background:'var(--aurora-accent-strong)',
            verticalAlign:'middle', marginLeft:2,
          }}/>
        </div>
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          fontSize:11, fontFamily:'var(--font-mono)',
          paddingTop: 8, borderTop: '1px solid var(--aurora-border-default)',
        }}>
          <span style={{color:'var(--aurora-text-muted)'}}>+ attach · @ tool</span>
          <span style={{
            padding: '4px 10px', borderRadius: 'var(--radius-pill)',
            background: 'var(--aurora-accent-pink-strong)',
            color: '#2c0e1a', fontWeight: 700,
          }}>send ↵</span>
        </div>
      </div>
    );
  }
  if (kind === 'terminal') {
    return (
      <div style={{
        width:'100%', height:'100%',
        background:'#08161f',
        border:'1px solid var(--aurora-border-strong)',
        borderRadius:'var(--radius-1)',
        padding:'12px 14px',
        fontFamily:'var(--font-mono)', fontSize:12,
        lineHeight:1.6,
      }}>
        <div><span style={{color:'var(--aurora-text-muted)'}}>$</span> <span style={{color:'var(--aurora-accent-strong)'}}>labby gateway list</span></div>
        <div style={{color:'var(--aurora-text-muted)'}}>NAME         STATUS</div>
        <div style={{color:'var(--aurora-text-primary)'}}>syslog-mcp   <span style={{color:'var(--aurora-success)'}}>healthy</span></div>
        <div style={{color:'var(--aurora-text-primary)'}}>unrust       <span style={{color:'var(--aurora-success)'}}>healthy</span></div>
        <div style={{color:'var(--aurora-text-primary)'}}>rustarr      <span style={{color:'var(--aurora-warn)'}}>degraded</span></div>
        <div style={{display:'flex', alignItems:'center', marginTop: 4}}>
          <span style={{color:'var(--aurora-text-muted)'}}>$ </span>
          <span className="caret" style={{
            display:'inline-block', width:8, height:14,
            background:'var(--aurora-accent-strong)',
            marginLeft:4,
          }}/>
        </div>
      </div>
    );
  }
  if (kind === 'stat') {
    const points = "0,30 20,24 40,28 60,18 80,14 100,18 120,8 140,12 160,4";
    return (
      <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', alignItems:'flex-start'}}>
        <div>
          <div style={{
            fontFamily:'var(--font-display)', fontWeight:800, fontSize:44,
            letterSpacing:'-0.04em', color:'var(--aurora-text-primary)',
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}>2,847</div>
          <div style={{
            display:'flex', alignItems:'center', gap: 6, marginTop: 6,
            fontFamily:'var(--font-sans)', fontSize:11, fontWeight:700,
            color:'var(--aurora-text-muted)', letterSpacing:'0.12em',
            textTransform:'uppercase',
          }}>
            <span>events / min</span>
            <span style={{color:'var(--aurora-success)'}}>↑ 12%</span>
          </div>
        </div>
        <svg width="100%" height="44" viewBox="0 0 160 40" preserveAspectRatio="none" style={{marginTop: 8}}>
          <polyline points={`${points} 160,40 0,40`}
            fill="color-mix(in oklab, var(--aurora-accent-primary) 22%, transparent)"
            stroke="none"/>
          <polyline points={points} stroke="var(--aurora-accent-strong)"
            strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
        </svg>
      </div>
    );
  }
  if (kind === 'thinking') {
    return (
      <div style={{width:'100%', display:'flex', flexDirection:'column', gap:10}}>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          fontFamily:'var(--font-mono)', fontSize:11, fontWeight:700,
          color:'var(--aurora-accent-pink-strong)',
          letterSpacing:'0.08em', textTransform:'uppercase',
        }}>
          <span style={{
            width:8, height:8, borderRadius:4,
            background:'var(--aurora-accent-pink-strong)',
            boxShadow:'0 0 8px var(--aurora-accent-pink-strong)',
          }}/>
          thinking…
        </div>
        {[1, 0.85, 0.62, 0.92].map((w, i) => (
          <div key={i} style={{
            height: 10,
            width: `${w * 100}%`,
            borderRadius:'var(--radius-pill)',
            background: 'linear-gradient(90deg, var(--aurora-control-surface) 0%, color-mix(in oklab, var(--aurora-accent-primary) 32%, var(--aurora-control-surface)) 50%, var(--aurora-control-surface) 100%)',
            backgroundSize: '200% 100%',
            animation: `shimmer 1.6s ${i * 0.18}s infinite linear`,
          }}/>
        ))}
      </div>
    );
  }
  if (kind === 'tool') {
    return (
      <div style={{width:'100%', display:'flex', flexDirection:'column', gap:8}}>
        <div style={{display:'flex', alignItems:'center', gap:8}}>
          <div style={{
            padding:'3px 9px', borderRadius:'var(--radius-pill)',
            background:'color-mix(in oklab, var(--aurora-accent-pink-strong) 14%, transparent)',
            border:'1px solid var(--aurora-accent-pink-strong)',
            fontFamily:'var(--font-sans)', fontSize:9, fontWeight:800,
            color:'var(--aurora-accent-pink-strong)',
            letterSpacing:'0.12em',
          }}>TOOL</div>
          <span style={{
            fontFamily:'var(--font-mono)', fontSize:13,
            color:'var(--aurora-text-primary)', fontWeight:700,
          }}>syslog.search</span>
          <span style={{
            marginLeft:'auto',
            fontFamily:'var(--font-mono)', fontSize:11,
            color:'var(--aurora-success)',
          }}>42 hits</span>
        </div>
        <pre style={{
          margin: 0,
          padding:'10px 12px',
          background:'var(--aurora-control-surface)',
          border:'1px solid var(--aurora-border-default)',
          borderRadius:'var(--radius-1)',
          fontFamily:'var(--font-mono)', fontSize:11,
          color:'var(--aurora-text-muted)',
          lineHeight:1.5,
          whiteSpace:'pre',
          overflow: 'hidden',
        }}>{`{
  "query": "kernel panic",
  "from": "-15m",
  "limit": 100
}`}</pre>
      </div>
    );
  }
  if (kind === 'tree') {
    const lines = [
      { d: 0, name: 'lab',           icon: '▼', folder: true,  hl: true },
      { d: 1, name: 'crates',        icon: '▼', folder: true },
      { d: 2, name: 'lab',           icon: '▼', folder: true,  hl: true },
      { d: 3, name: 'main.rs',       icon: '', folder: false },
      { d: 3, name: 'app.rs',        icon: '', folder: false, hl: true },
      { d: 2, name: 'lab-apis',      icon: '▶', folder: true },
      { d: 1, name: 'docs',          icon: '▶', folder: true },
      { d: 1, name: 'Cargo.toml',    icon: '', folder: false },
    ];
    return (
      <div style={{
        width:'100%', height: '100%',
        fontFamily:'var(--font-mono)', fontSize:12,
        lineHeight:1.7,
        overflow: 'hidden',
      }}>
        {lines.map((l, i) => (
          <div key={i} style={{
            display:'flex', alignItems:'center', gap:6,
            paddingLeft: l.d * 14,
            color: l.hl ? 'var(--aurora-accent-strong)' : (l.folder ? 'var(--aurora-text-primary)' : 'var(--aurora-text-muted)'),
            fontWeight: l.folder ? 700 : 500,
            background: l.hl ? 'color-mix(in oklab, var(--aurora-accent-primary) 12%, transparent)' : 'transparent',
            borderRadius: 4,
            padding: '0 6px',
          }}>
            <span style={{
              width: 10,
              color: 'var(--aurora-text-muted)',
              fontSize: 9,
            }}>{l.icon}</span>
            <span>{l.folder ? '📁' : '📄'}</span>
            <span>{l.name}</span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'oauth') {
    return (
      <div style={{width:'100%', display:'flex', flexDirection:'column', gap:10}}>
        <div style={{
          padding:'12px 14px',
          background:'var(--aurora-panel-strong)',
          border:'1px solid var(--aurora-border-strong)',
          borderRadius:'var(--radius-1)',
          display:'flex', alignItems:'center', gap:12,
          fontFamily:'var(--font-sans)', fontSize:13, fontWeight:700,
          color:'var(--aurora-text-primary)',
        }}>
          <div style={{
            width:18, height:18, borderRadius:9,
            background: 'conic-gradient(from 0deg, #ea4335, #fbbc05, #34a853, #4285f4, #ea4335)',
            flexShrink: 0,
          }}/>
          Continue with Google
        </div>
        <div style={{
          padding:'10px 14px',
          background:'var(--aurora-control-surface)',
          border:'1px solid var(--aurora-border-default)',
          borderRadius:'var(--radius-1)',
          display:'flex', alignItems:'center', gap:10,
          fontFamily:'var(--font-mono)', fontSize:12,
          color:'var(--aurora-text-muted)',
        }}>
          <span style={{
            width:14, height:14, borderRadius:7,
            border:'1.5px solid var(--aurora-text-muted)',
            flexShrink:0,
          }}/>
          Bearer token
        </div>
        <div style={{
          display:'flex', justifyContent:'center', gap:8,
          fontFamily:'var(--font-mono)', fontSize:9, fontWeight:700,
          color:'var(--aurora-text-muted)',
          letterSpacing:'0.16em', textTransform:'uppercase',
          marginTop: 4,
        }}>
          RS256 · JWKS · PKCE
        </div>
      </div>
    );
  }
  return null;
}

Object.assign(window, { VideoScenes });
