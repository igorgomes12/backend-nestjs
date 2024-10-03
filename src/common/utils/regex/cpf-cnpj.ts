export const cpfRegex = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
export const cnpjRegex = /^(?:\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/;

export const formatCpfOrCnpj = (cpfCnpj?: string): string => {
  cpfCnpj ??= "";
  cpfCnpj = cpfCnpj.replace(/\D/g, "");
  switch (cpfCnpj.length) {
    case 3 + 3 + 3 + 2:
      return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
    default:
      return cpfCnpj.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/,
        "$1.$2.$3/$4-$5"
      );
  }
};
