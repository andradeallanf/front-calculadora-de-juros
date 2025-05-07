import React from 'react';
import { EmprestimoDto } from '../../models/calculadora.model';
import { formatarData, formatarNumeroTabela } from '../../utils/formatters';
import './ResultadosTabela.css';

interface ResultadosTabelaProps {
  resultados: EmprestimoDto[];
}

const ResultadosTabela: React.FC<ResultadosTabelaProps> = ({ resultados }) => {
  return (
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
  );
};

export default ResultadosTabela;
