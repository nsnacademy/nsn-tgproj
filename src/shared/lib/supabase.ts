import { createClient } from '@supabase/supabase-js';
import { tg } from './telegram';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function saveTelegramUser() {
  if (!tg?.initDataUnsafe?.user) return;

  const user = tg.initDataUnsafe.user;

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        telegram_id: user.id,
        username: user.username,
      },
      { onConflict: 'telegram_id' }
    );

  if (error) {
    console.error('Supabase error:', error);
  }
}