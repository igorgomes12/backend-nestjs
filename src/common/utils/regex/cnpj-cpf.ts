export const formatCpfCnpj = (inputValue: string): string => {
  // Remove todos os caracteres não numéricos
  let formattedValue = inputValue.replace(/\D/g, "");

  // Se o valor for um CPF (11 dígitos)
  if (formattedValue.length <= 11) {
    formattedValue = formattedValue.substring(0, 11);
    formattedValue = formattedValue.replace(/^(\d{3})(\d)/, "$1.$2");
    formattedValue = formattedValue.replace(
      /^(\d{3})\.(\d{3})(\d)/,
      "$1.$2.$3"
    );
    formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, ".$1-$2");
  }
  // Se o valor for um CNPJ (14 dígitos)
  else {
    formattedValue = formattedValue.substring(0, 14);
    formattedValue = formattedValue.replace(/^(\d{2})(\d)/, "$1.$2");
    formattedValue = formattedValue.replace(
      /^(\d{2})\.(\d{3})(\d)/,
      "$1.$2.$3"
    );
    formattedValue = formattedValue.replace(/\.(\d{3})(\d)/, ".$1/$2");
    formattedValue = formattedValue.replace(/(\d{4})(\d)/, "$1-$2");
  }

  return formattedValue;
};
