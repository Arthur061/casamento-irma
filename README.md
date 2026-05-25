
---

```markdown
# 💍 Lista de Presentes - Casamento Letícia & Diogo

Uma aplicação web interativa desenvolvida em React para gerir a lista de presentes de um casamento. Esta plataforma permite aos convidados visualizar opções de presentes, confirmar compras feitas em lojas externas ou optar por presentear os noivos diretamente através de transferência PIX (com geração dinâmica de QR Code).

## ✨ Funcionalidades

- **Catálogo de Presentes:** Listagem de produtos com imagens, descrições e múltiplas opções de preços e lojas.
- **Integração PIX Dinâmica:** Geração automática de *Payload* PIX (Copia e Cola) e QR Code para cada presente, com base no valor selecionado.
- **Confirmação de Compra:** Os convidados podem registar o seu nome e deixar uma mensagem aos noivos após a compra, atualizando o estado do presente para "Reservado" ou "Esgotado".
- **Gestão de Estado em Tempo Real:** Integração com base de dados Supabase para manter a lista de presentes sempre atualizada para todos os utilizadores.
- **Painel de Administração (Oculto):** Geração de um relatório em PDF com o resumo de todos os presentes arrecadados, mensagens dos convidados e o valor total confirmado.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/)
- **Ferramenta de Build:** [Vite](https://vitejs.dev/)
- **Base de Dados / BaaS:** [Supabase](https://supabase.com/)
- **Geração de PDF:** `jspdf` e `jspdf-autotable`
- **Geração de QR Code:** `qrcode.react`
- **Estilização:** CSS Puro (com variáveis globais e flexbox/grid)

## 🚀 Como correr o projeto localmente

### Pré-requisitos

Certifica-te de que tens o [Node.js](https://nodejs.org/) instalado na tua máquina.

### Instalação

1. Clona este repositório:
   ```bash
   git clone [https://github.com/Arthur061/casamento-irma.git](https://github.com/Arthur061/casamento-irma.git)

```

2. Entra no diretório do projeto:
```bash
cd casamento-irma

```


3. Instala as dependências:
```bash
npm install

```



### Configuração das Variáveis de Ambiente

Cria um ficheiro chamado `.env` na raiz do projeto e adiciona as tuas credenciais do Supabase:

```env
VITE_SUPABASE_URL=tua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=tua_chave_anonima_do_supabase_aqui

```

### Executar a aplicação

Inicia o servidor de desenvolvimento do Vite:

```bash
npm run dev

```

A aplicação estará disponível no teu navegador, geralmente em `http://localhost:5173`.

## 🗄️ Estrutura da Base de Dados (Supabase)

A aplicação espera uma tabela chamada `presentes` com a seguinte estrutura principal:

* `id` (int)
* `nome` (text)
* `descricao` (text)
* `imagem_url` (text)
* `preco` (numeric)
* `status` (boolean) - Indica se o item está visível/ativo.
* `opcoes` (jsonb) - Array de objetos contendo as variações do presente (nome, link, preco, reservado, comprado_por, mensagem, etc).
* `pix_chave` (text) - Chave PIX específica do item (opcional).

## 👨‍💻 Desenvolvido por

**Arthur Alves**

* [LinkedIn](https://www.linkedin.com/in/arthur-alves-600aa31b0/)
* [GitHub](https://github.com/Arthur061)

*Aceito encomendas de projetos web e sistemas.*

```

```
