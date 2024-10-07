export class SystemVersionEntity {
  public readonly id: number;
  public system_id: number;
  public version_number: string;
  public release_date: Date;
  public description?: string;

  constructor(props: Omit<SystemVersionEntity, "id">) {
    Object.assign(this, props);
  }
}
