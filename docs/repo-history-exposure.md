# Sensitive screenshots: repository and production exposure

Checked 30 Oct 2026. No history has been rewritten, nothing force-pushed, and
no branches deleted.

## What is exposed today

15 screenshot originals show, or may show, third parties' names, addresses,
phone numbers, trapper codes or a veterinarian ID. The list is in
`src/__tests__/content.test.js` (`UNSANITIZED`).

| Location | Exposed? | Notes |
|---|---|---|
| `scs-2.0` tip | **No** | Removed in `f5937c2`; sanitized copies are used, and tests enforce it |
| `main` tip (default branch on GitHub) | **Yes** | All 15 files are in the current tree, browsable by anyone, because the repository is **public** |
| `spike/prerender` tip | **Yes** | Branched from `scs-2.0` before the removal |
| Git history (all branches) | **Yes** | Added in `2e465c4` (2 Oct 2025) and `4893c86` (22 Oct 2025). Reachable from every branch |
| **Production website** | **Yes** | Built from `main@f154762`, so it serves the unsanitized images on the Projects and Home pages |
| Forks, PRs, tags | None | 0 forks, no pull requests, no tags |

Byte-identical copies of the 15 originals are kept outside the repository at
`D:\Solid Code Solutions LLC\Website\scs-private-assets\originals\`. Move them
to private storage you control (for example, an encrypted cloud folder) if you
need to keep them. Nothing needs them to build the site.

## Options

| Option | What it fixes | Trade-offs | Needs your approval |
|---|---|---|---|
| **A. Make the repository private** (GitHub → Settings → General → Danger Zone → Change visibility) | Hides every branch and all history immediately. Reversible | The code is no longer publicly visible as a portfolio piece. Deployment is unaffected (manual uploads) | You do it (one minute) |
| **B. Delete `spike/prerender`** | Removes one exposed branch tip | The spike's useful source changes are documented in `docs/prerender-spike.md` and will be re-applied cleanly in Phase 3 | Yes (branch deletion) |
| **C. Production hotfix** | Stops the live site serving the originals | A small deploy: `main@f154762` plus only the sanitized images and data references, built and uploaded after a backup. It touches `main` and production | Yes (production + `main`) |
| **D. Rewrite history** (`git filter-repo --invert-paths` for the 15 paths on every branch, then force-push) | Removes the files from history on GitHub | Every commit hash changes (`scs-2.0` included), and existing clones must re-clone. GitHub can still serve cached views of old commits until you ask GitHub Support to purge them. Anyone who already cloned keeps the files | Yes (force-push) |
| **E. Do nothing more** | — | The files stay public on `main` and in history until the next release lands on `main` (history remains) | — |

## Recommendation

1. **Now:** make the repository private (A). This is the fastest, reversible
   way to stop public access to every branch and to history, with no
   rewriting.
2. **Approve deleting `spike/prerender`** (B).
3. **Decide on the live site.**
   - **Hotfix now (C, recommended).** The production site is the more visible
     exposure, so this is my recommendation.
   - **Or wait for the staging release.** I can prepare the hotfix archive in
     about 30 minutes for your review. It changes only images and data
     references.
4. **Optional, later:** if you want the repository public again, rewrite
   history (D) after the redesign is merged to `main`, ideally in one planned
   operation with a GitHub Support purge request. If it stays private, D is
   optional.
