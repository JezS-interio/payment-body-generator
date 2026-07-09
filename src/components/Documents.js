import React, { useEffect, useState } from "react";
import { Box, Paper, TextField, MenuItem, Chip, Typography } from "@mui/material";
import { api, inputSx, paperSx, SectionLabel, PageHeader } from "./_shared";

export default function Documents() {
  const [docs, setDocs] = useState({});
  const [pais, setPais] = useState("");
  const [copiedDoc, setCopiedDoc] = useState("");

  useEffect(() => {
    api.get("/documentos").then(r => {
      setDocs(r.data);
      setPais(Object.keys(r.data)[0] || "");
    }).catch(() => {});
  }, []);

  const handleCopyDoc = (label) => {
    const numero = label.includes(": ") ? label.split(": ")[1] : label;
    navigator.clipboard.writeText(numero);
    setCopiedDoc(label);
    setTimeout(() => setCopiedDoc(""), 1500);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader title="Documents" subtitle="// available document types by country" />

      <Paper sx={paperSx}>
        <SectionLabel step="01" title="Country" />
        <TextField select label="Country" value={pais} onChange={e => setPais(e.target.value)} fullWidth sx={inputSx}>
          {Object.keys(docs).map(k => (
            <MenuItem key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</MenuItem>
          ))}
        </TextField>
      </Paper>

      <Paper sx={paperSx}>
        <SectionLabel step="02" title="Documentos" />
        {(docs[pais] || []).length ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {docs[pais].map((d, i) => (
              <Chip
                key={i} label={d} onClick={() => handleCopyDoc(d)}
                sx={{
                  bgcolor: copiedDoc === d ? "#040a06" : "transparent",
                  color: copiedDoc === d ? "#22c55e" : "#a78bfa",
                  fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
                  border: `1px solid ${copiedDoc === d ? "#22c55e44" : "#a78bfa44"}`,
                  fontSize: 12, borderRadius: "2px", cursor: "pointer", letterSpacing: 1,
                  transition: "all 0.2s",
                  "&:hover": { borderColor: copiedDoc === d ? "#22c55e" : "#a78bfa", boxShadow: `0 0 8px ${copiedDoc === d ? "#22c55e1a" : "#a78bfa1a"}` }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography sx={{ color: "#a78bfa44", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: 2 }}>// no documents configured</Typography>
        )}
      </Paper>
    </Box>
  );
}
