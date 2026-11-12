# RetroPlay Booking — MVP

## O que será construído
Site escuro com neon roxo e verde, sem imagens de IA (apenas ícones Lucide, gradientes e brilhos em CSS), funcionando bem no celular.

**1. Página inicial (/)**
- Topo: logo "RetroPlay" em texto neon + botão "Sou o Dono (Admin)".
- Destaque: "Garanta seu controle, pule a fila", subtítulo e botão "Agendar Agora" (rola até o formulário).
- 3 vantagens com ícones: Escolha o console, Horário marcado, Sem filas.
- Formulário de agendamento em card: Nome do jogador, Console (PS2, PS4, Xbox Series S), Data (calendário), Horário (lista de horários), Horas (1h/2h/3h), resumo e botão "Confirmar via WhatsApp".
- Ao confirmar: valida os campos, salva o agendamento como "Pendente" e abre o WhatsApp (wa.me/5511999999999) com a mensagem formatada.

**2. Painel do dono (/admin)**
- Cards: Total de Agendamentos e Horas Vendidas.
- Lista de agendamentos (tabela no computador, cards no celular): Nome, Console, Data/Horário, Horas, selo de status colorido.
- Botões para avançar o status: Pendente → Confirmado → Jogando → Finalizado (e opção de voltar/cancelar via menu).

## Ponto de atenção
Sem login, qualquer pessoa que descobrir o endereço /admin poderá ver nomes e alterar status. Aceitável para o MVP, como pedido; recomendo adicionar login do dono no próximo passo.

## Detalhes técnicos
- Ativar Lovable Cloud; tabela `bookings` (id, player_name, console, booking_date, booking_time, hours 1-3, status enum, created_at) com GRANTs + RLS.
- Inserção e leitura/atualização via server functions (createServerFn) com validação zod; admin lê/atualiza pelo servidor.
- Rotas: `index.tsx` e `admin.tsx`, cada uma com head() próprio; tokens neon em `styles.css` (oklch), fontes "Press Start 2P" (títulos) + "Space Grotesk" (texto) via link.
- TanStack Query para lista do admin com invalidação após mudar status; toasts com sonner.
- Teste pequeno da regra de horas (1–3) e formatação da mensagem do WhatsApp.
