import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveTelegramUser() {
  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user;

  if (!user) return;

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        telegram_id: user.id, // <-- ЧИСЛО
        username: user.username ?? null,
      },
      { onConflict: 'telegram_id' }
    );

  if (error) {
    console.error('Supabase error:', error);
  }
}

export async function getCurrentUser() {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

  if (!tgUser) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, telegram_id')
    .eq('telegram_id', tgUser.id)
    .single();

  if (error) {
    console.error('[getCurrentUser] error', error);
    return null;
  }

  return data;
}
