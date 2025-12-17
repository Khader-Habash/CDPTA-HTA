# Simple Backend Solution for Cross-Browser Sync

Since Supabase CORS can't be configured and localStorage can't sync across browsers, here's a simple backend API solution.

## Quick Backend Setup (Using Node.js/Express)

### Step 1: Create Backend Folder

```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv @supabase/supabase-js
```

### Step 2: Create `server.js`

```javascript
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// Use service role key (server-side only!)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role, not anon key!
);

// Save application
app.post('/api/applications', async (req, res) => {
  try {
    const { user_id, application_id, status, data, submitted_at } = req.body;
    
    const { data: result, error } = await supabase
      .from('applications')
      .insert({
        user_id,
        application_id,
        status,
        data,
        submitted_at,
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all applications (for admin)
app.get('/api/applications', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
```

### Step 3: Create `.env`

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=3001
```

### Step 4: Get Service Role Key

1. Go to Supabase Dashboard
2. Settings → API
3. Copy **service_role** key (NOT the anon key!)
4. Add to `.env` file

### Step 5: Update Frontend

Change your Supabase calls to use your backend API instead:

```typescript
// Instead of: supabase.from('applications').insert(...)
// Use: fetch('http://localhost:3001/api/applications', ...)
```

## This Solves:

✅ **CORS issues** - Backend handles CORS
✅ **RLS issues** - Service role bypasses RLS
✅ **Cross-browser sync** - Backend serves all browsers
✅ **Authentication** - Can handle auth in backend

## Deployment Options

- **Vercel** - Deploy backend as serverless function
- **Railway** - Simple Node.js hosting
- **Render** - Free tier available
- **Heroku** - Traditional option

Would you like me to help you implement this solution?



