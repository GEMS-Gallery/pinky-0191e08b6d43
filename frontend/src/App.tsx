import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, Button, TextField, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useForm, Controller } from 'react-hook-form';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF69B4',
    },
    secondary: {
      main: '#8B008B',
    },
    background: {
      default: '#FFC0CB',
    },
  },
});

type CalculationResult = {
  operation: string;
  result: number;
};

function App() {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<CalculationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const result = await backend.getHistory();
      setHistory(result);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleButtonClick = (value: string) => {
    setDisplay((prev) => (prev === '0' ? value : prev + value));
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleCalculate = async () => {
    try {
      setLoading(true);
      const [x, op, y] = display.split(' ');
      const result = await backend.calculate(op, parseFloat(x), parseFloat(y));
      if ('ok' in result) {
        setDisplay(result.ok.toString());
        fetchHistory();
      } else {
        setDisplay('Error: ' + result.err);
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: { email: string }) => {
    try {
      setLoading(true);
      const subject = 'Calculator Results';
      const body = `Here are your recent calculations:\n${history
        .map((calc) => `${calc.operation} = ${calc.result}`)
        .join('\n')}`;
      const result = await backend.sendEmail(data.email, subject, body);
      if ('ok' in result) {
        alert('Email sent successfully!');
        reset();
      } else {
        alert('Failed to send email: ' + result.err);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      alert('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <TextField
                fullWidth
                variant="outlined"
                value={display}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={1}>
                {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map((btn) => (
                  <Grid item xs={3} key={btn}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => (btn === '=' ? handleCalculate() : handleButtonClick(btn))}
                      disabled={loading}
                    >
                      {btn}
                    </Button>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button fullWidth variant="outlined" onClick={handleClear} disabled={loading}>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Calculation History
              </Typography>
              <List>
                {history.map((calc, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${calc.operation} = ${calc.result}`} />
                  </ListItem>
                ))}
              </List>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      variant="outlined"
                      error={!!error}
                      helperText={error?.message}
                      sx={{ mb: 2 }}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<SendIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send History'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
