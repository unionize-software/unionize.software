# Releasing the MCP package

The `packages/unionize-mcp` workspace is public-release ready but is not automatically published when a pull request merges.

## Prepare

1. Run `pnpm sync:mcp-package` and commit the result.
2. Run the complete checks in `docs/MERGE_GATES.md`.
3. Choose a semantic version and update `packages/unionize-mcp/package.json`.
4. Confirm `pnpm check:mcp-package` and `npm pack --dry-run` from the package directory.
5. Inspect the tarball file list for secrets, local data, and missing licenses.

## Publish

Publishing is an explicit maintainer action requiring npm credentials:

```bash
cd packages/unionize-mcp
npm publish --access public --provenance
```

After publishing, verify from a clean temporary directory that the documented `npx` command starts the server and exposes all 29 guides, review metadata, structured sources, pathfinder resources, and the canonical project URL.

Only then update public documentation from repository-based installation to the released, version-pinned package command.
