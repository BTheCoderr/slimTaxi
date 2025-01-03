import { supabase } from '../../common/services/supabase';
import { setSettings, setLoading, setError } from '../reducers/settingsReducer';

export const fetchSettings = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error) throw error;

    dispatch(setSettings(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const updateSettings = (settings) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const { data, error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', 1) // Assuming there's only one settings record
      .single();

    if (error) throw error;

    dispatch(setSettings(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
}; 