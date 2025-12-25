import { supabase } from '@/integrations/supabase/client';

/**
 * Track when a user views a resource
 */
export const trackResourceView = async (userId: string, resourceId: string) => {
  try {
    // Insert resource view
    await supabase
      .from('resource_views')
      .insert({ user_id: userId, resource_id: resourceId });
    
    // Update activity log for streak tracking (upsert to handle unique constraint)
    await supabase
      .from('activity_logs')
      .upsert(
        { user_id: userId, activity_type: 'resource_view', activity_date: new Date().toISOString().split('T')[0] },
        { onConflict: 'user_id,activity_date' }
      );
      
    console.log('Resource view tracked successfully');
  } catch (error) {
    console.error('Error tracking resource view:', error);
  }
};

/**
 * Track when a user explores a subject
 */
export const trackSubjectExploration = async (userId: string, subject: string) => {
  try {
    // Insert subject exploration
    await supabase
      .from('subject_explorations')
      .insert({ user_id: userId, subject });
    
    // Update activity log for streak tracking
    await supabase
      .from('activity_logs')
      .upsert(
        { user_id: userId, activity_type: 'subject_explore', activity_date: new Date().toISOString().split('T')[0] },
        { onConflict: 'user_id,activity_date' }
      );
      
    console.log('Subject exploration tracked successfully');
  } catch (error) {
    console.error('Error tracking subject exploration:', error);
  }
};

/**
 * Track when a user completes a quiz
 */
export const trackQuizCompletion = async (userId: string) => {
  try {
    // Update activity log for streak tracking
    await supabase
      .from('activity_logs')
      .upsert(
        { user_id: userId, activity_type: 'quiz_complete', activity_date: new Date().toISOString().split('T')[0] },
        { onConflict: 'user_id,activity_date' }
      );
      
    console.log('Quiz completion tracked for streak');
  } catch (error) {
    console.error('Error tracking quiz completion:', error);
  }
};
