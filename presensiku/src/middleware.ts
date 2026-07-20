import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname;

  // Protect internal routes
  const isInternalRoute = pathname.startsWith('/admin') || pathname.startsWith('/guru') || pathname.startsWith('/siswa') || pathname === '/pending-approval';

  if (!user && isInternalRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    // Only fetch profile if accessing a protected route or root/login
    if (pathname === '/' || pathname === '/login' || pathname.startsWith('/dashboard') || isInternalRoute) {
      const { data: profile } = await supabase
        .from('users')
        .select('role, is_approved')
        .eq('auth_id', user.id)
        .single();

      if (!profile) {
        // If they have no profile, maybe they are setting it up. For now, allow or redirect to login.
        if (pathname !== '/login') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
      } else {
        if (!profile.is_approved && pathname !== '/pending-approval') {
          return NextResponse.redirect(new URL('/pending-approval', request.url));
        }

        // Role-based authorization
        if (profile.is_approved) {
           if (pathname.startsWith('/admin') && profile.role !== 'admin') {
             return NextResponse.redirect(new URL(`/${profile.role}`, request.url));
           }
           if (pathname.startsWith('/guru') && profile.role !== 'guru') {
             return NextResponse.redirect(new URL(`/${profile.role}`, request.url));
           }
           if (pathname.startsWith('/siswa') && profile.role !== 'siswa') {
             return NextResponse.redirect(new URL(`/${profile.role}`, request.url));
           }

           // Redirect from root/login to dashboard
           if (pathname === '/' || pathname === '/login' || pathname.startsWith('/dashboard')) {
             return NextResponse.redirect(new URL(`/${profile.role}`, request.url));
           }
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
