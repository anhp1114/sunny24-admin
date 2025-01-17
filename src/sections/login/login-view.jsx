/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useRouter } from 'src/routes/hooks';
import axios from 'axios';
import _ from 'lodash';
import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView(props) {
  const {onLogin} = props;
  const theme = useTheme();

  const router = useRouter();

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  })

  const login = async () => {
    try {
      const data = {
        username: loginData.username,
        password: loginData.password
      }
        let loginResult = await axios.post('https://sunny24.vercel.app/admin/login', data);
        loginResult = loginResult?.data;
        if (loginResult?.code === 1000) {
          onLogin(loginResult.token)
          router.push('/');
        } else {
          setOpenToast(true)
        }
    } catch (error) {
        console.log(`ERROR when call get list homestay ${error.message} -- ${JSON.stringify(error)}`);
        setOpenToast(true)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async () => {
    if(!_.isEmpty(loginData.username) && !_.isEmpty(loginData.password)) await login()
  };

  const [openToast, setOpenToast] = useState(false);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenToast(false);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="username" label="Tên tài khoản" value={loginData.username} onChange={handleChange}/>

        <TextField
          name="password"
          label="Mật khẩu"
          value={loginData.password}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Đăng nhập
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Đăng nhập</Typography>

          <Typography variant="body2" sx={{ mt: 0, mb: 0 }}>
            {/* Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link> */}
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button> */}
          </Stack>

          <Divider sx={{ my: 3 }}>
            {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography> */}
          </Divider>

          {renderForm}
        </Card>
      </Stack>

      <Snackbar 
      open={openToast} 
      autoHideDuration={3000} 
      onClose={handleCloseToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
          Đăng nhập thất bại! Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.
        </Alert>
      </Snackbar>
    </Box>
  );
}

LoginView.propTypes = {
  onLogin: PropTypes.func,
};
