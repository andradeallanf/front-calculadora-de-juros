import React, { useState, useEffect, useCallback } from 'react';
import { EmprestimoDto, CalculadoraDto } from '../models/calculadora.model';
import { calcular } from '../services/calculadora.service';
import { formatarMoeda, formatarPercentual, formatarData, formatarNumeroTabela, isValidDate } from '../utils/formatters';
import { useAppContext } from '../context/AppContext';
import './Calculadora.css';

const Calculadora: React.FC = () => {
  const { setIsLoading, addNotification } = useAppContext();

  const [formData, setFormData] = useState<CalculadoraDto>({
    dataInicial: '',
    dataFinal: '',
    primeiroPagamento: '',
    valorEmprestimo: 0,
    taxaJuros: 0
  });

  const [valorEmprestimoFormatado, setValorEmprestimoFormatado] = useState('');
  const [taxaJurosFormatada, setTaxaJurosFormatada] = useState('');
  const [resultados, setResultados] = useState<EmprestimoDto[]>([]);
  const [formValido, setFormValido] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleValorEmprestimoChange = (valor: string) => {
    const { formatted, numeric } = formatarMoeda(valor);
    setValorEmprestimoFormatado(formatted);
    setFormData(prev => ({ ...prev, valorEmprestimo: numeric }));
  };

  const handleTaxaJurosChange = (valor: string) => {
    const { formatted, numeric } = formatarPercentual(valor);
    setTaxaJurosFormatada(formatted);
    setFormData(prev => ({ ...prev, taxaJuros: numeric }));
  };

  const validarFormulario = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const { dataInicial, dataFinal, primeiroPagamento, valorEmprestimo, taxaJuros } = formData;
    const errors: Record<string, string> = {};

    if (!dataInicial) {
      errors.dataInicial = 'Data inicial é obrigatória';
    }

    if (!dataFinal) {
      errors.dataFinal = 'Data final é obrigatória';
    }

    if (!primeiroPagamento) {
      errors.primeiroPagamento = 'Data do primeiro pagamento é obrigatória';
    }

    if (!valorEmprestimo || valorEmprestimo <= 0) {
      errors.valorEmprestimo = 'Valor do empréstimo é obrigatório e deve ser maior que zero';
    }

    if (!taxaJuros || taxaJuros <= 0) {
      errors.taxaJuros = 'Taxa de juros é obrigatória e deve ser maior que zero';
    }

    if (dataInicial && dataFinal && primeiroPagamento) {
      const dInicial = new Date(dataInicial);
      const dFinal = new Date(dataFinal);
      const dPrimeiroPagamento = new Date(primeiroPagamento);

      if (!isValidDate(dataInicial)) {
        errors.dataInicial = 'Data inicial inválida';
      }

      if (!isValidDate(dataFinal)) {
        errors.dataFinal = 'Data final inválida';
      }

      if (!isValidDate(primeiroPagamento)) {
        errors.primeiroPagamento = 'Data do primeiro pagamento inválida';
      }

      if (isValidDate(dataInicial) && isValidDate(dataFinal) && dFinal <= dInicial) {
        errors.dataFinal = 'Data final deve ser posterior à data inicial';
      }

      if (isValidDate(dataInicial) && isValidDate(primeiroPagamento) && dPrimeiroPagamento <= dInicial) {
        errors.primeiroPagamento = 'Primeiro pagamento deve ser posterior à data inicial';
      }

      if (isValidDate(dataFinal) && isValidDate(primeiroPagamento) && dPrimeiroPagamento >= dFinal) {
        errors.primeiroPagamento = 'Primeiro pagamento deve ser anterior à data final';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [formData]);

  useEffect(() => {
    const { isValid, errors } = validarFormulario();
    setFormValido(isValid);
    setFormErrors(errors);
  }, [formData, validarFormulario]);

  const handleCalcular = async () => {
    const { isValid } = validarFormulario();

    if (!isValid) {
      return;
    }

    try {
      const response = await calcular(formData, {
        setLoading: setIsLoading,
        onError: (message) => addNotification('error', message)
      });

      setResultados(response);
      addNotification('success', 'Cálculo realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao calcular empréstimo:', error);
    }
  };



  return (
    <div className="calculator-container">
      <h1>Calculadora de Empréstimos</h1>

      <div className="input-container">
        <div className="input-field">
          <label>Data Inicial</label>
          <input
            type="date"
            value={formData.dataInicial}
            onChange={(e) => setFormData(prev => ({ ...prev, dataInicial: e.target.value }))}
            required
          />
        </div>

        <div className="input-field">
          <label>Data Final</label>
          <input
            type="date"
            value={formData.dataFinal}
            onChange={(e) => setFormData(prev => ({ ...prev, dataFinal: e.target.value }))}
            required
          />
        </div>

        <div className="input-field">
          <label>Primeiro Pagamento</label>
          <input
            type="date"
            value={formData.primeiroPagamento}
            onChange={(e) => setFormData(prev => ({ ...prev, primeiroPagamento: e.target.value }))}
            required
          />
        </div>

        <div className="input-field">
          <label>Valor do Empréstimo</label>
          <input
            type="text"
            value={valorEmprestimoFormatado}
            onChange={(e) => handleValorEmprestimoChange(e.target.value)}
            placeholder="0,00"
            required
          />
        </div>

        <div className="input-field">
          <label>Taxa de Juros</label>
          <div className="input-with-suffix">
            <input
              type="text"
              value={taxaJurosFormatada}
              onChange={(e) => handleTaxaJurosChange(e.target.value)}
              placeholder="0,00"
              required
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-field button-container">
          <label>&nbsp;</label>
          <button className="calculate-btn" disabled={!formValido} onClick={handleCalcular}>
            Calcular
          </button>
        </div>
      </div>

      <div className="results-grid">
        <table>
          <thead>
            <tr>
              <th colSpan={3} className="group-header">Empréstimo</th>
              <th colSpan={2} className="group-header">Parcela</th>
              <th colSpan={2} className="group-header">Principal</th>
              <th colSpan={3} className="group-header">Juros</th>
            </tr>
            <tr>
              <th className="sub-header">Data Competência</th>
              <th className="sub-header">Valor do Empréstimo</th>
              <th className="sub-header">Saldo Devedor</th>
              <th className="sub-header">Consolidada</th>
              <th className="sub-header">Total</th>
              <th className="sub-header">Amortização</th>
              <th className="sub-header">Saldo</th>
              <th className="sub-header">Provisão</th>
              <th className="sub-header">Acumulado</th>
              <th className="sub-header">Pago</th>
            </tr>
          </thead>
          <tbody>
            {resultados.length > 0 ? (
              resultados.map((resultado, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td className="date-cell">
                    {formatarData(resultado.dataCompetencia)}
                  </td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.valorEmprestimo)}</td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.saldoDevedor)}</td>
                  <td className="consolidada-cell">
                    {resultado.consolidada ? (resultado.consolidada === true ?
                      `${Math.floor(index/4) + 1}/${Math.ceil(resultados.length/4)}` :
                      resultado.consolidada) : ''}
                  </td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.total)}</td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.amortizacao)}</td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.saldo)}</td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.provisao)}</td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.acumulado)}</td>
                  <td className="numeric-cell">{formatarNumeroTabela(resultado.pago)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="no-results">
                  Nenhum resultado para exibir. Preencha o formulário e clique em Calcular.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calculadora;