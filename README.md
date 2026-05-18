# FileBatcher Frontend

Interface web para o sistema FileBatcher — importação e processamento de parceiros em lote via CSV.

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env.local
```

O arquivo `.env.local` deve ter `VITE_API_BASE_URL` vazio para desenvolvimento:

```
VITE_API_BASE_URL=
```

Com o valor vazio, o proxy do Vite redireciona `/api/*` para `https://filebatcher.onrender.com`, contornando CORS em desenvolvimento.

Para produção, o arquivo `.env.production` já está configurado no repositório com a URL da API. Não é necessário nenhuma configuração adicional para deploy estático no Vercel, Netlify ou Cloudflare Pages.

> **Nota sobre CORS:** em `npm run preview` (build local), as requisições vão direto para a API sem o proxy, e o browser bloqueará por CORS — isso é esperado. O comportamento correto só ocorre com um deploy real, onde o domínio esteja na whitelist da API.

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
