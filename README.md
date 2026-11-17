# dotactions/node

Composite actions for Node.js projects using pnpm.

## Versioning

Pin the **full commit SHA** of a release tag, with the version in a comment, or a floating tag:

```yaml
uses: dotactions/node/setup@<40-char-sha> # v0.6.0
uses: dotactions/node/setup@v0.6
```

Resolve a SHA with `git ls-remote https://github.com/dotactions/node 'refs/tags/v0.6.0^{}'`. Only SHAs of **release tags** pin the whole tree; a SHA from `main` still contains `@main` self-references.

| Ref | Moves on | Use |
| :-- | :-- | :-- |
| `@<sha>` | never | **Recommended**: immutable, full reproducibility |
| `@v0.6` | patch releases of `0.6` | **Recommended**: bug fixes, no breaking changes |
| `@v0.6.0` | never (tag can be moved) | Readable, but tags are mutable |
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
| `node-version`          | Target Node.js version                                                                      | No       | `"24"`  |
| `pnpm-version`          | Specific PNPM version (empty string reads from `package.json`)                              | No       | `""`    |
| `working-directory`     | Directory containing the target `package.json`                                              | No       | `"."`   |
| `cache-dependency-path` | Explicit lockfile path for cache hashing (defaults to `<working-directory>/pnpm-lock.yaml`) | No       | `""`    |

### Usage

```yaml
- uses: dotactions/node/setup@v0.6
  with:
      node-version: "24"
      working-directory: "frontend"
```

## Build Node (`build`)

Runs a production build command using PNPM in the specified directory.

### Inputs

| Name                | Description                                               | Required | Default   |
| :------------------ | :-------------------------------------------------------- | :------- | :-------- |
| `working-directory` | Directory to execute the build command in                 | No       | `"."`     |
| `script`            | Lifecycle script defined in package.json                  | No       | `"build"` |
| `args`              | Additional CLI flags passed to the script (e.g. --filter) | No       | `""`      |

### Usage

```yaml
- uses: dotactions/node/build@v0.6
  with:
      working-directory: "frontend"
      script: "build"
      args: "--filter=web"
```

## Releasing (maintainers)

1. Merge to `main` with conventional-commit PR titles; they become the release notes.
2. Go to **Actions → Release → Run workflow** on `main` and enter a version: `0.7.0`, or `0.7.0-rc.1` for a pre-release that moves no floating tags.

Don't use **Releases → Draft a new release**: it tags a plain `main` commit whose self-references still say `@main`, so the tag wouldn't pin the actions it runs, and it doesn't move the floating tags. The workflow (`internal-release.yml`, which calls [dotactions/tooling](https://github.com/dotactions/tooling)) does both, then creates the GitHub release with generated notes.

Bump the **minor** version for breaking changes and the **patch** version for everything else (`0.x`).
