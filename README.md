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
