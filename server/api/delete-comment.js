import { defineEventHandler, getQuery } from 'h3';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  const { comment_id, user_id } = getQuery(event);

  if (!comment_id || !user_id) {
    return { error: 'Comment ID and User ID are required' };
  }

  try {
    const { data: existingComment, error: selectError } = await supabase
      .from('comments')
      .select('user_id')
      .eq('id', comment_id)
      .single();

    if (selectError) throw selectError;

    if (existingComment.user_id !== user_id) {
      return { error: 'You are not authorized to delete this comment' };
    }

    const { data, error } = await supabase
      .from('comments')
      .delete()
      .eq('id', comment_id);

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { error: 'Unable to delete comment' };
  }
});
