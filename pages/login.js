import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Copyright } from "../components/Copyright";
import { LoadingButton } from '@mui/lab';
import { SnackBar } from '../components/SnackBar';
import Axios from "axios";
import { useSnackbar } from 'notistack';


export default function SignIn() {
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = React.useState(false)
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "",
    message: null
  })

  const handleSubmit = async (event) => {
    setIsLoading(true)
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const host = process.env.API_URL;
      const res = await Axios.post(`${host}/auth/login`, Object.fromEntries(data.entries()), { withCredentials: true })
      if (res.data) {
        enqueueSnackbar("LoggedIn Successfully!", { variant: "success", translate: "yes" })
        window.location.replace("/dashboard")
      }
    } catch (error) {
      console.log(error);
      const li = error.response?.data?.errors?.map((msg, i) => <li key={i}>{msg.message}</li>)
      setSnackBar({ severity: "error", message: <>{li}</>, open: true })
    }
    setIsLoading(false)
  };

  return (
    <Container component="main" maxWidth="xs">
      <SnackBar open={snackBar.open} setOpen={setSnackBar} severity={snackBar.severity} message={snackBar.message} />
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={isLoading}
          >
            Sign In
          </LoadingButton>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}