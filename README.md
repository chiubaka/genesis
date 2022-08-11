

# Chiubaka Technologies Nx Plugin

[![circleci](https://circleci.com/gh/chiubaka/nx-plugin.svg?style=shield)](https://app.circleci.com/pipelines/github/chiubaka/nx-plugin?filter=all)
[![codecov](https://codecov.io/gh/chiubaka/nx-plugin/branch/master/graph/badge.svg?token=RV9CfKz4GB)](https://codecov.io/gh/chiubaka/nx-plugin)

This project contains packages and support tooling for @chiubaka/nx-plugin, which exists to help generate and customize
Chiubaka Technologies monorepos.

## Development

### Setup
1. Clone this repo
2. Run `yarn install` in the project root
3. Install `verdaccio` globally on your machine with `npm install -g verdaccio`

### Common Commands
- `nx test nx-plugin`
  - Runs unit tests for the `nx-plugin` package
- `nx e2e nx-plugin-e2e`
  - Runs E2E tests for the `nx-plugin` package (WARNING: this takes awhile)
- `yarn deploy:preset:local`
  - `verdaccio` server must be active somewhere in the background (simply run `verdaccio` from the command line)
  - Packages up `@chiubaka/nx-plugin` and deploys it locally to generate a workspace
  - Output workspace shows up in `tmp/nx-e2e/preset`
