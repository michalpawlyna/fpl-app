import { defineEventHandler, readBody } from 'h3';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { player_id, user_id, comment } = body;

  if (!player_id || !user_id || !comment) {
    return { error: 'Player ID, User ID, and comment are required' };
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ player_id, user_id, comment }]);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { error: 'Unable to add comment' };
  }
});
