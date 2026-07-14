export type ServerCategory =
  | "Platform"
  | "Observability"
  | "Notifications"
  | "Network"
  | "Infrastructure"
  | "Media";

export type ServerEntry = {
  id: string;
  name: string;
  shortName: string;
  mcpName: `ai.dinglebear/${string}`;
  packageName: string;
  version: string;
  binary: string;
  repo: `jmagar/${string}`;
  category: ServerCategory;
  tool: string;
  description: string;
  capabilities: string[];
  env: string[];
  highlight: string;
};

export const servers: ServerEntry[] = [
  {
    id: "labby",
    name: "Labby",
    shortName: "labby",
    mcpName: "ai.dinglebear/labby",
    packageName: "labby-mcp",
    version: "1.2.0",
    binary: "labby",
    repo: "jmagar/labby",
    category: "Platform",
    tool: "labby",
    description:
      "Rust homelab control plane and MCP gateway for catalog, Code Mode, route-scoped resources, HTTP API, TUI, and web UI workflows.",
    capabilities: ["MCP gateway", "Code Mode", "HTTP API", "web UI"],
    env: ["LABBY_MCP_HTTP_TOKEN", "LABBY_AUTH_MODE"],
    highlight: "Gateway and operator console",
  },
  {
    id: "soma",
    name: "Soma",
    shortName: "soma",
    mcpName: "ai.dinglebear/soma-rmcp",
    packageName: "soma-rmcp",
    version: "0.4.7",
    binary: "soma",
    repo: "jmagar/soma",
    category: "Platform",
    tool: "soma",
    description:
      "Batteries-included RMCP runtime and scaffold for provider-backed Rust MCP servers, OpenAPI ingestion, and local automation providers.",
    capabilities: ["provider runtime", "scaffold", "OpenAPI", "plugins"],
    env: ["SOMA_HOME", "SOMA_PROVIDER_PATH"],
    highlight: "Provider runtime",
  },
  {
    id: "cortex",
    name: "Cortex",
    shortName: "cortex",
    mcpName: "ai.dinglebear/cortex-rmcp",
    packageName: "cortex-rmcp",
    version: "3.9.1",
    binary: "cortex",
    repo: "jmagar/cortex",
    category: "Observability",
    tool: "cortex",
    description:
      "Syslog, Docker, OTLP, and AI transcript correlation surface for finding operational context from homelab logs.",
    capabilities: ["syslog", "Docker logs", "OTLP", "FTS search"],
    env: ["CORTEX_DATABASE_URL", "CORTEX_SYSLOG_ADDR"],
    highlight: "Log and transcript search",
  },
  {
    id: "apprise",
    name: "Apprise",
    shortName: "apprise",
    mcpName: "ai.dinglebear/apprise-rmcp",
    packageName: "apprise-rmcp",
    version: "0.1.3",
    binary: "rapprise",
    repo: "jmagar/apprise-rmcp",
    category: "Notifications",
    tool: "apprise",
    description:
      "Multi-backend notification MCP server for Apprise, giving agents a single route to dozens of push, chat, and webhook destinations.",
    capabilities: ["notify", "webhooks", "80+ backends", "templates"],
    env: ["APPRISE_URL", "APPRISE_CONFIG"],
    highlight: "Notification fan-out",
  },
  {
    id: "gotify",
    name: "Gotify",
    shortName: "gotify",
    mcpName: "ai.dinglebear/gotify-rmcp",
    packageName: "gotify-rmcp",
    version: "0.1.3",
    binary: "rgotify",
    repo: "jmagar/gotify-rmcp",
    category: "Notifications",
    tool: "gotify",
    description:
      "Push notification MCP server and CLI for Gotify message delivery, app management, and local automation alerts.",
    capabilities: ["messages", "apps", "priorities", "alerts"],
    env: ["GOTIFY_URL", "GOTIFY_TOKEN"],
    highlight: "Direct push alerts",
  },
  {
    id: "unifi",
    name: "UniFi",
    shortName: "unifi",
    mcpName: "ai.dinglebear/unifi-rmcp",
    packageName: "unifi-rmcp",
    version: "0.2.4",
    binary: "runifi",
    repo: "jmagar/unifi-rmcp",
    category: "Network",
    tool: "unifi",
    description:
      "UniFi Network controller MCP server with read-oriented convenience actions, generated API actions, scopes, and local health checks.",
    capabilities: ["clients", "devices", "WiFi", "controller health"],
    env: ["UNIFI_URL", "UNIFI_API_KEY", "UNIFI_SITE"],
    highlight: "Network controller access",
  },
  {
    id: "tailscale",
    name: "Tailscale",
    shortName: "tailscale",
    mcpName: "ai.dinglebear/tailscale-rmcp",
    packageName: "tailscale-rmcp",
    version: "0.1.3",
    binary: "rtailscale",
    repo: "jmagar/tailscale-rmcp",
    category: "Network",
    tool: "tailscale",
    description:
      "Tailnet operations MCP server and CLI for device inventory, network posture, DNS, keys, and automation around Tailscale.",
    capabilities: ["devices", "tailnet", "DNS", "keys"],
    env: ["TAILSCALE_API_KEY", "TAILSCALE_TAILNET"],
    highlight: "Tailnet inventory",
  },
  {
    id: "unraid",
    name: "Unraid",
    shortName: "unraid",
    mcpName: "ai.dinglebear/unraid-rmcp",
    packageName: "unraid-rmcp",
    version: "0.2.3",
    binary: "runraid",
    repo: "jmagar/unraid-rmcp",
    category: "Infrastructure",
    tool: "unraid",
    description:
      "NAS, storage, Docker, and VM workflows for Unraid through a Rust MCP server with matching CLI and health tooling.",
    capabilities: ["NAS", "storage", "Docker", "VMs"],
    env: ["UNRAID_URL", "UNRAID_API_KEY"],
    highlight: "NAS and VM control",
  },
  {
    id: "arcane",
    name: "Arcane",
    shortName: "arcane",
    mcpName: "ai.dinglebear/arcane-rmcp",
    packageName: "arcane-rmcp",
    version: "0.4.2",
    binary: "rarcane",
    repo: "jmagar/arcane-rmcp",
    category: "Infrastructure",
    tool: "arcane",
    description:
      "Docker and container management MCP server for Arcane-style host operations, container inspection, and controlled mutations.",
    capabilities: ["containers", "images", "Docker", "host ops"],
    env: ["ARCANE_URL", "ARCANE_TOKEN"],
    highlight: "Container operations",
  },
  {
    id: "synapse",
    name: "Synapse",
    shortName: "synapse",
    mcpName: "ai.dinglebear/synapse-rmcp",
    packageName: "synapse-rmcp",
    version: "0.5.4",
    binary: "synapse",
    repo: "jmagar/synapse-rmcp",
    category: "Infrastructure",
    tool: "synapse",
    description:
      "Host workflow MCP server and CLI for Docker, SSH, files, logs, ZFS, and local operational automation.",
    capabilities: ["Docker", "SSH", "files", "ZFS"],
    env: ["SYNAPSE_CONFIG", "SYNAPSE_HOME"],
    highlight: "Host workflow automation",
  },
  {
    id: "yarr",
    name: "Yarr",
    shortName: "yarr",
    mcpName: "ai.dinglebear/yarr-mcp",
    packageName: "yarr-mcp",
    version: "1.1.1",
    binary: "yarr",
    repo: "jmagar/yarr",
    category: "Media",
    tool: "yarr",
    description:
      "Self-hosted media automation fleet surface for Sonarr, Radarr, Prowlarr, Plex, Jellyfin, Tautulli, downloaders, and request apps.",
    capabilities: ["Sonarr", "Radarr", "Plex", "downloaders"],
    env: ["YARR_SERVICES", "YARR_SONARR_URL", "YARR_SONARR_API_KEY"],
    highlight: "Media fleet automation",
  },
  {
    id: "ytdl",
    name: "YTDL",
    shortName: "ytdl",
    mcpName: "ai.dinglebear/ytdl-rmcp",
    packageName: "ytdl-rmcp",
    version: "1.0.2",
    binary: "rytdl",
    repo: "jmagar/ytdl-rmcp",
    category: "Media",
    tool: "ytdl",
    description:
      "yt-dlp media workflow MCP server for download jobs, metadata, ffmpeg handoff, remote paths, and media-library automation.",
    capabilities: ["yt-dlp", "metadata", "ffmpeg", "rclone"],
    env: ["YTDL_OUTPUT_DIR", "YTDL_REMOTE"],
    highlight: "Download and metadata jobs",
  },
];

export const categories: ("All" | ServerCategory)[] = [
  "All",
  "Platform",
  "Observability",
  "Notifications",
  "Network",
  "Infrastructure",
  "Media",
];

export const npmUrl = (packageName: string) =>
  `https://www.npmjs.com/package/${packageName}`;

export const githubUrl = (repo: ServerEntry["repo"]) =>
  `https://github.com/${repo}`;

export const mcpClientArgs = (server: ServerEntry) =>
  `["-y", "${server.packageName}", "mcp"]`;
