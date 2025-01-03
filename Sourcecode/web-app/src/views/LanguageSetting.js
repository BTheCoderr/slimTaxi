import React, { useState, useEffect } from 'react';
import { supabase } from '../config/SupabaseConfig';
import CircularLoading from "../components/CircularLoading";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { MAIN_COLOR, SECONDORY_COLOR } from "../common/sharedFunctions";

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: MAIN_COLOR,
    borderRadius: "8px",
    padding: '20px'
  },
  title: {
    color: '#fff',
    marginBottom: '20px'
  },
  textField: {
    marginBottom: '20px',
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#fff"
      },
      "&:hover fieldset": {
        borderColor: "#fff"
      },
      "&.Mui-focused fieldset": {
        borderColor: SECONDORY_COLOR
      }
    },
    "& .MuiInputLabel-root": {
      color: "#fff"
    },
    "& .MuiOutlinedInput-input": {
      color: "#fff"
    }
  },
  saveButton: {
    backgroundColor: SECONDORY_COLOR,
    color: '#fff',
    '&:hover': {
      backgroundColor: SECONDORY_COLOR
    }
  }
}));

export default function LanguageSetting() {
  const { t } = useTranslation();
  const classes = useStyles();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchLanguageSettings = async () => {
      try {
        const { data: langSettings, error } = await supabase
          .from('language_settings')
          .select('*')
          .single();

        if (error) throw error;
        setData(langSettings);
      } catch (error) {
        console.error('Error fetching language settings:', error);
      }
    };

    fetchLanguageSettings();
  }, []);

  const handleSwitchChange = async (e) => {
    try {
      const newData = { ...data, [e.target.name]: e.target.checked };
      setData(newData);
      
      const { error } = await supabase
        .from('language_settings')
        .update(newData)
        .eq('id', data.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating language settings:', error);
    }
  };

  const handleTextChange = async (e) => {
    try {
      const newData = { ...data, [e.target.name]: e.target.value };
      setData(newData);
      
      const { error } = await supabase
        .from('language_settings')
        .update(newData)
        .eq('id', data.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating language settings:', error);
    }
  };

  return data ? (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12}>
        <Typography variant="h5" className={classes.title}>
          {t('language_settings')}
        </Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControl component="fieldset">
          <FormLabel component="legend" style={{ color: '#fff' }}>
            {t('language_options')}
          </FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={data.useGoogleTranslate || false}
                onChange={handleSwitchChange}
                name="useGoogleTranslate"
                color="secondary"
              />
            }
            label={t('use_google_translate')}
            style={{ color: '#fff' }}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label={t('default_language')}
          name="defaultLanguage"
          value={data.defaultLanguage || ''}
          onChange={handleTextChange}
          className={classes.textField}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          className={classes.saveButton}
          onClick={() => {}}
        >
          {t('save')}
        </Button>
      </Grid>
    </Grid>
  ) : (
    <CircularLoading />
  );
}
