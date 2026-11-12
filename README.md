# RetroPlay Booking — Sistema de Agendamento para Locadoras de Videogame

MVP de uma plataforma web de agendamento de horários para espaços físicos de jogos, fliperamas modernos e locadoras de videogames retrô (PS2, PS4, Xbox). Desenvolvido durante o bootcamp **Santander - Construa seu primeiro App com IA** (DIO) utilizando **Lovable** e **Lovable Cloud**.

🔗 **Aplicação publicada:** https://retroplay-booking.lovable.app/

---

## 1. A dor escolhida e por que ela vale um negócio
* **A Dor:** Empreendedores que gerenciam espaços físicos de jogos (como locadoras de PS2 retrô, arenas locais ou serviços de "hora na TV") enfrentam desorganização na gestão de tempo e filas de espera. O controle manual no "caderninho" ou por mensagens soltas gera conflitos de horário (*overbooking*), atrasos, clientes frustrados por perderem a viagem e perda de faturamento.
* **Por que vale um negócio:** Automatizar o agendamento garante previsibilidade de caixa para o proprietário, organiza o uso dos consoles e oferece comodidade para o jogador reservar seu horário antes mesmo de sair de casa.

---

## 2. Tamanho de Mercado (TAM, SAM e SOM)
* **TAM (*Total Addressable Market*):** Mercado nacional de entretenimento presencial e serviços voltados ao público geek/gamer no Brasil.
* **SAM (*Serviceable Available Market*):** Pequenos comerciantes, espaços de jogos locais, fliperamas e locadoras retrô espalhados pelas cidades brasileiras.
* **SOM (*Serviceable Obtainable Market*):** De 1 a 5 proprietários de espaços de locação de games (*early adopters*) alcançados diretamente via redes sociais (como X/Twitter e Instagram) dispostos a testar o MVP gratuitamente para organizar suas filas.

---

## 3. Business Model Canvas
* **Segmento de Clientes:** Donos de espaços físicos de jogos/locadoras (B2B) e Gamers/Jovens da comunidade local (B2C).
* **Proposta de Valor:** Fim das filas e do controle manual em papel. O cliente agenda o console e o horário pelo celular; o proprietário controla as reservas e o total de horas vendidas em um único painel.
* **Canais:** Redes sociais (X/Twitter, Instagram), WhatsApp e indicação direta na comunidade gamer local.
* **Relacionamento:** Autoatendimento rápido para o jogador via aplicação web e suporte consultivo direto para o proprietário do espaço.
* **Fontes de Receita:** Gratuito na fase inicial de validação do MVP. Modelo futuro de monetização via assinatura SaaS acessível para o dono do estabelecimento.
* **Recursos Chave:** Aplicação Web responsiva, Banco de Dados em nuvem (Lovable Cloud) e integração de encaminhamento via WhatsApp.
* **Atividades Chave:** Desenvolvimento contínuo da plataforma, manutenção da infraestrutura e acompanhamento dos primeiros estabelecimentos parceiros.
* **Parcerias Principais:** Proprietários de barbearias, tabacarias e espaços de convivência que possuem área de games, além de criadores de conteúdo de *retro gaming*.
* **Estrutura de Custos:** Hospedagem da aplicação, armazenamento em banco de dados e tempo de desenvolvimento.

---

## 4. A tese que o MVP testa e o que ficou manual de propósito
* **A Tese:** Jogadores preferem reservar seu console antecipadamente por um link rápido em vez de ir ao local sem garantia de vaga; proprietários preferem visualizar e atualizar o status das máquinas em um painel digital a anotar no papel.
* **O que ficou manual de propósito:**
  * **Pagamento:** Não há gateway de pagamento (Stripe ou Pix automático) integrado nesta versão[cite: 6]. Ao confirmar o formulário, o pedido é registrado no banco e redirecionado ao WhatsApp do proprietário, que confirma a reserva e recebe o pagamento manualmente (Pix ou dinheiro no balcão).
  * **Controle de tempo físico:** O controle de ligar/desligar a TV ou console segue sob operação manual do proprietário, guiado pelos status do painel (`Pendente → Confirmado → Jogando → Finalizado`).
  * **Autenticação administrativa:** A rota `/admin` permanece aberta nesta etapa para agilizar os testes de validação do MVP, tendo como próximo passo técnico a implementação de login para o proprietário.

---

## 5. Engenharia de Prompt e Iterações

### Mega Prompt Inicial (Modo Plan)
```text
Atue como um Desenvolvedor Frontend Sênior e UI/UX Designer. Quero criar um MVP completo de uma plataforma web chamada "RetroPlay Booking", um sistema de agendamento de horários para uma locadora física de videogames (como um fliperama moderno focado em PS2, PS4 e Xbox).

REGRAS ESTRITAS PARA ECONOMIZAR CRÉDITOS:
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
- Ação do botão: Formatar os dados do formulário e redirecionar para um link `wa.me` genérico.
- SALVAR esses dados no banco de dados do Lovable Cloud (tabela `bookings` com status inicial "Pendente").

3. PAINEL DE ADMINISTRAÇÃO (Visão do Dono)
- Acessível por um botão/rota escondida (não precisa de sistema de login complexo agora, apenas a visualização).
- Um Dashboard mostrando:
  - Cards de resumo: Total de Agendamentos (Leads), Horas Vendidas.
  - Uma tabela ou lista de cards com todos os agendamentos salvos no Lovable Cloud, mostrando: Nome, Console, Horário, Horas, e um Badge de Status ("Pendente", "Confirmado", "Jogando", "Finalizado").
  - Botões para o dono alterar o status do agendamento manualmente (ex: de Pendente para Confirmado).

Crie a estrutura completa, conecte os formulários ao Lovable Cloud para o armazenamento de dados e garanta que o design responsivo funcione perfeitamente no celular.
