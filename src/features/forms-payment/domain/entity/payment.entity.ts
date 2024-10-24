export class PaymentEntity {
  public id?: number;
  public name: string;
  constructor(raw: PaymentEntity) {
    Object.assign(this, raw);
  }
}
