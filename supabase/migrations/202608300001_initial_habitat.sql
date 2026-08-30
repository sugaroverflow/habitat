create extension if not exists "pgcrypto";

create type public.item_status as enum (
  'saved', 'considering', 'shortlisted', 'favourite', 'ordered',
  'shipped', 'arrived', 'returned', 'rejected'
);

create type public.measurement_type as enum (
  'wall', 'room', 'door', 'window', 'radiator', 'furniture', 'clearance', 'custom'
);

create type public.review_status as enum (
  'pending', 'reviewed', 'approved', 'rejected'
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Habitat',
  home_nickname text not null default 'Clover 29',
  slug text not null unique default 'clover-29',
  design_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  public_key text not null,
  name text not null,
  kind text not null,
  notes text,
  palette jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique(project_id, public_key)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  kind text not null check (kind in ('room_photo', 'floorplan', 'screenshot', 'inspiration', 'product')),
  storage_path text not null,
  generated_filename text not null,
  mime_type text not null,
  metadata_stripped boolean not null default false,
  visual_review_status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (storage_path !~* '(flat|unit)[-_ ]?[0-9]+'),
  check (generated_filename !~* '(flat|unit)[-_ ]?[0-9]+')
);

create table public.needs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  name text not null,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null,
  requirements jsonb not null default '[]'::jsonb,
  maximum_dimensions jsonb,
  budget jsonb,
  blocking_measurement_ids uuid[] not null default '{}',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  name text not null,
  brand text,
  category text not null,
  source_url text,
  price jsonb,
  dimensions jsonb,
  colour_material text,
  ownership_status text not null check (ownership_status in ('not_owned', 'owned')),
  status public.item_status not null default 'saved',
  user_comments text,
  assistant_comments text,
  pros jsonb not null default '[]'::jsonb,
  cons jsonb not null default '[]'::jsonb,
  intended_location text,
  added_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.need_candidates (
  need_id uuid not null references public.needs(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  rank integer,
  primary key (need_id, item_id)
);

create table public.measurements (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  label text not null,
  type public.measurement_type not null,
  value numeric,
  unit text not null check (unit in ('cm', 'mm', 'm', 'in', 'ft')),
  source text not null,
  confidence text not null check (confidence in ('measured', 'approximate', 'needed')),
  notes text,
  created_at timestamptz not null default now()
);

create table public.inspiration (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  asset_id uuid references public.assets(id) on delete set null,
  source text not null,
  source_url text,
  title text not null,
  tags jsonb not null default '[]'::jsonb,
  notes text,
  what_i_like jsonb not null default '[]'::jsonb,
  not_necessarily jsonb not null default '[]'::jsonb,
  status text not null default 'inbox',
  created_at timestamptz not null default now()
);

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  topic text not null,
  status text not null,
  decision text not null,
  reasoning text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  retailer text not null,
  order_date date,
  delivery_date date,
  status text not null,
  tracking_url text,
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_conversation_id text,
  title text not null,
  import_status public.review_status not null default 'pending',
  imported_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  source_message_id text,
  role text not null check (role in ('user', 'assistant', 'system')),
  sanitized_content text not null,
  redacted boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  conversation_id uuid references public.conversations(id) on delete set null,
  source_message_id text,
  source_title text,
  sanitized_excerpt text,
  imported_at timestamptz not null default now()
);

create table public.redactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  source_id uuid references public.sources(id) on delete cascade,
  redaction_type text not null check (
    redaction_type in (
      'address', 'postcode', 'unit', 'coordinates', 'email', 'phone',
      'order_number', 'tracking_number', 'metadata', 'visible_text'
    )
  ),
  redacted boolean not null default true,
  created_at timestamptz not null default now(),
  check (redacted = true)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  unique(project_id, name)
);

create table public.privacy_check_results (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  check_name text not null,
  passed boolean not null,
  checked_at timestamptz not null default now(),
  details text
);

alter table public.projects enable row level security;
alter table public.rooms enable row level security;
alter table public.assets enable row level security;
alter table public.needs enable row level security;
alter table public.items enable row level security;
alter table public.need_candidates enable row level security;
alter table public.measurements enable row level security;
alter table public.inspiration enable row level security;
alter table public.decisions enable row level security;
alter table public.orders enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.sources enable row level security;
alter table public.redactions enable row level security;
alter table public.tags enable row level security;
alter table public.privacy_check_results enable row level security;

comment on table public.messages is
  'Sanitized archive only. Raw imported message content must never be inserted.';
comment on table public.redactions is
  'Records that a redaction occurred. This table intentionally has no original_value column.';
comment on column public.orders.tracking_url is
  'Server-only planning field. Exclude from public demo queries and recording data.';
