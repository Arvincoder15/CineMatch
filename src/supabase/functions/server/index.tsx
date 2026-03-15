import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Custom logger with timestamps and better formatting
app.use('*', logger((message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}));

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

// Global error handler
app.onError((err, c) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });
  
  return c.json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  }, 500);
});

// Health check endpoint
app.get("/make-server-ec9c6d6c/health", (c) => {
  return c.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "2.0.0"
  });
});

// Session endpoints for collaborative movie matching

// Create a new session
app.post("/make-server-ec9c6d6c/sessions/create", async (c) => {
  try {
    const body = await c.req.json();
    const { code, user } = body;
    
    if (!code || !user) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: code and user' 
      }, 400);
    }

    if (!user.id || !user.username) {
      return c.json({ 
        success: false, 
        error: 'User must have id and username' 
      }, 400);
    }
    
    const session = {
      code: code.toUpperCase(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      users: [user],
      preferences: {},
    };

    await kv.set(`session:${session.code}`, session);
    
    console.log(`Session created: ${session.code} by ${user.username}`);
    
    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error creating session:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json({ 
      success: false, 
      error: 'Failed to create session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Join an existing session
app.post("/make-server-ec9c6d6c/sessions/join", async (c) => {
  try {
    const body = await c.req.json();
    const { code, user } = body;
    
    if (!code || !user) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: code and user' 
      }, 400);
    }

    if (!user.id || !user.username) {
      return c.json({ 
        success: false, 
        error: 'User must have id and username' 
      }, 400);
    }
    
    const sessionCode = code.toUpperCase();
    const session = await kv.get(`session:${sessionCode}`);
    
    if (!session) {
      console.log(`Session not found: ${sessionCode}`);
      return c.json({ 
        success: false, 
        error: 'Session not found' 
      }, 404);
    }

    // Check if user already in session
    const userExists = session.users.find((u: any) => u.id === user.id);
    if (!userExists) {
      session.users.push(user);
      session.updatedAt = Date.now();
      await kv.set(`session:${sessionCode}`, session);
      console.log(`User ${user.username} joined session ${sessionCode}`);
    } else {
      console.log(`User ${user.username} already in session ${sessionCode}`);
    }

    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error joining session:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json({ 
      success: false, 
      error: 'Failed to join session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Get session details
app.get("/make-server-ec9c6d6c/sessions/:code", async (c) => {
  try {
    const code = c.req.param('code')?.toUpperCase();
    
    if (!code) {
      return c.json({ 
        success: false, 
        error: 'Session code is required' 
      }, 400);
    }
    
    const session = await kv.get(`session:${code}`);
    
    if (!session) {
      return c.json({ 
        success: false, 
        error: 'Session not found' 
      }, 404);
    }

    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error getting session:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json({ 
      success: false, 
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// Update user preferences (likes)
app.post("/make-server-ec9c6d6c/sessions/:code/preferences", async (c) => {
  try {
    const code = c.req.param('code')?.toUpperCase();
    
    if (!code) {
      return c.json({ 
        success: false, 
        error: 'Session code is required' 
      }, 400);
    }
    
    const body = await c.req.json();
    const { userId, movieIds } = body;
    
    if (!userId || !movieIds) {
      return c.json({ 
        success: false, 
        error: 'Missing required fields: userId and movieIds' 
      }, 400);
    }

    if (!Array.isArray(movieIds)) {
      return c.json({ 
        success: false, 
        error: 'movieIds must be an array' 
      }, 400);
    }
    
    const session = await kv.get(`session:${code}`);
    
    if (!session) {
      return c.json({ 
        success: false, 
        error: 'Session not found' 
      }, 404);
    }

    session.preferences[userId] = movieIds;
  session.updatedAt = Date.now();
    await kv.set(`session:${code}`, session);

    console.log(`Updated preferences for user ${userId} in session ${code}: ${movieIds.length} movies`);

    return c.json({ success: true, session });
  } catch (error) {
    console.error('Error updating preferences:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return c.json({ 
      success: false, 
      error: 'Failed to update preferences',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
});

// List all active sessions (for debugging)
app.get("/make-server-ec9c6d6c/sessions", async (c) => {
  try {
    const sessions = await kv.getByPrefix('session:');
    return c.json({ 
      success: true, 
      count: sessions.length,
      sessions: sessions.map((s: any) => ({
        code: s.code,
        userCount: s.users?.length || 0,
        createdAt: s.createdAt,
      }))
    });
  } catch (error) {
    console.error('Error listing sessions:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to list sessions' 
    }, 500);
  }
});

console.log('🚀 CineMatch Server starting...');
console.log('📡 Available endpoints:');
console.log('  - GET  /make-server-ec9c6d6c/health');
console.log('  - POST /make-server-ec9c6d6c/sessions/create');
console.log('  - POST /make-server-ec9c6d6c/sessions/join');
console.log('  - GET  /make-server-ec9c6d6c/sessions/:code');
console.log('  - POST /make-server-ec9c6d6c/sessions/:code/preferences');
console.log('  - GET  /make-server-ec9c6d6c/sessions');

Deno.serve(app.fetch);