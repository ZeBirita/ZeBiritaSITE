# Zé Birita

O **Zé Birita** é um projeto desenvolvido com o objetivo de facilitar as compras de bebidas, oferecendo entregas extremamente rápidas em toda a cidade de Portimão, Portugal.  
O serviço foi pensado para tornar a experiência de adquirir bebidas mais prática, conveniente e confiável, atendendo tanto a clientes que buscam rapidez quanto aqueles que valorizam simplicidade e eficiência no processo de compra.

## Funcionalidades
- Catálogo completo de bebidas, incluindo alcoólicas e não alcoólicas.
- Sistema de pedidos online simples e intuitivo.
- Entregas rápidas em toda a cidade de Portimão.

## Tecnologias Utilizadas
- React
- Integração com serviços de entrega e geolocalização.
- Outras tecnologias: Vercel

## Instalação
1. Clone este repositório:
   ```bash
   git clone https://github.com/nexsyss-dev/ze-birita-front.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Acesse a pasta do projeto:
   ```bash
   cd ze-birita-front
   ```
4. Execute o projeto:
   ```bash
   npm run dev
   ```

## Sincronização do cardápio

O catálogo consulta uma API publicada como Web App do Google Apps Script. A URL
do documento do Google Sheets (`/spreadsheets/d/.../edit`) não é a URL da API.

1. Publique o Apps Script como Web App e configure-o para retornar um objeto
   JSON com `produtos` e `horarios`. Cada produto contém `id`, `disponivel`
   (`1`/`0` ou `true`/`false`) e `preco` (número ou texto decimal, como
   `"25,50"`). Os horários devem conter exatamente um registo para cada dia:
   ```json
   {
     "produtos": [
       { "id": "1", "disponivel": 1, "preco": "1,00" }
     ],
     "horarios": [
       { "dia": "segunda-feira", "fechado": 0, "abertura": "12:00", "fechamento": "00:00" },
       { "dia": "terca-feira", "fechado": 1, "abertura": "", "fechamento": "" },
       { "dia": "quarta-feira", "fechado": 0, "abertura": "12:00", "fechamento": "00:00" },
       { "dia": "quinta-feira", "fechado": 0, "abertura": "12:00", "fechamento": "00:00" },
       { "dia": "sexta-feira", "fechado": 0, "abertura": "12:00", "fechamento": "00:00" },
       { "dia": "sabado", "fechado": 0, "abertura": "12:00", "fechamento": "00:00" },
       { "dia": "domingo", "fechado": 0, "abertura": "12:00", "fechamento": "00:00" }
     ]
   }
   ```
2. Defina `VITE_SHEETS_API_URL` com a URL `/exec` publicada pelo Apps Script.
   Para desenvolvimento, crie um arquivo `.env` na raiz com:
   ```env
   VITE_SHEETS_API_URL=https://script.google.com/macros/s/ID_DA_IMPLANTACAO/exec
   ```
3. Para produção, configure a mesma variável no ambiente de build da hospedagem
   (por exemplo, nas variáveis de ambiente do Vercel) e faça um novo deploy.

Os produtos só ficam disponíveis para compra após uma sincronização válida.
Fora do horário, o cardápio continua visível, mas novas adições ao carrinho são
bloqueadas; itens já adicionados e o checkout não são afetados. A agenda é
recarregada ao abrir o site, ao voltar à aba e a cada minuto. O cálculo usa o
fuso `Europe/Lisbon`; um fechamento `00:00` após uma abertura posterior à
meia-noite representa o fim daquele dia. Se a sincronização falhar, os últimos
dados carregados podem continuar visíveis, mas novas adições ficam bloqueadas.
Uma sincronização bem-sucedida também atualiza os preços dos itens que já estão
no carrinho.

O endpoint do Apps Script deve agora devolver o objeto combinado acima; a
resposta antiga que era apenas uma lista de produtos já não é suficiente.
