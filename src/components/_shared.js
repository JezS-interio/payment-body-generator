import React from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "/api" : "http://localhost:4000/api"
});

export const inputSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#080810",
    borderRadius: 0,
    "& fieldset": { borderColor: "#a78bfa2a", borderRadius: 0 },
    "&:hover fieldset": { borderColor: "#a78bfa88" },
    "&.Mui-focused fieldset": { borderColor: "#fbbf24", boxShadow: "0 0 0 1px #fbbf2422" },
  },
  "& .MuiInputLabel-root": { color: "#c4b5fd", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#fbbf24" },
  "& input": { color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 },
  "& .MuiSelect-select": { color: "#e2e8f0", fontFamily: "'Space Grotesk', sans-serif", fontSize: 13 },
};

export const paperSx = {
  p: 3, mb: 2, bgcolor: "#0a0a12", border: "1px solid #a78bfa1e", borderRadius: 0
};

export function SectionLabel({ step, title }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
      <Typography sx={{ color: "#fbbf24", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: 1, whiteSpace: "nowrap" }}>
        [{step}]
      </Typography>
      <Typography sx={{ color: "#c4b5fd", fontFamily: "'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
        {title}
      </Typography>
      <Box sx={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #a78bfa33, transparent)" }} />
    </Box>
  );
}

export function PageHeader({ title, subtitle }) {
  return (
    <>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfaaa", fontSize: 11, letterSpacing: 4, textTransform: "uppercase", mb: 1 }}>
        INTERNAL · <span style={{ color: "#fbbf24", opacity: 0.6 }}>PAYMENT TOOLS</span>
      </Typography>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900, color: "#e2e8f0", fontSize: 22, letterSpacing: -0.5, mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ fontFamily: "'Space Grotesk', sans-serif", color: "#a78bfacc", fontSize: 12, letterSpacing: 2, mb: 3 }}>{subtitle}</Typography>
    </>
  );
}
