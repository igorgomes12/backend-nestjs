export class AgreementEntity {
  id: number;
  timestamp: Date;
  representativeId: number;
  description: string;
  value: string;
  clientId: number;
  paymment: Date;
  paymentId: string;
  observation?: string;
  situation: "ACORDADO" | "NAO_ACORDADO" | "FINALIZADO";
  situatonpayment:
    | "RECEBER_DO_CLIENTE"
    | "REBECER_AQUI"
    | "DEPOSITO"
    | "BOLETO";

  constructor(data: {
    id: number;
    timestamp: Date;
    representativeId: number;
    description: string;
    value: string;
    clientId: number;
    paymment: Date;
    paymentId: string;
    observation?: string;
    situation: "ACORDADO" | "NAO_ACORDADO" | "FINALIZADO";
    situatonpayment:
      | "RECEBER_DO_CLIENTE"
      | "REBECER_AQUI"
      | "DEPOSITO"
      | "BOLETO";
  }) {
    this.id = data.id;
    this.timestamp = data.timestamp;
    this.representativeId = data.representativeId;
    this.description = data.description;
    this.value = data.value;
    this.clientId = data.clientId;
    this.paymment = data.paymment;
    this.paymentId = data.paymentId;
    this.observation = data.observation;
    this.situation = data.situation;
    this.situatonpayment = data.situatonpayment;
  }
}
