# Project workflow

For every completed change requested for this quiz, rebuild and run relevant checks, then commit and push the result to `origin/main`. Verify that the remote branch points to the new commit so the connected Vercel project can redeploy. Keep `index.html` updated with `pnpm.cmd build` whenever source files or images change.
