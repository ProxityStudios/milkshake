export class Deps {
  private static deps = new Map<any, any>();

  static get<T>(type: any): T {
    return this.deps.get(type) ?? this.add(type, new type());
  }

  static add<T>(type: any, i: T): T {
    return this.deps.set(type, i).get(type);
  }
}
