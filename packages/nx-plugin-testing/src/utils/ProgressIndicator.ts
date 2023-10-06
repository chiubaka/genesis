import humanizeDuration from "humanize-duration";
import ora, { Ora } from "ora";

export class ProgressIndicator {
  private static UPDATE_INTERVAL_MS = 30_000;

  private spinner: Ora;
  private initialMessage: string;

  private timer?: NodeJS.Timer;
  private startedAt?: number;

  constructor(message: string) {
    this.initialMessage = message;
    this.spinner = ora(this.initialMessage);
  }

  public start() {
    this.spinner.start();

    this.startedAt = Date.now();
    this.timer = setInterval(() => {
      const elapsedTime = this.getElapsedTime();
      this.spinner.start(
        `[Still working... ${elapsedTime} elapsed] ${this.initialMessage}`,
      );
    }, ProgressIndicator.UPDATE_INTERVAL_MS);

    return this;
  }

  public succeed(message: string) {
    const elapsedTime = this.getElapsedTime();
    this.spinner.succeed(`${message} (${elapsedTime})`);
    this.cleanup();

    return this;
  }

  public fail(message: string) {
    const elapsedTime = this.getElapsedTime();
    this.spinner.fail(`${message} (${elapsedTime})`);
    this.cleanup();

    return this;
  }

  private getElapsedTime(): string {
    if (!this.startedAt) {
      throw new Error(`start() must be called before calling getElapsedTime()`);
    }

    const elapsedTimeMs = Date.now() - this.startedAt;
    return humanizeDuration(elapsedTimeMs);
  }

  private cleanup() {
    clearInterval(this.timer as unknown as number);
  }
}
