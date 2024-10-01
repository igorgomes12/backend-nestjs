export class SystemVersion {
  public readonly id: number;
  public system_id: number;
  public version_number: string;
  public release_date: Date;
  public description?: string;

  constructor(props: Omit<SystemVersion, "id">) {
    Object.assign(this, props);
  }
}
