import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Added Authorization here
      },
    });
  }

  // Initialize default values
  let username = "Guest";
  let phoneNumber = "N/A";
  let email = "N/A";

  // Parse the JSON body
  try {
    const { username: requestUsername, phoneNumber: requestPhoneNumber, email: requestEmail } = await req.json();
    username = requestUsername || username; // Use the provided username or default to "Guest"
    phoneNumber = requestPhoneNumber || phoneNumber; // Use the provided phone number or default to "N/A"
    email = requestEmail || email; // Use the provided email or default to "N/A"
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }

  const data = {
    message: `Hello ${username}!`,
    phoneNumber: phoneNumber,
    email: email,
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});