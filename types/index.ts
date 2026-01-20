
export type AppRole = 'president' | 'treasurer' | 'member';

export interface Profile {
    id: string;
    role: AppRole;
    full_name: string | null;
    avatar_url: string | null;
    email: string | null;
    nickname: string | null;
    current_balance: number;
    created_at: string;
}
