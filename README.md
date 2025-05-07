# Calculadora de Empréstimos - Frontend

Este projeto é uma aplicação frontend para uma calculadora de empréstimos, desenvolvida com React e TypeScript. A aplicação permite aos usuários calcular parcelas de empréstimos com base em diferentes parâmetros.

## Funcionalidades

- Cálculo de empréstimos com base em:
  - Data inicial
  - Data final
  - Data do primeiro pagamento
  - Valor do empréstimo
  - Taxa de juros
- Exibição detalhada dos resultados em uma tabela
- Formatação de valores monetários e percentuais
- Validação de formulários
- Notificações de sucesso e erro
- Indicador de carregamento durante operações assíncronas

## Tecnologias Utilizadas

- React 19
- TypeScript
- Axios para requisições HTTP
- date-fns para manipulação de datas
- CSS para estilização

## Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd app-calculadora
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuração

A aplicação utiliza uma API backend para realizar os cálculos. Por padrão, a API é esperada em `http://localhost:8080`. Você pode configurar um endereço diferente criando um arquivo `.env.local` na raiz do projeto:

```
REACT_APP_API_URL=http://seu-backend-url
```

## Execução

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm start
# ou
yarn start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
# ou
yarn build
```

Os arquivos serão gerados na pasta `build`.

## Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── Calculadora/      # Componente principal da calculadora
│   ├── LoadingSpinner/   # Componente de indicador de carregamento
│   └── Notifications/    # Sistema de notificações
├── context/              # Contextos React
│   └── AppContext.tsx    # Contexto global da aplicação
├── models/               # Interfaces e tipos
│   └── calculadora.model.ts
├── services/             # Serviços para comunicação com a API
│   └── calculadora.service.ts
├── utils/                # Funções utilitárias
│   └── formatters.ts     # Formatadores de números, datas, etc.
├── App.tsx               # Componente raiz
└── index.tsx             # Ponto de entrada
```

## Funcionalidades Detalhadas

### Formatação de Valores

A aplicação utiliza formatadores personalizados para:
- Valores monetários (com separadores de milhar e vírgula para decimais)
- Percentuais (com suporte para valores fracionários)
- Datas (no formato local)

### Validação de Formulários

O formulário valida:
- Preenchimento de todos os campos obrigatórios
- Valores numéricos positivos
- Lógica de datas (data final posterior à inicial, etc.)

### Sistema de Notificações

A aplicação inclui um sistema de notificações que exibe mensagens de:
- Sucesso (verde)
- Erro (vermelho)
- Informação (azul)
- Alerta (amarelo)

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
