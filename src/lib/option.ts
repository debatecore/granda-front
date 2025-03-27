export class None {}
export class Some<T> {
  value: T;

  constructor(val: T) {
    this.value = val;
  }
}
export type Option<T> = None | Some<T>;
