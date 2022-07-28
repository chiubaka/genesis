import {
  checkFilesExist,
  ensureNxProject,
  exists,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

describe('nx-plugin e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@chiubaka/nx-plugin', 'dist/packages/nx-plugin');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  describe('with default options', () => {
    let project: string;

    beforeAll(async () => {
      project = uniq('preset');
      await runNxCommandAsync(
        `generate @chiubaka/nx-plugin:preset ${project}`
      );
    });

    it('should not create an apps dir', async () => {
      expect(() => {
        checkFilesExist('apps');
      }).toThrow();
    });

    describe('package manager', () => {
      it('should install packages with yarn', () => {
        expect(() => {
          checkFilesExist('yarn.lock');
        }).not.toThrow();
      });

      it('should not install packages with npm', () => {
        expect(() => {
          checkFilesExist('package-lock.json');
        }).toThrow();
      });
    });
  });
});
