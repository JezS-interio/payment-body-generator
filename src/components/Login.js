import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box, TextField, Button, Typography, Alert, CircularProgress, InputAdornment
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#080810", borderRadius: 0,
      "& fieldset": { borderColor: "#a78bfa2a" },
      "&:hover fieldset": { borderColor: "#a78bfa88" },
      "&.Mui-focused fieldset": { borderColor: "#fbbf24", boxShadow: "0 0 0 1px #fbbf2422" },
    },
    "& .MuiInputLabel-root": { color: "#c4b5fd", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#fbbf24" },
    "& input": { color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 },
  };

  return (
    <Box sx={{
      minHeight: "100vh", bgcolor: "#06060e",
      backgroundImage: "linear-gradient(#a78bfa07 1px, transparent 1px), linear-gradient(90deg, #a78bfa07 1px, transparent 1px)",
      backgroundSize: "48px 48px",
      display: "flex", alignItems: "center", justifyContent: "center", p: 2
    }}>
      <Box sx={{ width: "100%", maxWidth: 380 }}>

        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
          <img src="/s-interio-logo.webp" alt="S-Interio" style={{ height: 40, objectFit: "contain" }} />
        </Box>

        {/* Card */}
        <Box sx={{ bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", p: 4 }}>
          <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: "#e2e8f0", fontSize: 20, letterSpacing: -0.5, mb: 4 }}>
            Sign in
          </Typography>


          <form onSubmit={handleSubmit} autoComplete="off">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required fullWidth autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineIcon sx={{ color: "#a78bfa55", fontSize: 18 }} />
                    </InputAdornment>
                  )
                }}
                sx={inputSx}
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required fullWidth autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#a78bfa55", fontSize: 18 }} />
                    </InputAdornment>
                  )
                }}
                sx={inputSx}
              />

              {error && (
                <Alert severity="error" sx={{ bgcolor: "#08040a", color: "#f87171", borderLeft: "2px solid #ef4444", borderRadius: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  mt: 1, fontWeight: 700, fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
                  fontFamily: "'Space Grotesk', sans-serif", background: "transparent", color: "#a78bfa",
                  border: "1px solid #a78bfa55", borderRadius: 0, py: 1.5,
                  boxShadow: "0 0 12px #a78bfa11",
                  "&:hover": { color: "#fbbf24", borderColor: "#fbbf24", bgcolor: "transparent", boxShadow: "0 0 20px #fbbf2433" },
                  "&.Mui-disabled": { color: "#a78bfa44", borderColor: "#a78bfa22" }
                }}
              >
                {loading ? <CircularProgress size={16} sx={{ color: "#a78bfa" }} /> : "Sign in"}
              </Button>
            </Box>
          </form>
        </Box>

        <Typography align="center" sx={{ color: "#a78bfa22", mt: 4, fontFamily: "'Space Grotesk', sans-serif", letterSpacing: 2, fontSize: 10, textTransform: "uppercase" }}>
          by Jezabel Rosso
        </Typography>
      </Box>
    </Box>
  );
}