const formatarValor = (
  valor: string,
  options: {
    limitarDecimais?: boolean,
    maxDecimais?: number
  } = {}
): { formatted: string; numeric: number } => {
  const { limitarDecimais = false, maxDecimais = 2 } = options;

  let partes = valor.split(',');
  let numerosSemVirgula = partes[0].replace(/\D/g, '');

  let numeroFormatado = '';
  for (let i = 0; i < numerosSemVirgula.length; i++) {
    if (i > 0 && (numerosSemVirgula.length - i) % 3 === 0) {
      numeroFormatado += '.';
    }
    numeroFormatado += numerosSemVirgula[i];
  }

  if (valor.includes(',')) {
    numeroFormatado += ',';
    if (partes[1]) {
      let parteDecimal = partes[1].replace(/\D/g, '');

      if (limitarDecimais) {
        parteDecimal = parteDecimal.substring(0, maxDecimais);
      }

      numeroFormatado += parteDecimal;
    }
  }

  const valorNumerico = Number(numeroFormatado.replace(/\./g, '').replace(',', '.'));

  return {
    formatted: numeroFormatado,
    numeric: valorNumerico
  };
};

export const formatarMoeda = (valor: string): { formatted: string; numeric: number } => {
  return formatarValor(valor);
};

export const formatarPercentual = (valor: string): { formatted: string; numeric: number } => {
  return formatarValor(valor, { limitarDecimais: true, maxDecimais: 2 });
};

export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const formatarData = (dateString: string): string => {
  if (!isValidDate(dateString)) return '';
  return new Date(dateString).toLocaleDateString();
};

export const formatarNumero = (value: number, decimals: number = 2): string => {
  return value.toFixed(decimals);
};

export const formatarNumeroTabela = (value: number, decimals: number = 2): string => {
  const numeroFixo = value.toFixed(decimals);

  const numeroComVirgula = numeroFixo.replace('.', ',');

  const { formatted } = formatarValor(numeroComVirgula);

  return formatted;
};
