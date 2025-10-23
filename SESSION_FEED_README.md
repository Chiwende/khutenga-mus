# Session Feed System

This document explains how session handling works in your Khutenga Music app and how to use the new session feed system.

## Current Session Architecture

### 1. **Server-Side Session Management**

- **File**: `lib/auth/session-manager.ts`
- **Purpose**: Handles server-side authentication with enhanced error handling and debugging
- **Features**:
  - Cookie management with configurable options
  - Session validation and refresh utilities
  - Comprehensive logging for debugging
  - Fallback mechanisms for session recovery

### 2. **Client-Side Session Feed**

- **File**: `hooks/useSessionFeed.tsx`
- **Purpose**: Real-time session monitoring and management
- **Features**:
  - Auto-refresh before session expiry
  - Loading states and error handling
  - Session persistence across page navigations
  - Manual refresh and sign-out capabilities

### 3. **Session Context Provider**

- **File**: `provider/SessionFeedProvider.tsx`
- **Purpose**: Provides session context to all components
- **Features**:
  - Context-based session state management
  - Convenience hooks for specific session data
  - Type-safe session access

### 4. **Session Status Component**

- **File**: `components/session-status.tsx`
- **Purpose**: Visual session status indicator
- **Features**:
  - Real-time session status display
  - Error handling with retry options
  - Manual session refresh controls
  - Detailed session information (optional)

## How to Use the Session Feed

### 1. **Basic Session Access**

```tsx
import { useSessionFeedContext } from '@/provider/SessionFeedProvider';

function MyComponent() {
  const { session, user, isLoading, error } = useSessionFeedContext();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Welcome, {user.email}!</div>;
}
```

### 2. **Convenience Hooks**

```tsx
import {
  useSession,
  useUser,
  useSessionActions,
} from '@/provider/SessionFeedProvider';

function MyComponent() {
  // Get just session data
  const { session, isLoading, error } = useSession();

  // Get just user data
  const { user, isLoading, error } = useUser();

  // Get session actions
  const { refreshSession, signOut, clearError, isRefreshing } =
    useSessionActions();

  return (
    <div>
      <button onClick={refreshSession} disabled={isRefreshing}>
        {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. **Session Status Component**

```tsx
import SessionStatus from '@/components/session-status';

function MyPage() {
  return (
    <div>
      {/* Basic status */}
      <SessionStatus />

      {/* Detailed status with session info */}
      <SessionStatus showDetails={true} />

      {/* Custom styling */}
      <SessionStatus className='my-custom-class' />
    </div>
  );
}
```

### 4. **Server-Side Session Access**

```tsx
import { getServerSession } from '@/lib/auth/session-manager';

export default async function MyServerComponent() {
  const { supabase, user, error } = await getServerSession();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  // Use supabase client for database operations
  const { data } = await supabase.from('songs').select('*');

  return <div>User: {user.email}</div>;
}
```

## Session Feed Features

### 1. **Auto-Refresh**

- Sessions automatically refresh 5 minutes before expiry
- Prevents session expiration during active use
- Configurable refresh timing

### 2. **Error Handling**

- Comprehensive error logging and reporting
- User-friendly error messages
- Retry mechanisms for failed operations
- Graceful fallbacks for session recovery

### 3. **Loading States**

- Loading indicators during session operations
- Prevents UI flicker during state changes
- Clear feedback for user actions

### 4. **Session Persistence**

- Cookies configured for optimal security
- Session state maintained across page navigations
- Automatic session restoration on app reload

### 5. **Debugging**

- Comprehensive logging for session operations
- Cookie inspection and debugging
- Session state monitoring

## Configuration

### Cookie Options

The session manager uses configurable cookie options:

```typescript
const cookieOptions = {
  httpOnly: true, // Security: prevent XSS
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // CSRF protection
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
```

### Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Demo Page

Visit `/session-demo` to see the session feed system in action. This page demonstrates:

- Real-time session status
- Session information display
- Manual session controls
- Error handling examples
- Raw session data inspection

## Troubleshooting

### Common Issues

1. **"No Active Session"**

   - User needs to sign in
   - Check if auth modal is working
   - Verify Supabase configuration

2. **Session Refresh Errors**

   - Check network connectivity
   - Verify Supabase service status
   - Check browser console for detailed errors

3. **Cookie Issues**
   - Ensure proper domain configuration
   - Check HTTPS requirements
   - Verify cookie settings in browser dev tools

### Debug Information

The session manager provides detailed logging:

- Cookie inspection
- Session state changes
- Error details
- Refresh operations

Check your browser console and server logs for debugging information.

## Integration with Existing Code

The session feed system is designed to work alongside your existing authentication:

1. **Backward Compatibility**: Existing `getServerSession()` calls continue to work
2. **Enhanced Features**: New session feed provides additional capabilities
3. **Gradual Migration**: You can adopt session feed features incrementally

## Next Steps

1. **Test the Demo**: Visit `/session-demo` to see the system in action
2. **Integrate Components**: Add `SessionStatus` to your main layout
3. **Use Hooks**: Replace direct Supabase auth calls with session feed hooks
4. **Monitor Logs**: Check console for session debugging information
5. **Customize**: Adjust cookie options and refresh timing as needed

The session feed system provides a robust foundation for authentication in your music app, with real-time monitoring, error handling, and user-friendly interfaces.
