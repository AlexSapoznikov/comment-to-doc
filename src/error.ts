/**
 * Rule error
 */
export class RuleError extends Error {
  constructor (message: string) {
    super(message);
    this.name = "Rule Error";
    this.message = `${this.name}: ${this.message}`;
    this.stack = undefined;
  }
}

/**
 * Throws or logs error
 * @param msg
 */
export const warn = (msg: string) => {
  console.warn(msg);
}
