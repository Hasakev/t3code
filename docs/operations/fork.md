# Fork releases

This fork carries its own changes on `main` on top of `pingdotgg/t3code` and ships a
Windows x64 desktop build. The build installs over the official app (same app id, same
`~/.t3` data) and then updates itself from this repository's GitHub Releases.

## How it works

`.github/workflows/fork-release.yml` runs daily, on every push to `main` and on demand. It:

1. Merges upstream `main` into `main`. If the merge conflicts, it opens or updates an
   "Upstream merge conflict" issue and stops.
2. Disables every other workflow except `release-desktop.yml`, which it calls. Upstream's
   workflows need maintainer runners and secrets.
3. Typechecks, tests, and builds through upstream's `release-desktop.yml`, then publishes
   `vX.Y.Z` with `latest.yml`. The desktop updater reads that file.

The updater only offers a version greater than the installed one, so fork versions encode
the upstream version: upstream `0.0.45` ships as `0.0.45001`, `0.0.45002`, …, and upstream
`0.0.46` starts at `0.0.46001` (`scripts/fork-version.ts`).

## One-time setup

- Keep the repository public. `release-desktop.yml` checks out without credentials.
- Add the repository secret `FORK_SYNC_TOKEN`: a fine-grained PAT for this repository with
  Contents and Workflows read/write. The default token cannot push upstream's changes to
  `.github/workflows`.
- Before the first push, disable the upstream workflows so they don't sit queued waiting for
  runners that never come:
  `gh workflow list --json id,path --jq '.[] | select(.path != ".github/workflows/fork-release.yml" and .path != ".github/workflows/release-desktop.yml") | .id' | xargs -n1 gh workflow disable`
- Optional, for T3 Connect: repository variables `CLERK_PUBLISHABLE_KEY`, `CLERK_JWT_TEMPLATE`,
  `CLERK_CLI_OAUTH_CLIENT_ID` and `RELAY_URL`. Without them, Connect is hidden. Local and
  Tailscale connections still work.
- Install the first release by hand over the official app. If it was on the nightly update
  channel, switch to stable in Settings. The fork only publishes `latest.yml`.

## Day to day

- Commit extensions to `main`. Prefer new files over edits to upstream files so merges stay clean.
- To merge upstream locally (Linux or Windows): `node scripts/fork-sync.ts`. Resolve any
  conflicts, commit, and push. The push triggers a release.
- Builds are unsigned, so Windows SmartScreen warns on the first manual install. Updates
  install without prompting.
