export class CreateModuleEntity {
  public id?: number;
  public system: string;
  public module: string;
  public status: boolean = true;
  constructor(props: Partial<CreateModuleEntity>) {
    Object.assign(this, props);
  }
}
