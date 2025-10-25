/* eslint-disable */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface SessionManagerConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  cookieOptions?: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    maxAge?: number;
  };
}

export class SessionManager {
  private config: SessionManagerConfig;

  constructor(config: SessionManagerConfig) {
    this.config = config;
  }

  // Server-side session management
  async getServerSession() {
    console.log('🔐 === ENHANCED SESSION DEBUG ===');
    const cookieStore = await cookies();

    // Debug: Log available cookies
    const allCookies = cookieStore.getAll();
    const supabaseCookies = allCookies.filter((c) => c.name.startsWith('sb-'));
    console.log(
      '🍪 Available Supabase cookies:',
      supabaseCookies.map((c) => ({
        name: c.name,
        hasValue: !!c.value,
      }))
    );

    const supabase = createServerClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey,
      {
        cookies: {
          get: (name: string) => {
            const value = cookieStore.get(name)?.value;
            console.log(`🍪 Cookie ${name}:`, value ? 'exists' : 'missing');
            return value;
          },
          set: (name: string, value: string, options: any) => {
            try {
              const cookieOptions = {
                ...this.config.cookieOptions,
                ...options,
              };
              cookieStore.set({ name, value, ...cookieOptions });
              console.log(
                `🍪 Setting cookie ${name} with options:`,
                cookieOptions
              );
            } catch (error) {
              console.error(`🍪 Failed to set cookie ${name}:`, error);
            }
          },
          remove: (name: string, options: any) => {
            try {
              const cookieOptions = {
                ...this.config.cookieOptions,
                ...options,
              };
              cookieStore.set({ name, value: '', ...cookieOptions });
              console.log(`🍪 Removing cookie ${name}`);
            } catch (error) {
              console.error(`🍪 Failed to remove cookie ${name}:`, error);
            }
          },
        },
      }
    );

    // Try to get session first
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log('🔍 Session check:', {
      hasSession: !!session,
      sessionError: sessionError?.message,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      expiresAt: session?.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : null,
    });

    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return { supabase, user: null, error: sessionError.message };
    }

    if (!session) {
      // Fallback to getUser if session fails
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log('🔍 User check (fallback):', {
        hasUser: !!user,
        userError: userError?.message,
        userId: user?.id,
        userEmail: user?.email,
      });

      if (userError) {
        console.error('❌ User error:', userError);
        return { supabase, user: null, error: userError.message };
      }

      if (!user?.id) {
        console.log('❌ No authenticated user found');
        return { supabase, user: null, error: 'No authenticated user' };
      }

      console.log('✅ User found via getUser fallback');
      return { supabase, user, error: null };
    }

    console.log('✅ User found via session');
    return { supabase, user: session.user, error: null };
  }

  // Middleware session management
  async getMiddlewareSession(req: NextRequest) {
    const supabase = createServerClient(
      this.config.supabaseUrl,
      this.config.supabaseAnonKey,
      {
        cookies: {
          get: (name: string) => {
            return req.cookies.get(name)?.value;
          },
          set: (name: string, value: string, options: any) => {
            req.cookies.set({
              name,
              value,
              ...this.config.cookieOptions,
              ...options,
            });
          },
          remove: (name: string, options: any) => {
            req.cookies.set({
              name,
              value: '',
              ...this.config.cookieOptions,
              ...options,
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Middleware session error:', error);
    }

    return { supabase, session, error };
  }

  // Session validation utilities
  isSessionValid(session: any): boolean {
    if (!session) return false;

    const now = Date.now() / 1000;
    const expiresAt = session.expires_at;

    if (!expiresAt) return false;

    // Consider session valid if it expires in more than 1 minute
    return expiresAt > now + 60;
  }

  getTimeUntilExpiry(session: any): number {
    if (!session?.expires_at) return 0;

    const now = Date.now() / 1000;
    return Math.max(0, session.expires_at - now);
  }

  // Session refresh utilities
  async refreshSession(supabase: any) {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Session refresh error:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Session refreshed successfully');
      return { success: true, session: data.session, user: data.user };
    } catch (error) {
      console.error('Session refresh failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Default configuration
const defaultConfig: SessionManagerConfig = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

// Export singleton instance
export const sessionManager = new SessionManager(defaultConfig);

// Export convenience functions
export const getServerSession = () => sessionManager.getServerSession();
export const getMiddlewareSession = (req: NextRequest) =>
  sessionManager.getMiddlewareSession(req);
