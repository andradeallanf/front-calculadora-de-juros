import React, { useState, useEffect, useCallback } from 'react';
import { EmprestimoDto, CalculadoraDto } from '../../models/calculadora.model';
import { calcular } from '../../services/calculadora.service';
import { isValidDate } from '../../utils/formatters';
import { useAppContext } from '../../context/AppContext';
import ResultadosTabela from '../resultados-tabela/ResultadosTabela';
import FormularioCalculadora from '../formulario-calculadora/FormularioCalculadora';
import './CalculadoraPage.css';

const CalculadoraPage: React.FC = () => {
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

  const validarFormulario = useCallback((): { isValid: boolean; errors: Record<string, string> } => {
    const { dataInicial, dataFinal, primeiroPagamento, valorEmprestimo, taxaJuros } = formData;
    const errors: Record<string, string> = {};

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (!valorEmprestimo || valorEmprestimo <= 0) {
      errors.valorEmprestimo = 'Valor do empréstimo é obrigatório e deve ser maior que zero';
    }

    if (!taxaJuros || taxaJuros <= 0) {
      errors.taxaJuros = 'Taxa de juros é obrigatória e deve ser maior que zero';
    }

    if (dataInicial) {
      const dInicial = new Date(dataInicial);

      if (!isValidDate(dataInicial)) {
        errors.dataInicial = 'Data inicial inválida';
      } else {
        const dataInicialStr = dataInicial.split('T')[0];
        const hojeStr = hoje.toISOString().split('T')[0];

        if (dataInicialStr < hojeStr) {
          errors.dataInicial = 'Data inicial não pode ser anterior à data atual';
        }
      }

      if (dataFinal) {
        const dFinal = new Date(dataFinal);

        if (!isValidDate(dataFinal)) {
          errors.dataFinal = 'Data final inválida';
        } else if (dFinal <= dInicial) {
          errors.dataFinal = 'Data final deve ser posterior à data inicial';
        }
      }

      if (primeiroPagamento) {
        const dPrimeiroPagamento = new Date(primeiroPagamento);

        if (!isValidDate(primeiroPagamento)) {
          errors.primeiroPagamento = 'Data do primeiro pagamento inválida';
        } else if (dPrimeiroPagamento <= dInicial) {
          errors.primeiroPagamento = 'Primeiro pagamento deve ser posterior à data inicial';
        } else if (dataFinal) {
          const dFinal = new Date(dataFinal);
          if (isValidDate(dataFinal) && dPrimeiroPagamento >= dFinal) {
            errors.primeiroPagamento = 'Primeiro pagamento deve ser anterior à data final';
          }
        }
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

      <FormularioCalculadora
        formData={formData}
        setFormData={setFormData}
        valorEmprestimoFormatado={valorEmprestimoFormatado}
        setValorEmprestimoFormatado={setValorEmprestimoFormatado}
        taxaJurosFormatada={taxaJurosFormatada}
        setTaxaJurosFormatada={setTaxaJurosFormatada}
        formValido={formValido}
        formErrors={formErrors}
        onCalcular={handleCalcular}
      />

      <ResultadosTabela resultados={resultados} />
    </div>
  );
};

export default CalculadoraPage;
