import {
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILED,
  USER_SIGN_IN,
  USER_SIGN_IN_FAILED,
  USER_SIGN_OUT,
  CLEAR_LOGIN_ERROR,
  UPDATE_USER_WALLET_HISTORY,
  SEND_RESET_EMAIL,
  SEND_RESET_EMAIL_FAILED
} from "../store/types";

import store from '../store/store';
import { supabase, auth as supabaseAuth, db } from '../services/supabase';

export const fetchUser = () => async (dispatch) => {
  dispatch({
    type: FETCH_USER,
    payload: null
  });

  try {
    const { data: { user }, error } = await supabaseAuth.getUser();
    
    if (error) throw error;
    
    if (user) {
      const profile = await db.getProfile(user.id);
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: { ...profile, uid: user.id }
      });
    } else {
      dispatch({
        type: FETCH_USER_FAILED,
        payload: { 
          code: store.getState().languagedata.defaultLanguage.auth_error, 
          message: store.getState().languagedata.defaultLanguage.not_logged_in 
        }
      });
    }
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILED,
      payload: { code: 'auth/error', message: error.message }
    });
  }
};

export const validateReferer = async (referralId) => {
  try {
    const { data, error } = await db.validateReferrer(referralId);
    if (error) throw error;
    return data;
  } catch (error) {
    return { error: error.message };
  }
};

export const checkUserExists = async (data) => {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id')
      .or(`email.eq.${data.email},phone.eq.${data.mobile}`)
      .single();
    
    if (error) throw error;
    
    return { exists: !!users };
  } catch (error) {
    return { error: error.message };
  }
};

export const mainSignUp = async (regData) => {
  try {
    const authData = await supabaseAuth.signUp(regData);
    return { success: true, data: authData };
  } catch (error) {
    return { error: error.message };
  }
};

export const googleLogin = () => async (dispatch) => {
  dispatch({
    type: USER_SIGN_IN,
    payload: null
  });

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });

    if (error) throw error;

    // The user data will be handled by the auth state change listener
  } catch (error) {
    dispatch({
      type: USER_SIGN_IN_FAILED,
      payload: error
    });
  }
};

export const signOff = () => async (dispatch) => {
  try {
    await supabaseAuth.signOut();
    dispatch({
      type: USER_SIGN_OUT,
      payload: null
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = (updateData) => async (dispatch) => {
  try {
    const { user } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { error } = await db.updateProfile(user.id, updateData);
    if (error) throw error;

    dispatch(fetchUser());
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

export const clearLoginError = () => (dispatch) => {
  dispatch({
    type: CLEAR_LOGIN_ERROR,
    payload: null
  });
};

export const sendResetMail = (email) => async (dispatch) => {
  dispatch({
    type: SEND_RESET_EMAIL,
    payload: email
  });
  
  try {
    await supabaseAuth.resetPassword(email);
  } catch (error) {
    dispatch({
      type: SEND_RESET_EMAIL_FAILED,
      payload: error
    });
  }
};

export const verifyEmailPassword = (email, password) => async (dispatch) => {
  dispatch({
    type: USER_SIGN_IN,
    payload: null
  });

  try {
    await supabaseAuth.signIn({ email, password });
    // The user data will be handled by the auth state change listener
  } catch (error) {
    dispatch({
      type: USER_SIGN_IN_FAILED,
      payload: error
    });
  }
};
