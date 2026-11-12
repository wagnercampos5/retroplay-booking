CREATE TYPE public.booking_status AS ENUM ('Pendente','Confirmado','Jogando','Finalizado');
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL CHECK (char_length(player_name) BETWEEN 1 AND 80),
  console text NOT NULL CHECK (console IN ('PlayStation 2','PlayStation 4','Xbox Series S')),
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  hours int NOT NULL CHECK (hours BETWEEN 1 AND 3),
  status public.booking_status NOT NULL DEFAULT 'Pendente',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;