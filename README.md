# FileBatcher Frontend

Interface web para o sistema FileBatcher — importação e processamento de parceiros em lote via CSV.

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env.local` na raiz do projeto:

```
VITE_API_BASE_URL=
```

Deixando `VITE_API_BASE_URL` vazio, a aplicação usa o proxy do Vite em desenvolvimento para contornar CORS — as requisições para `/api/*` são redirecionadas para `https://filebatcher.onrender.com`.

Para produção ou deploy estático, defina a URL completa da API:

```
VITE_API_BASE_URL=https://filebatcher.onrender.com
```

## Rodando em desenvolvimento

```bash
npm run dev
```

Abre em `http://localhost:5173`.

> **Nota:** A API hospedada no Render pode entrar em cold start. O primeiro acesso pode demorar alguns segundos.

## Testes

```bash
npx vitest run
```

## Build para produção

```bash
npm run build
```

A pasta `dist/` contém os arquivos estáticos prontos para deploy no Vercel, Netlify ou Cloudflare Pages.

## Decisões de arquitetura

A camada `src/api/` contém funções HTTP puras (sem estado, sem React) que espelham diretamente o contrato da API. Os `src/hooks/` encapsulam TanStack Query e são o único ponto de contato entre API e componentes — o que facilita testar os componentes mockando apenas as funções de API, sem simular toda a infraestrutura de fetch.

O processamento de lotes (`POST /api/file-batches/start-processing`) é uma operação global FIFO — a API processa sempre o lote mais antigo com status `IMPORTED`. A UI reflete isso com um botão global na lista de lotes, não por linha. Polling automático a cada 3s mantém o status atualizado enquanto há lote em processamento, sem bloquear a interface.
