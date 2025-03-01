// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
Deno.serve(async (req) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  // Create a Supabase client
  const supabaseClient = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'));
  try {
    // Fetch scores for events that haven't passed
    const { data: events, error } = await supabaseClient.from('events').select('score').gt('end_time', new Date().toISOString()); // Ensure end_time is in the future
    if (error) throw error;
    // Extract scores and calculate the 75th percentile
    const scores = events.map((event) => event.score);
    const percentile75 = calculatePercentile(scores, 75);
    return new Response(JSON.stringify({
      percentile75
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
// Function to calculate the nth percentile
function calculatePercentile(values, percentile) {
  if (!values.length) return null;
  values.sort((a, b) => a - b);
  const index = percentile / 100 * (values.length - 1);
  return values[Math.ceil(index)];
}
