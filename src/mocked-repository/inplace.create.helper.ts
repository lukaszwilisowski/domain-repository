export class InPlaceCreateHelper<A> {
  public generateIDsForObject(object: Record<string, unknown>): A {
    //create id for object
    if (!object['id']) object['id'] = this.generateId();

    for (const key in object) {
      if (!object[key]) continue;

      if (Array.isArray(object[key])) {
        for (const e of object[key] as unknown[]) {
          if (typeof e === 'object') {
            //create id for nested array object
            this.generateIDsForObject(object[key] as Record<string, unknown>);
          }
        }

        continue;
      }

      if (typeof object[key] === 'object') {
        //create id for nested object
        this.generateIDsForObject(object[key] as Record<string, unknown>);
      }
    }

    return object as A;
  }

  public deepCopy(object: unknown): unknown {
    const copy = { ...(object as {}) } as Record<string, unknown>;

    for (const key in copy) {
      if (Array.isArray(copy[key])) {
        const newArray = [];

        for (const e of copy[key] as unknown[]) {
          if (typeof e === 'object') newArray.push(this.deepCopy(e));
          else newArray.push(e);
        }

        copy[key] = newArray;
        continue;
      }

      if (typeof copy[key] === 'object') {
        copy[key] = this.deepCopy(copy[key]);
      }
    }

    return copy;
  }

  private hex = (value: number): string => {
    return Math.floor(value).toString(16);
  };

  private generateId = (): string => {
    return Math.floor(Date.now() / 1000) + ' '.repeat(16).replace(/./g, () => this.hex(Math.random() * 16));
  };
}
