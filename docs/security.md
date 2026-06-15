# Security Posture

This document describes the known security characteristics and limitations of
the Aurora Design System across its surfaces (web registry site, Android client,
and the Codex tooling). It is intentionally factual and concise. No secret
values are recorded here.

## Web app / registry site

The Aurora site is a **static shadcn-compatible registry and gallery**. It
serves component JSON payloads and documentation. There is **no server-side
authentication and no user data** — it stores no credentials, sessions, or
personally identifiable information. The same applies to the co-hosted
registry/marketplace pages.

### HTTP security headers

The Next.js app (`next.config.ts`) sets a baseline of security headers on **all
routes** (`source: "/(.*)"`):

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` |
| `Content-Security-Policy` | see below |

The Content-Security-Policy is:

```
default-src 'self';
img-src 'self' data: https:;
style-src 'self' 'unsafe-inline';
font-src 'self' data:;
script-src 'self' 'unsafe-inline';
connect-src 'self';
frame-ancestors 'self';
base-uri 'self';
object-src 'none'
```

**Known relaxations / future work:**

- `style-src 'unsafe-inline'` is required because Aurora uses inline
  `style={}` attributes extensively across components.
- `script-src 'unsafe-inline'` is a deliberate relaxation: Next.js injects
  inline bootstrap/hydration scripts, and a strict policy without
  `'unsafe-inline'` (or a per-request nonce) breaks hydration. Tightening this
  to a **nonce-based CSP** is tracked as future work and was out of scope for
  the baseline-headers pass.

The existing root-route `Vary: Accept, User-Agent` header (used by the shadcn
content-negotiation rewrite) is preserved alongside these headers.

## Android client

The Android client stores secrets using **Keystore-encrypted storage**. This
storage path is **being hardened**; treat the current implementation as a known
area of active improvement rather than a final guarantee.

## Codex WebSocket

The Codex tooling connects over a WebSocket. For **remote hosts the connection
should use `wss://`** (TLS). There is currently **no certificate pinning** on
that connection — this is a known limitation.

## Reporting

For anything sensitive, do not file public issues with exploit details. Contact
the maintainer directly.
