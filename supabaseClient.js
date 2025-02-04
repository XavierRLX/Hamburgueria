const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

if (!global.supabase) {
    global.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

module.exports = { supabase: global.supabase };
