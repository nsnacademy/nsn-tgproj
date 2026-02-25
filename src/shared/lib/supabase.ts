import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* === TELEGRAM USER === */
export async function saveTelegramUser() {
  const webApp = window.Telegram?.WebApp;
  const user = webApp?.initDataUnsafe?.user;

  if (!user) return;

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        telegram_id: user.id,
        username: user.username ?? null,
      },
      { onConflict: 'telegram_id' }
    );

  if (error) {
    console.error('[saveTelegramUser]', error);
  }
}

export async function getCurrentUser() {
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!tgUser) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, telegram_id')
    .eq('telegram_id', tgUser.id)
    .single();

  if (error) {
    console.error('[getCurrentUser]', error);
    return null;
  }

  return data;
}

export async function checkIsCreator(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('challenges')
    .select('id')
    .eq('creator_id', userId)
    .limit(1);

  if (error) {
    console.error('[checkIsCreator]', error);
    return false;
  }

  return (data?.length ?? 0) > 0;
}

// Добавьте эти функции в ваш существующий файл supabase.ts

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) return null;
  return data;
}

export async function getUserActivity(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabase
    .from('user_daily_activity')
    .select('date, completed')
    .eq('user_id', userId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: false });
    
  if (error) return [];
  return data || [];
}

export async function getUserRating(userId: string) {
  // Это пример - адаптируйте под вашу структуру БД
  const { data, error } = await supabase
    .rpc('get_user_rating', { p_user_id: userId });
    
  if (error) return null;
  return data;
}