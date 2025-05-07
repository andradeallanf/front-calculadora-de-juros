import axios, { AxiosError } from 'axios';
import { CalculadoraDto, EmprestimoDto } from '../models/calculadora.model';
import { format } from 'date-fns';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const calcular = async (
  data: CalculadoraDto,
  callbacks?: {
    setLoading?: (loading: boolean) => void;
    onError?: (message: string) => void;
  }
): Promise<EmprestimoDto[]> => {
  try {
    if (callbacks?.setLoading) {
      callbacks.setLoading(true);
    }

    const params = {
      dataInicio: format(new Date(data.dataInicial), 'dd/MM/yyyy'),
      dataFim: format(new Date(data.dataFinal), 'dd/MM/yyyy'),
      primeiroPagamento: format(new Date(data.primeiroPagamento), 'dd/MM/yyyy'),
      valorEmprestimo: data.valorEmprestimo,
      taxaJuros: data.taxaJuros,
    };

    const response = await axios.get<EmprestimoDto[]>(`${API_URL}/calculadora/calcular`, {
      params,
      timeout: 10000, // 10 second timeout
    });

    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao calcular empréstimo:', error);

    // Handle error with callback if provided
    if (callbacks?.onError) {
      // Tratamento específico para erros do Axios
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ECONNABORTED') {
          callbacks.onError('Tempo limite excedido. Verifique sua conexão e tente novamente.');
        } else if (axiosError.response) {
          const status = axiosError.response.status;
          const message = axiosError.response.data && typeof axiosError.response.data === 'object' && 'message' in axiosError.response.data
            ? String(axiosError.response.data.message)
            : 'Erro no servidor';

          callbacks.onError(`Erro ${status}: ${message}`);
        } else if (axiosError.request) {
          callbacks.onError('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          callbacks.onError('Erro ao processar a solicitação.');
        }
      } else {
        // Tratamento genérico para outros tipos de erro
        callbacks.onError('Ocorreu um erro inesperado.');
      }
    }

    throw error;
  } finally {
    // Reset loading state if callback provided
    if (callbacks?.setLoading) {
      callbacks.setLoading(false);
    }
  }
};