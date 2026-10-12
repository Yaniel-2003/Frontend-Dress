---
target: src/auth/login.jsx
total_score: 19
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:/home/yaniel-2003/projects/Dress-Shoppy/Frontend-Dress/src/auth/login.jsx"
target_fingerprint: "sha256:d2595db555c9908e7d7c7bee4d4b9c057d92998c60f84e7297c9ae4eb122be0c"
target_path: /home/yaniel-2003/projects/Dress-Shoppy/Frontend-Dress/src/auth/login.jsx
timestamp: 2026-10-11T23-22-55Z
slug: src-auth-login-jsx
closed: true
---
Method: dual-agent (A: design review · B: detector). Browser evidence unavailable (no Chrome in WSL).

## Design Health Score: 19/40 (Poor)
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 1 | No loading state on submit; result shown in 1s modal |
| 2 | Match System / Real World | 2 | Error says "Usuario" but field is "Correo"; "Bienvenido al sistema" |
| 3 | User Control and Freedom | 2 | Undismissable modal; catalog locked behind login |
| 4 | Consistency and Standards | 2 | h1 text-3xl bold, shadow-xl/2xl, glass card off-system |
| 5 | Error Prevention | 2 | No autocomplete; double submit possible |
| 6 | Recognition Rather Than Recall | 3 | Persistent labels, show-password, forgot link |
| 7 | Flexibility and Efficiency | 2 | No autofill hints for password managers |
| 8 | Aesthetic and Minimalist Design | 2 | Decorative noise: blobs, grids, floating cards, ticker |
| 9 | Error Recovery | 1 | 1s overlay error, no inline message, network errors shown as bad credentials |
| 10 | Help and Documentation | 2 | Only forgot-password |

## Design Specificity
Category-interchangeable SaaS auth template. "-50%" largest type on brand panel contradicts boutique positioning. Detector: 0 findings across login.jsx, AuthLayout, CamposConIcono, ModalMensajes.

## Priority Issues
- [P0] Error state unreadable (1s modal) and misreports network failures — login.jsx:56-63, ModalMensajes.jsx. Fix: inline persistent role=alert error, aria-invalid, distinguish network vs credentials. /impeccable harden
- [P1] No loading/submitting state, double submit — login.jsx:37-65,125. Fix: enviando state, disabled, "Iniciando sesión…". /impeccable polish
- [P1] Brand panel contradicts boutique positioning — AuthLayout.jsx:16-17,36-111. Fix: drop blobs/grids/glass cards/ticker/-50%, editorial composition, curation copy. /impeccable quieter
- [P2] Missing autoComplete; html lang="en" — login.jsx:79-114, index.html:2. /impeccable harden
- [P2] Tap targets < 44px: eye toggle 32px, forgot link with -mt-2, register inline link. /impeccable adapt

## Persona Red Flags
- Casey: no feedback on tap; error flashes while glancing away; 32px eye next to forgot link.
- Jordan: login wall before any garment; "Bienvenido de vuelta" assumes account; register CTA outside card, muted.
- Sam: lang=en; aside h2 + ticker before main h1 on desktop; error live region unreliable.

## Minor
Spinner ring around static check reads as "still processing"; success timeout not cleared on unmount; design-system.md ring color contradicts token.
