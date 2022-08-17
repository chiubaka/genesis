# genesis

[![circleci](https://circleci.com/gh/chiubaka/genesis.svg?style=shield)](https://app.circleci.com/pipelines/github/chiubaka/genesis?filter=all)
[![codecov](https://codecov.io/gh/chiubaka/genesis/branch/master/graph/badge.svg?token=RV9CfKz4GB)](https://codecov.io/gh/chiubaka/genesis)

This repository contains packages and support tooling for `genesis`, a Chiubaka Technologies CLI for
generating standard Chiubaka Technologies monorepos.

At time of writing, it uses `nx` under the hood via `@chiubaka/nx-plugin`, a custom Nx plugin that provides
a preset generator to modify initial workspace generation.

This project actually started out as just an Nx plugin, but due to limitations in customization capabilities
provided to preset generators, ended up growing into a CLI that wraps Nx. This allows us to control the CLI
options passed down to Nx and name them appropriately so that 1) the user does not have to remember Nx CLI options and 2) option naming is less confusing, since Nx operates using a slightly different paradigm (e.g. Nx expects generation of org-level monorepos, but we are not using it for that purpose).

## Development

### Setup
1. Clone this repo
2. Run `yarn install` in the project root

### Common Commands
- `nx e2e genesis-e2e`
  - Runs E2E tests for the `genesis` package (WARNING: this takes awhile)
- `nx test nx-plugin`
  - Runs unit tests for the `nx-plugin` package
- `yarn deploy:genesis:local`
  - `verdaccio` server must be active somewhere in the background (simply run `yarn verdaccio` from the command line while in the project root)
  - Publishes `@chiubaka/genesis` locally and installs it globally.
  - `genesis` can then be run directly from the command line.
- `yarn deploy:preset:local`
  - `verdaccio` server must be active somewhere in the background (simply run `yarn verdaccio` from the command line while in the project root)
  - Packages up `@chiubaka/nx-plugin` and deploys it locally to generate a workspace
  - Output workspace shows up in `tmp/nx-e2e/preset`
