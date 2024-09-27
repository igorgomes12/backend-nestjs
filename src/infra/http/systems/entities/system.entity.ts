export class System {
  public readonly id: number;
  public name: string;

  constructor(props: Omit<System, "id">, id?: number) {
    Object.assign(this, props);
    if (!id) {
      this.id = Math.floor(Math.random() * 10000) + 1;
    }
  }
}
