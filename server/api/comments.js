import { defineEventHandler, getQuery } from 'h3';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default defineEventHandler(async (event) => {
  const playerId = getQuery(event).player_id;

  if (!playerId) {
    return { error: 'Player ID is required' };
  }

  try {
    const { data, error } = await supabase
  .from('comments')
  .select('id, comment, created_at, user:profiles(id, username, avatar_url)')
  .eq('player_id', playerId)
  .order('created_at', { ascending: false });

    if (error) throw error;

    const supabaseStorageUrl = `${supabaseUrl}/storage/v1/object/public/avatars`;

    const commentsWithFullAvatarUrls = data.map(comment => ({
      ...comment,
      user: {
        ...comment.user,
        avatar_url: comment.user.avatar_url ? `${supabaseStorageUrl}/${comment.user.avatar_url}` : null
      }
    }));

    return commentsWithFullAvatarUrls;
  } catch (error) {
    console.error(error);
    return { error: 'Unable to fetch comments' };
  }
});