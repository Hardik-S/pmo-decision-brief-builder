# Verification Notes

## Expected Local Gate

```powershell
npm ci
npm run verify
```

`npm run verify` runs:

1. `npm run test`
2. `npm run typecheck`
3. `npm run build`

The build script uses `next build --webpack` because the automation path can be long on Windows, and prior portfolio fixer runs have shown Turbopack path-length instability in similar long worktrees.

## Production Smoke Checklist

After deployment, verify:

- HTTP 200 on `https://pmo-decision-brief-builder.vercel.app`.
- Page contains `PMO Decision Brief Builder`.
- Page contains `Approval Gates`.
- Page contains `Ship a thin intake pilot`.
- Response headers include CSP, Referrer-Policy, Permissions-Policy, X-Frame-Options, and X-Content-Type-Options.

## Known Package Surface Note

During this fixer run, `npm ci` in the long automation worktree timed out once and left a partial `node_modules` tree without local binaries. If this recurs, use a clean short staging path for final verification rather than retrying the same package surface repeatedly.
