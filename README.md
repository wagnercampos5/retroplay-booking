# Retroplay Booking

Atue como um Desenvolvedor Frontend Sênior e UI/UX Designer. Quero criar um MVP completo de uma plataforma web chamada "RetroPlay Booking", um sistema de agendamento de horários para uma locadora física de videogames (como um fliperama moderno focado em PS2, PS4 e Xbox).

REGRAS ESTritas PARA ECONOMIZAR CRÉDITOS:
1. NÃO gere nenhuma imagem por IA. Use APENAS ícones da biblioteca `lucide-react` e estilização CSS (gradientes, sombras) para a parte visual.
2. Crie a estrutura de dados usando o backend do Lovable Cloud.
3. Use Tailwind CSS com um tema escuro (Dark Mode), com detalhes em neon roxo e verde para dar uma vibe "Gamer/Retrô".

A aplicação deve conter as seguintes funcionalidades, todas na mesma SPA (Single Page Application) com navegação fluida:

1. LANDING PAGE (Visão do Cliente)
- Header com o logo (em texto) e botão "Sou o Dono (Admin)".
- Hero Section com título "Garanta seu controle, pule a fila", subtítulo "Agende sua hora na TV e venha jogar sem estresse", e um CTA "Agendar Agora".
- Seção de Features simples usando ícones Lucide (Ex: Escolha o console, Horário marcado, Sem filas).

2. FORMULÁRIO DE AGENDAMENTO (Onde o usuário monta o plano)
- Um formulário interativo (Card) com os seguintes campos:
  - Nome do Jogador.
  - Seleção de Console (Dropdown: PlayStation 2, PlayStation 4, Xbox Series S).
  - Data e Horário.
  - Quantidade de horas (1h, 2h, 3h).
- Ao final, um botão "Confirmar via WhatsApp" (com ícone do WhatsApp).
- Ação do botão: Formatar os dados do formulário e redirecionar para um link `wa.me` genérico (ex: https://wa.me/5511999999999?text=Olá, quero agendar: [Dados do Formulário]).
- SALVAR esses dados no banco de dados do Lovable Cloud (tabela `bookings` com status inicial "Pendente").

3. PAINEL DE ADMINISTRAÇÃO (Visão do Dono)
- Acessível por um botão/rota escondida (não precisa de sistema de login complexo agora, apenas a visualização).
- Um Dashboard mostrando:
  - Cards de resumo: Total de Agendamentos (Leads), Horas Vendidas.
  - Uma tabela ou lista de cards com todos os agendamentos salvos no Lovable Cloud, mostrando: Nome, Console, Horário, Horas, e um Badge de Status ("Pendente", "Confirmado", "Jogando", "Finalizado").
  - Botões para o dono alterar o status do agendamento manualmente (ex: de Pendente para Confirmado).

Crie a estrutura completa, conecte os formulários ao Lovable Cloud para o armazenamento de dados e garanta que o design responsivo funcione perfeitamente no celular.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://retroplay-booking.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7b3a994d-42d6-495b-8ca8-07ef4f4952c1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
