-- Helper to view vote counts without revealing user
create or replace view public.vote_counts as 
select vote_id, option_id, count(*) as votes 
from public.cast_votes 
group by vote_id, option_id;

alter table public.vote_counts owner to postgres; -- ensure access?
grant select on public.vote_counts to authenticated; -- allow users to see counts
