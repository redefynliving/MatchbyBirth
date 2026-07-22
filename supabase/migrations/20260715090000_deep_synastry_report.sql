alter table public.purchases
  add column if not exists report_type text not null default 'standard';

alter table public.purchases
  drop constraint if exists purchases_report_type_check;

alter table public.purchases
  add constraint purchases_report_type_check
  check (report_type in ('standard', 'deep_synastry'));
