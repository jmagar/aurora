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

The Android client encrypts its secrets **at rest** (`app/data/AppSettings.kt`).
The secret values — the bearer auth token, the API key, the ChatGPT access
token, and the ChatGPT account id — are encrypted with **AES-256/GCM** using a
key held in the **AndroidKeyStore**. That key is non-exportable (it never leaves
secure hardware), and only the resulting ciphertext (`Base64(IV ‖ ciphertext +
GCM tag)`) is written to the plaintext DataStore file. A failed encrypt refuses
to persist the credential (the setter throws rather than silently storing
plaintext).

Residual limitations, stated plainly:

- The KeyStore key is **not bound to user authentication** —
  `setUserAuthenticationRequired` is not set, so decryption does not require a
  device unlock / biometric and the key is usable whenever the app process can
  reach the KeyStore.
- Decryption is **intentionally lenient**: any value that is not valid
  ciphertext for the current key (legacy plaintext, a corrupted entry, or a
  value encrypted under a since-invalidated key) decodes to `null` and is
  treated as "no value" rather than raising an error. This keeps first-run,
  migration, and key-reset graceful, but means a tampered or unreadable entry
  fails open to "absent" instead of failing loudly.
- The encryption path is currently **not covered by automated tests** (no
  Robolectric/instrumentation harness exercises the AndroidKeyStore) — a known,
  accepted gap.

## Codex WebSocket

The Codex tooling connects over a WebSocket. The default server URL is the
cleartext, emulator-local `ws://10.0.2.2:4500` (`10.0.2.2` is the Android
emulator alias for the host machine's loopback). Cleartext is permitted **only
for local/dev hosts**, scoped via `network_security_config.xml`.

Remote hosts are **not** auto-upgraded to TLS: for a remote connection the user
must enter a `wss://` URL themselves. There is **no enforcement in code** that
rejects a cleartext `ws://` URL pointing at a remote host, so the burden of
choosing `wss://` for non-local destinations is on the user.

There is also currently **no certificate pinning** on that connection — this is
a known limitation.

## Reporting

For anything sensitive, do not file public issues with exploit details. Contact
the maintainer directly.
