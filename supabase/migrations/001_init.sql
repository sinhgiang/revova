-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Stripe connected accounts
create table public.stripe_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_account_id text unique not null,
  access_token text not null,
  business_name text,
  email text,
  connected_at timestamptz default now()
);

-- Failed payments tracker
create table public.failed_payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_account_id text not null,
  stripe_invoice_id text unique not null,
  customer_email text not null,
  customer_name text,
  amount integer not null,
  currency text not null default 'usd',
  decline_code text,
  status text not null default 'pending'
    check (status in ('pending','email_sent','recovered','failed')),
  stripe_customer_id text not null,
  stripe_payment_intent_id text,
  country text,
  emails_sent integer not null default 0,
  last_email_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz default now()
);

-- Email send history
create table public.email_logs (
  id uuid primary key default uuid_generate_v4(),
  failed_payment_id uuid references public.failed_payments(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  email_type text not null,
  recipient_email text not null,
  subject text not null,
  sent_at timestamptz default now(),
  opened_at timestamptz,
  clicked_at timestamptz
);

-- Row Level Security
alter table public.stripe_accounts enable row level security;
alter table public.failed_payments enable row level security;
alter table public.email_logs enable row level security;

create policy "Users own their stripe accounts" on public.stripe_accounts
  for all using (auth.uid() = user_id);

create policy "Users own their failed payments" on public.failed_payments
  for all using (auth.uid() = user_id);

create policy "Users own their email logs" on public.email_logs
  for all using (auth.uid() = user_id);
