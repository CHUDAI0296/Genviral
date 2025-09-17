-- Create user_credits table to track user credits
create table if not exists user_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  credits integer default 3 not null, -- New users get 3 free credits
  total_purchased integer default 0 not null,
  total_used integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(user_id)
);

-- Create payments table to track purchases
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_payment_intent_id text unique not null,
  amount integer not null, -- Amount in cents
  credits_purchased integer not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create video_generations table to track usage
create table if not exists video_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic text not null,
  video_url text,
  credits_used integer default 1 not null,
  status text not null default 'pending', -- pending, completed, failed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table user_credits enable row level security;
alter table payments enable row level security;
alter table video_generations enable row level security;

-- Create policies
create policy "Users can view their own credits" on user_credits
  for select using (auth.uid() = user_id);

create policy "Users can update their own credits" on user_credits
  for update using (auth.uid() = user_id);

create policy "Users can view their own payments" on payments
  for select using (auth.uid() = user_id);

create policy "Users can view their own video generations" on video_generations
  for select using (auth.uid() = user_id);

create policy "Users can insert their own video generations" on video_generations
  for insert with check (auth.uid() = user_id);

-- Create function to automatically create user credits on signup
create or replace function handle_new_user_credits()
returns trigger as $$
begin
  insert into user_credits (user_id, credits)
  values (new.id, 3); -- 3 free credits for new users
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to run the function after user signup
create trigger on_auth_user_created_credits
  after insert on auth.users
  for each row execute procedure handle_new_user_credits();

-- Create function to update user credits after payment
create or replace function add_credits_after_payment(
  p_user_id uuid,
  p_credits integer
)
returns void as $$
begin
  update user_credits
  set
    credits = credits + p_credits,
    total_purchased = total_purchased + p_credits,
    updated_at = now()
  where user_id = p_user_id;

  -- Create record if it doesn't exist
  if not found then
    insert into user_credits (user_id, credits, total_purchased)
    values (p_user_id, p_credits, p_credits);
  end if;
end;
$$ language plpgsql security definer;

-- Create function to deduct credits for video generation
create or replace function use_credit_for_generation(
  p_user_id uuid,
  p_generation_id uuid
)
returns boolean as $$
declare
  current_credits integer;
begin
  -- Get current credits
  select credits into current_credits
  from user_credits
  where user_id = p_user_id;

  -- Check if user has enough credits
  if current_credits >= 1 then
    -- Deduct credit
    update user_credits
    set
      credits = credits - 1,
      total_used = total_used + 1,
      updated_at = now()
    where user_id = p_user_id;

    -- Update generation record
    update video_generations
    set credits_used = 1
    where id = p_generation_id and user_id = p_user_id;

    return true;
  else
    return false;
  end if;
end;
$$ language plpgsql security definer;