import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { auth } from "@clerk/nextjs/server"; // 1. Add this import

export async function createClient() {
    const cookieStore = await cookies()
    const { getToken } = await auth(); // 2. Get the session helper

    let token: string | null = null;
    try {
        // 3. Get the token from the JWT template you created in Clerk dashboard
        token = await getToken({ template: "supabase" });
    } catch (error) {
        console.warn("⚠️ Clerk JWT Template 'supabase' not found. Please create it in the Clerk dashboard.");
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            },
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        }
    )
}