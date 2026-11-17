# dotactions/node

Composite actions for Node.js projects using pnpm.

## Versioning

Pin the **full commit SHA** of a release tag, with the version in a comment, or a floating tag:

```yaml
uses: dotactions/node/setup@<40-char-sha> # v0.1.0
uses: dotactions/node/setup@v0.1
```

Resolve a SHA with `git ls-remote https://github.com/dotactions/node 'refs/tags/v0.1.0^{}'`. Only SHAs of **release tags** pin the whole tree; a SHA from `main` still contains `@main` self-references.

| Ref | Moves on | Use |
| :-- | :-- | :-- |
| `@<sha>` | never | **Recommended**: immutable, full reproducibility |
| `@v0.1` | patch releases of `0.1` | **Recommended**: bug fixes, no breaking changes |
| `@v0.1.0` | never (tag can be moved) | Readable, but tags are mutable |
| `@v0` | every `0.x` release | Not recommended: during `0.x`, minor releases may break you |

Release notes: [GitHub Releases](https://github.com/dotactions/node/releases).

## Permissions

Examples assume a **public** repository. In a **private** repository, `actions/checkout` needs `contents: read`, so every job using these actions must grant it:

```yaml
permissions:
    contents: read # required for private repos; optional for public
```

## Setup Node & pnpm (`setup`)

Configures PNPM, sets up the Node.js runtime, restores cached dependencies, and runs `pnpm install --frozen-lockfile`.

> **Prerequisite**: Run `actions/checkout` before calling this action.

### Inputs

| Name                    | Description                                                                                 | Required | Default |
| :---------------------- | :------------------------------------------------------------------------------------------ | :------- | :------ |
| `node-version`          | Target Node.js version; takes precedence over `node-version-file`                           | No *     | `""`    |
| `node-version-file`     | Node.js version file relative to `working-directory` (e.g. `.nvmrc`, `package.json`)        | No *     | `""`    |
| `pnpm-version`          | PNPM version; leave empty to read `packageManager` from `package.json` (don't set both)     | No       | `""`    |
| `working-directory`     | Directory containing the target `package.json`                                              | No       | `"."`   |
| `cache-dependency-path` | Explicit lockfile path for cache hashing (defaults to `<working-directory>/pnpm-lock.yaml`) | No       | `""`    |

### Usage

```yaml
- uses: dotactions/node/setup@v0.1
  with:
      node-version-file: ".nvmrc"
      working-directory: "frontend"
```

\* One of `node-version` or `node-version-file` is required; the action fails early when both are empty instead of silently using the runner's preinstalled Node.

In a pnpm workspace, when `working-directory` is a sub-package, set `cache-dependency-path` to the root `pnpm-lock.yaml`.

## Build Node (`build`)

Runs a production build command using PNPM in the specified directory.

### Inputs

| Name                | Description                                               | Required | Default   |
| :------------------ | :-------------------------------------------------------- | :------- | :-------- |
| `working-directory` | Directory to execute the build command in                 | No       | `"."`     |
| `script`            | Lifecycle script defined in package.json                  | No       | `"build"` |
| `filter`            | `pnpm --filter` selector for a workspace package          | No       | `""`      |
| `args`              | Passed to the script; split on whitespace, no globbing    | No       | `""`      |

### Usage

```yaml
- uses: dotactions/node/build@v0.1
  with:
      working-directory: "frontend"
      script: "build"
      filter: "web"
      args: "--mode production"
```

## Releasing (maintainers)

1. Merge to `main` with conventional-commit PR titles; they become the release notes.
2. Go to **Actions → Release → Run workflow** on `main` and enter a version: `0.2.0`, or `0.2.0-rc.1` for a pre-release that moves no floating tags.

Don't use **Releases → Draft a new release**: it tags a plain `main` commit whose self-references still say `@main`, so the tag wouldn't pin the actions it runs, and it doesn't move the floating tags. The workflow (`internal-release.yml`, which calls [dotactions/tooling](https://github.com/dotactions/tooling)) does both, then creates the GitHub release with generated notes.

Bump the **minor** version for breaking changes and the **patch** version for everything else (`0.x`).
