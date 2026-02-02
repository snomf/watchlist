import { createClient } from '@supabase/supabase-js';

// In Vercel serverless, ENV vars are available directly on process.env
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://wuaoaeadrjewtyhvxyno.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1YW9hZWFkcmpld3R5aHZ4eW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNjc4MjMsImV4cCI6MjA3ODc0MzgyM30.9wymTewNn9AvnK2H6Spi7hE6n3wj_IBGljHjbAxRnY0';

const supabase = createClient(supabaseUrl, supabaseKey);

const TRAKT_CLIENT_ID = process.env.VITE_TRAKT_CLIENT_ID;
const TRAKT_CLIENT_SECRET = process.env.TRAKT_CLIENT_SECRET;

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, user_id, redirect_uri } = req.body;

    if (!code || !user_id) {
        return res.status(400).json({ error: 'Missing code or user_id' });
    }

    try {
        // 1. Exchange Code for Token
        const tokenResponse = await fetch('https://api.trakt.tv/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                client_id: TRAKT_CLIENT_ID,
                client_secret: TRAKT_CLIENT_SECRET,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Trakt Token Error:', tokenData);
            throw new Error(tokenData.error_description || 'Failed to get token from Trakt');
        }

        // 2. Convert expires_in to absolute timestamp
        const expiresAt = Math.floor(Date.now() / 1000) + tokenData.expires_in;

        // 3. Store in Supabase `integrations` table
        // We use upsert to replace if exists
        const { data, error } = await supabase
            .from('integrations')
            .upsert({
                user_id: user_id,
                provider: 'trakt',
                access_token: tokenData.access_token,
                refresh_token: tokenData.refresh_token,
                expires_at: expiresAt,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, provider' })
            .select();

        if (error) {
            console.error('Supabase Insert Error:', error);
            throw new Error('Failed to save credentials to database');
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error('Auth Handler Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
