import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, TextField, Button, MenuItem, Alert, Chip, Typography } from "@mui/material";
import { api, inputSx, paperSx, SectionLabel, PageHeader } from "./_shared";

export default function Methods() {
  const [paises, setPaises] = useState({});
  const [methods, setMethods] = useState({});
  const [pais, setPais] = useState("");
  const [nuevo, setNuevo] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/paises").then(r => { setPaises(r.data); setPais(Object.keys(r.data)[0] || ""); });
    api.get("/methods").then(r => setMethods(r.data));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await api.post("/methods", { pais, method: nuevo });
      setSuccess(`Method '${nuevo}' added to ${pais}`);
      setNuevo("");
      const res = await api.get("/methods");
      setMethods(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (m) => {
    setError(""); setSuccess("");
    try {
      await api.delete("/methods", { data: { pais, method: m } });
      setSuccess(`Method '${m}' removed from ${pais}`);
      const res = await api.get("/methods");
      setMethods(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Payment Methods" subtitle="// manage payment methods by country" />

      <form onSubmit={handleAdd} autoComplete="off">
        <Paper sx={paperSx}>
          <SectionLabel step="01" title="Add Method" />
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <TextField select label="Country" value={pais} onChange={e => setPais(e.target.value)} fullWidth required sx={inputSx}>
                {Object.keys(paises).map(k => (
                  <MenuItem key={k} value={k}>{paises[k]?.billing_address?.country} {k.charAt(0).toUpperCase() + k.slice(1)}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={8}>
              <TextField label="New Method" value={nuevo} onChange={e => setNuevo(e.target.value)} fullWidth required placeholder="e.g: CARD, PIX, BOLETO" sx={inputSx} />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center", mt: 2.5 }}>
            <Button type="submit" variant="contained" size="large"
              sx={{
                minWidth: 220, fontWeight: 700, fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
                fontFamily: "'Space Grotesk', sans-serif", background: "transparent", color: "#a78bfa",
                border: "1px solid #a78bfa55", borderRadius: 0, px: 5, py: 1.5,
                boxShadow: "0 0 12px #a78bfa11",
                "&:hover": { color: "#fbbf24", borderColor: "#fbbf24", bgcolor: "transparent", boxShadow: "0 0 20px #fbbf2433" }
              }}>
              Add Method
            </Button>
          </Box>
        </Paper>
      </form>

      {success && (
        <Alert severity="success" onClose={() => setSuccess("")}
          sx={{ mb: 2, bgcolor: "#04080a", color: "#4ade80", borderLeft: "2px solid #22c55e", borderRadius: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" onClose={() => setError("")}
          sx={{ mb: 2, bgcolor: "#08040a", color: "#f87171", borderLeft: "2px solid #ef4444", borderRadius: 0, fontFamily: "'Space Grotesk', sans-serif", fontSize: 12 }}>
          {error}
        </Alert>
      )}

      <Paper sx={paperSx}>
        <SectionLabel step="02" title="Current Methods" />
        {pais && (methods[pais]?.length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {methods[pais].map(m => (
              <Chip
                key={m} label={m} onDelete={() => handleDelete(m)}
                sx={{
                  bgcolor: "transparent", color: "#a78bfa", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11, border: "1px solid #a78bfa44", borderRadius: "2px", letterSpacing: 1,
                  "& .MuiChip-deleteIcon": { color: "#a78bfa77" },
                  "& .MuiChip-deleteIcon:hover": { color: "#f87171" }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: "#a78bfa44", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: 2 }}>// no methods configured</Typography>
        ))}
      </Paper>
    </Box>
  );
}
