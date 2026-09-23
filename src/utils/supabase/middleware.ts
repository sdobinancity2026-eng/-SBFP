// src/utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // 1. Unauthenticated users trying to access protected routes -> Redirect to /login
  if (!user && (request.nextUrl.pathname.startsWith('/intake') || request.nextUrl.pathname.startsWith('/admin'))) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 2. Authenticated users trying to access /login -> Redirect to /intake
  if (user && request.nextUrl.pathname === '/login') {
    url.pathname = '/intake';
    return NextResponse.redirect(url);
  }

  // 3. Role-Based Access Control (RBAC) for Super Admin routes
  if (user && request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'super_admin') {
      url.pathname = '/intake';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}