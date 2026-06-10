
DO $$ BEGIN
  CREATE TYPE public.payment_method AS ENUM ('bank_transfer','upi','cheque');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE public.payment_requests
  ADD COLUMN IF NOT EXISTS payment_method public.payment_method NOT NULL DEFAULT 'upi',
  ADD COLUMN IF NOT EXISTS package_id text,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS payment_date date,
  ADD COLUMN IF NOT EXISTS bank_name text,
  ADD COLUMN IF NOT EXISTS cheque_number text,
  ADD COLUMN IF NOT EXISTS cheque_date date;

CREATE UNIQUE INDEX IF NOT EXISTS payment_requests_transaction_id_unique
  ON public.payment_requests (lower(transaction_id));
