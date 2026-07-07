create table public.funnel_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  session_id text,
  share_id text,
  score_band text,
  relationship_type text,
  source text,
  placement text,
  cta_label text,
  created_at timestamptz not null default now()
);

create index funnel_events_created_at_idx on public.funnel_events (created_at desc);
create index funnel_events_name_created_idx on public.funnel_events (event_name, created_at desc);
create index funnel_events_score_band_idx on public.funnel_events (score_band, created_at desc)
  where score_band is not null;
create index funnel_events_share_id_idx on public.funnel_events (share_id, created_at desc)
  where share_id is not null;

alter table public.funnel_events enable row level security;

revoke all on public.funnel_events from anon, authenticated;
grant all on public.funnel_events to service_role;
