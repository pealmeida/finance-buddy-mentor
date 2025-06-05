import "module-alias/register.js";
import express from "express";
import { supabase } from "@/integrations/supabase/client.js";

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Routes
app.get("/signup", (req, res) => {
  res.send("Signup form would be served here");
});

app.post("/api/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // 1. Create auth user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // Stores name in auth.user_metadata
      },
    });

    if (authError) throw authError;

    // 2. Create profile in public.profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      email,
      name,
      created_at: new Date().toISOString(),
    });

    if (profileError) throw profileError;

    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || "Signup failed",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
