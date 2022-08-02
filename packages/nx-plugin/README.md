# nx-plugin

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build nx-plugin` to build the library.

## Running tests

### Running unit tests
Run `nx test nx-plugin` to execute the unit tests via Jest.

### Running e2e tests
Run `nx e2e nx-plugin-e2e` to execute unit tests via Jest.

## Deploying locally (for testing)

### Running generators
[Build the project](#building). Using the package output in the `dist`
directory, run `yarn link` to set this package up as `@chiubaka/nx-plugin` locally.
In the package you'd like to test the updated plugin in, run `yarn link @chiubaka/nx-plugin`
to install this plugin using the linked code.

Run generator by running command `nx generate @chiubaka/nx-plugin:[generatorName]`.

### Running the preset
Start `verdaccio`. See [Verdaccio's installation docs](https://verdaccio.org/docs/installation) if you don't already have it set up.

[Build the project](#building). Using the package output in the `dist` directory,
publish to Verdaccio using `npm publish --registry http://localhost:4873`.

To generate a workspace using the preset from this plugin, you can now run
`npm_config_registry=http://localhost:4873 npx create-nx-workspace [workspaceName] --preset=@chiubaka/nx-plugin`.

**Note**: If attempting to test a version of the plugin that has already been published
locally, you can remove the existing published version by running `npm unpublish chiubaka/nx-plugin@[semver] --registry http://localhost:4873 -f`.
