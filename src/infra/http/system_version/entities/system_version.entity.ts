export class SystemVersion {
  public readonly id: string;
  public system_id: string;
  public version_number: string;
  public release_date: Date;
  public description?: string;

  constructor(props: Omit<SystemVersion, "id">) {
    Object.assign(this, props);
  }
}
