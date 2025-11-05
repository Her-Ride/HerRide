import { createBrowserClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
    {
      accessToken: async () => {
        return (await auth()).getToken({ template: "supabase" });
      },
    }
  );
