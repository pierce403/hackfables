# Static publishing

## Native Cloudflare website publishing

The canonical public build keeps its existing validation and Pages recovery.
Only after that artifact is validated (and releases published where required),
a repository-only CI token mirrors its public bytes into codex/cloudflare-static.
Cloudflare native Git builds publish main from /cloudflare after waiting for the exact canonical source artifact; credentials
stay in Cloudflare and previews are off. Source main and generated publication
commits are separate identities. A stale-main check and non-forced branch update
prevent older CI output from replacing newer source. No runtime, benchmark,
firmware, APK, or signing behavior is changed by this hosting-only migration.
Usage uses zone request metrics with no browser analytics.

The legacy .antora-ui gitlink has no .gitmodules entry. Both full and sparse
second checkouts fail during credential cleanup. The mirror job instead reads
only its reviewed publishing files through the authenticated GitHub API at
the exact source SHA; no Git checkout credentials are persisted. It passes that
SHA explicitly and the publisher verifies it remains current main before writing.
The original Antora/UI build remains unchanged.

Native production remains on main. The bounded build-time artifact wait requires
a matching source revision (or the canonical FrogAlert metadata-child receipt),
then verifies all public hashes. Missing/failed canonical output stops deployment
and retains the working version. The generated branch distributes public build
input only. No GitHub lookup is added to the deployed website.
