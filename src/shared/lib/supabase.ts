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
