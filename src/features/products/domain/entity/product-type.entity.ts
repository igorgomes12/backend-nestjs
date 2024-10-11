export class ProductTypeEntity {
  public id: number;
  public name: string;
  public price: number;
  public qtd_stock: number;
  public qtd_consigned: number;
  public qtd_supplied: number;
  constructor(raw: ProductTypeEntity) {
    Object.assign(this, raw);
  }
}
