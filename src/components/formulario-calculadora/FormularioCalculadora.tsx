import React, { useState, useEffect } from 'react';
import { CalculadoraDto } from '../../models/calculadora.model';
import { formatarMoeda, formatarPercentual } from '../../utils/formatters';
import './FormularioCalculadora.css';

interface FormularioCalculadoraProps {
  formData: CalculadoraDto;
  setFormData: React.Dispatch<React.SetStateAction<CalculadoraDto>>;
  valorEmprestimoFormatado: string;
  setValorEmprestimoFormatado: React.Dispatch<React.SetStateAction<string>>;
  taxaJurosFormatada: string;
  setTaxaJurosFormatada: React.Dispatch<React.SetStateAction<string>>;
  formValido: boolean;
  formErrors: Record<string, string>;
  onCalcular: () => void;
}

const FormularioCalculadora: React.FC<FormularioCalculadoraProps> = ({
  formData,
  setFormData,
  valorEmprestimoFormatado,
  setValorEmprestimoFormatado,
  taxaJurosFormatada,
  setTaxaJurosFormatada,
  formValido,
  formErrors,
  onCalcular
}) => {

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

  return (
    <div className="form-container">
      <div className="input-container">
        <div className={`input-field ${formErrors.dataInicial ? 'error' : ''}`}>
          <label>Data Inicial</label>
          <input
            type="date"
            value={formData.dataInicial}
            onChange={(e) => setFormData(prev => ({ ...prev, dataInicial: e.target.value }))}
            required
            className={formErrors.dataInicial ? 'error-input' : ''}
          />
          {formErrors.dataInicial && <div className="error-message">{formErrors.dataInicial}</div>}
        </div>

        <div className={`input-field ${formErrors.dataFinal ? 'error' : ''}`}>
          <label>Data Final</label>
          <input
            type="date"
            value={formData.dataFinal}
            onChange={(e) => setFormData(prev => ({ ...prev, dataFinal: e.target.value }))}
            required
            className={formErrors.dataFinal ? 'error-input' : ''}
          />
          {formErrors.dataFinal && <div className="error-message">{formErrors.dataFinal}</div>}
        </div>

        <div className={`input-field ${formErrors.primeiroPagamento ? 'error' : ''}`}>
          <label>Primeiro Pagamento</label>
          <input
            type="date"
            value={formData.primeiroPagamento}
            onChange={(e) => setFormData(prev => ({ ...prev, primeiroPagamento: e.target.value }))}
            required
            className={formErrors.primeiroPagamento ? 'error-input' : ''}
          />
          {formErrors.primeiroPagamento && <div className="error-message">{formErrors.primeiroPagamento}</div>}
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
              placeholder="0"
              required
            />
            <span className="input-suffix">%</span>
          </div>
        </div>

        <div className="input-field button-container">
          <label>&nbsp;</label>
          <button
            className="calculate-btn"
            onClick={onCalcular}
            disabled={!formValido}
          >
            Calcular
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormularioCalculadora;
