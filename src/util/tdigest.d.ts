declare module "tdigest" {
  export class TDigest {
    constructor();
    push(value: number): void;
    summary(): string;
  }
}
