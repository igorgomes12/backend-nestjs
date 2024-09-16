import type { Replace } from "@/infra/helpers/replace";
import type { Content } from "./content";

type TSalesCustomerProps = {
  content: Content; //chamar a class de validação do content.
  creatdAt: Date
};

export class SalesCustumer {
  private props: TSalesCustomerProps;

  constructor(props: Replace<TSalesCustomerProps, {creatdAt?: Date}>) { //utilização do meu helpers Replace para ver como é seu funcionamento
    this.props = {
      ...props,
      creatdAt: props.creatdAt ?? new Date(),
    }
  }

  //getters and setters
  //TODO
  //  entidades devem ser listadas por todos os parametros declarados na tipagem;
  // criar nova validação para cada parametro e fazer em outro arquivo, e se ficar bagunçado colocar em pastas.

  public set(content: Content) {
    this.props.content = content;
  }
  public get(content: Content) {
    return (this.props.content = content);
  }
}
