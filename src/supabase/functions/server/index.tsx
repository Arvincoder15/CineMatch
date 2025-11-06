import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ec9c6d6c/health", (c) => {
  return c.json({ status: "ok" });
});

// Session endpoints for collaborative movie matching

// Create a new session
app.post("/make-server-ec9c6d6c/sessions/create", async (c) => {
  try {
    const { code, user } = await c.req.json();
    
    const session = {
      code,
      createdAt: Date.now(),
      users: [user],
      preferences: {},
    };

    await kv.set(`session:${code}`, session);
    
    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error creating session:', error);
    return c.json({ success: false, error: 'Failed to create session' }, 500);
  }
});

// Join an existing session
app.post("/make-server-ec9c6d6c/sessions/join", async (c) => {
  try {
    const { code, user } = await c.req.json();
    
    const session = await kv.get(`session:${code.toUpperCase()}`);
    
    if (!session) {
      return c.json({ success: false, error: 'Session not found' }, 404);
    }

    // Check if user already in session
    const userExists = session.users.find((u: any) => u.id === user.id);
    if (!userExists) {
      session.users.push(user);
      await kv.set(`session:${code.toUpperCase()}`, session);
    }

    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error joining session:', error);
    return c.json({ success: false, error: 'Failed to join session' }, 500);
  }
});

// Get session details
app.get("/make-server-ec9c6d6c/sessions/:code", async (c) => {
  try {
    const code = c.req.param('code').toUpperCase();
    const session = await kv.get(`session:${code}`);
    
    if (!session) {
      return c.json({ success: false, error: 'Session not found' }, 404);
    }

    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error getting session:', error);
    return c.json({ success: false, error: 'Failed to get session' }, 500);
  }
});

// Update user preferences (likes)
app.post("/make-server-ec9c6d6c/sessions/:code/preferences", async (c) => {
  try {
    const code = c.req.param('code').toUpperCase();
    const { userId, movieIds } = await c.req.json();
    
    const session = await kv.get(`session:${code}`);
    
    if (!session) {
      return c.json({ success: false, error: 'Session not found' }, 404);
    }

    session.preferences[userId] = movieIds;
    await kv.set(`session:${code}`, session);

    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return c.json({ success: false, error: 'Failed to update preferences' }, 500);
  }
});

Deno.serve(app.fetch);