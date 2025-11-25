# Design Document - PlayVibes Platform Completion

## Overview

This design document outlines the architecture and implementation details for completing the PlayVibes platform after user authentication. The platform is a Next.js 15 application using the App Router, with Spotify OAuth integration via Better Auth, PostgreSQL database with Drizzle ORM, and Spotify Web Playback SDK for music streaming.

The design focuses on enhancing the post-authentication experience by implementing:
- Improved authentication flow with proper redirects
- User profile management and statistics
- Enhanced playlist discovery with advanced filtering
- Complete social interaction features (likes, saves, comments)
- Playlist detail views with full track listings
- Persistent music playback across navigation
- Responsive UI with optimistic updates and loading states

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Hooks     │      │
│  │  (App Dir)   │  │   (React)    │  │   (Custom)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Route Handlers)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Auth APIs   │  │ Playlist APIs│  │  User APIs   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   Database Layer         │  │   External APIs          │
│   (PostgreSQL/Drizzle)   │  │   (Spotify Web API)      │
│                          │  │   (Spotify Playback SDK) │
└──────────────────────────┘  └──────────────────────────┘
```

### Technology Stack

- **Frontend**: React 18, Next.js 15 (App Router), TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API, React hooks
- **Authentication**: Better Auth with Spotify OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **API Integration**: Spotify Web API, Spotify Web Playback SDK
- **Deployment**: Vercel

## Components and Interfaces

### 1. Authentication Flow Enhancement

#### Post-Authentication Redirect

**Component**: `app/api/auth/[...all]/route.ts` (existing)

**Enhancement**: Add redirect logic after successful authentication

```typescript
// Middleware to handle post-auth redirect
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/browse';
  
  // After successful auth, redirect to browse page
  return NextResponse.redirect(new URL(callbackUrl, request.url));
}
```

**Component**: `lib/auth-client.ts` (new)

```typescript
export async function signInWithSpotify(redirectTo: string = '/browse') {
  await authClient.signIn.social({
    provider: 'spotify',
    callbackURL: redirectTo,
  });
}
```

#### Welcome Message Component

**Component**: `components/auth/welcome-banner.tsx` (new)

```typescript
interface WelcomeBannerProps {
  userName: string;
  isFirstVisit: boolean;
}

export function WelcomeBanner({ userName, isFirstVisit }: WelcomeBannerProps)
```

Displays a dismissible welcome message with user's name and optional onboarding tips for first-time users.

### 2. User Profile System

#### Profile Page

**Route**: `app/profile/page.tsx` (new)

Displays user's profile information and shared playlists.

**Component**: `components/profile/profile-header.tsx` (new)

```typescript
interface ProfileHeaderProps {
  user: User;
  stats: {
    sharedPlaylistsCount: number;
    totalLikesReceived: number;
    totalSavesReceived: number;
  };
  isOwnProfile: boolean;
}
```

Shows profile picture, name, email, and statistics.

**Component**: `components/profile/profile-playlists.tsx` (new)

```typescript
interface ProfilePlaylistsProps {
  userId: string;
  isOwnProfile: boolean;
}
```

Displays paginated grid of user's shared playlists.

#### Profile API Endpoints

**Route**: `app/api/users/[userId]/route.ts` (new)

- `GET /api/users/[userId]` - Get user profile and stats
- Returns user info with aggregated statistics

**Route**: `app/api/users/[userId]/playlists/route.ts` (new)

- `GET /api/users/[userId]/playlists` - Get user's shared playlists
- Supports pagination

### 3. Enhanced Browse Experience

#### Advanced Filtering

**Component**: `components/playlists/search-filters.tsx` (existing - enhance)

Add multi-select filters for:
- Genres (checkboxes with search)
- Moods (checkboxes with search)
- Activities (checkboxes with search)
- Sort options (most liked, most saved, newest, oldest)

**Component**: `components/playlists/filter-chip.tsx` (new)

```typescript
interface FilterChipProps {
  label: string;
  onRemove: () => void;
}
```

Displays active filters as removable chips.

#### Infinite Scroll

**Hook**: `hooks/use-infinite-scroll.ts` (new)

```typescript
interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<PaginatedResponse<T>>;
  initialPage?: number;
}

export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>)
```

Manages infinite scroll pagination with intersection observer.

### 4. Playlist Detail View

#### Detail Modal/Page

**Component**: `components/playlists/playlist-detail-modal.tsx` (new)

```typescript
interface PlaylistDetailModalProps {
  playlistId: string;
  isOpen: boolean;
  onClose: () => void;
}
```

Full-screen modal or dedicated page showing:
- Playlist header (cover, title, description, creator)
- Action buttons (play, like, save, share)
- Track listing with play buttons
- Comment section
- Statistics

**Component**: `components/playlists/track-list.tsx` (new)

```typescript
interface TrackListProps {
  tracks: SpotifyTrack[];
  onTrackPlay: (trackUri: string) => void;
  currentTrackId?: string;
}
```

Displays formatted track list with play buttons and track info.

#### Playlist Detail API

**Route**: `app/api/playlists/[id]/tracks/route.ts` (new)

- `GET /api/playlists/[id]/tracks` - Get full track listing from Spotify
- Fetches tracks using Spotify Web API

### 5. Social Interactions

#### Like System

**Component**: `components/playlists/like-button.tsx` (existing - enhance)

Add optimistic updates and error handling.

**API Enhancement**: `app/api/playlists/[id]/like/route.ts` (existing)

Ensure proper error responses and transaction handling.

#### Save System

**Component**: `components/playlists/save-button.tsx` (existing - enhance)

Add optimistic updates and error handling.

**API Enhancement**: `app/api/playlists/[id]/save/route.ts` (existing)

Ensure proper error responses and transaction handling.

#### Comment System

**Component**: `components/playlists/comment-section.tsx` (existing - enhance)

Enhancements:
- Real-time comment submission with optimistic updates
- Delete button for own comments
- Character limit (500 chars)
- Empty state when no comments
- Loading states

**Component**: `components/playlists/comment-form.tsx` (new)

```typescript
interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}
```

Textarea with submit button and character counter.

**Component**: `components/playlists/comment-item.tsx` (new)

```typescript
interface CommentItemProps {
  comment: CommentWithUser;
  onDelete?: (commentId: string) => Promise<void>;
  canDelete: boolean;
}
```

Individual comment display with user info and delete option.

### 6. Playlist Management

#### Sync Functionality

**Component**: `components/playlists/playlist-selector.tsx` (existing - enhance)

Add:
- Sync button to refresh from Spotify
- Loading states during sync
- Success/error notifications
- Last synced timestamp

**API Enhancement**: `app/api/playlists/sync/route.ts` (existing)

Ensure it updates metadata for all shared playlists.

### 7. Music Playback

#### Global Player Bar

**Component**: `components/playback/global-player.tsx` (existing - enhance)

Enhancements:
- Persistent bottom bar (fixed position)
- Current track info with album art
- Playback controls (play/pause, prev, next)
- Progress bar with seek functionality
- Volume control
- Minimize/expand functionality
- Queue display (optional)

**Component**: `components/playback/player-controls.tsx` (new)

```typescript
interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canSkipPrev: boolean;
  canSkipNext: boolean;
}
```

Playback control buttons.

**Component**: `components/playback/progress-bar.tsx` (new)

```typescript
interface ProgressBarProps {
  position: number;
  duration: number;
  onSeek: (position: number) => void;
}
```

Interactive progress bar with time display.

**Component**: `components/playback/volume-control.tsx` (new)

```typescript
interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}
```

Volume slider with mute button.

#### Playback State Management

**Enhancement**: `components/playback/playback-provider.tsx` (existing)

Ensure playback state persists across page navigation using React Context.

### 8. Navigation Enhancement

**Component**: `components/navigation.tsx` (existing - enhance)

Add:
- Profile link in user dropdown
- Active state highlighting
- Notification badge (future feature)
- Search bar in navigation (optional)

### 9. Loading and Error States

#### Loading Skeletons

**Component**: `components/ui/skeleton.tsx` (existing)

Use for:
- Playlist cards
- Profile header
- Track listings
- Comments

**Component**: `components/playlists/playlist-card-skeleton.tsx` (existing)

Ensure it matches the actual card layout.

#### Error Boundaries

**Component**: `components/error-boundary.tsx` (existing)

Wrap major sections to catch and display errors gracefully.

**Component**: `components/ui/error-message.tsx` (new)

```typescript
interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}
```

Displays error with optional retry button.

### 10. Optimistic UI Updates

**Hook**: `hooks/use-optimistic-update.ts` (new)

```typescript
interface UseOptimisticUpdateOptions<T> {
  mutationFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  rollbackFn?: () => void;
}

export function useOptimisticUpdate<T>(options: UseOptimisticUpdateOptions<T>)
```

Manages optimistic updates with automatic rollback on error.

## Data Models

### Existing Database Schema

The database schema is already defined in `lib/db/schema.ts`:

- `users` - User accounts
- `accounts` - OAuth tokens
- `sessions` - User sessions
- `sharedPlaylists` - Shared playlists
- `playlistLikes` - Like relationships
- `playlistComments` - Comments
- `savedPlaylists` - Save relationships

### API Response Types

**User Profile Response**:
```typescript
interface UserProfileResponse {
  user: User;
  stats: {
    sharedPlaylistsCount: number;
    totalLikesReceived: number;
    totalSavesReceived: number;
  };
}
```

**Playlist Detail Response**:
```typescript
interface PlaylistDetailResponse extends PlaylistWithDetails {
  tracks: SpotifyTrack[];
  comments: CommentWithUser[];
}
```

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Display toast notification with retry option
2. **Authentication Errors**: Redirect to login with return URL
3. **Permission Errors**: Display message explaining required permissions
4. **Spotify API Errors**: Handle rate limits, token expiration, premium requirements

### Server-Side Error Handling

1. **Database Errors**: Log and return generic error message
2. **Spotify API Errors**: Retry with exponential backoff, handle token refresh
3. **Validation Errors**: Return specific error messages
4. **Authorization Errors**: Return 401/403 with clear message

### Error Response Format

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: unknown;
}
```

## Testing Strategy

### Unit Tests

Focus on:
- Utility functions (formatters, validators)
- Custom hooks (use-infinite-scroll, use-optimistic-update)
- API client functions
- Data transformation functions

### Integration Tests

Focus on:
- API route handlers
- Database operations
- Spotify API integration
- Authentication flow

### Component Tests

Focus on:
- User interactions (clicks, form submissions)
- Conditional rendering
- Error states
- Loading states

### E2E Tests

Focus on:
- Complete user flows (browse → detail → play)
- Authentication flow
- Playlist management flow
- Social interactions flow

## Performance Considerations

### Optimization Strategies

1. **Image Optimization**: Use Next.js Image component for playlist covers
2. **Code Splitting**: Lazy load heavy components (player, detail modal)
3. **Data Caching**: Cache playlist data for 5 minutes
4. **Debouncing**: Debounce search input (300ms)
5. **Pagination**: Load 20 items per page
6. **Infinite Scroll**: Use intersection observer for efficient loading
7. **Optimistic Updates**: Immediate UI feedback for user actions

### Bundle Size Management

1. Lazy load Spotify Playback SDK
2. Use dynamic imports for modals and heavy components
3. Tree-shake unused shadcn/ui components
4. Minimize third-party dependencies

## Security Considerations

1. **Authentication**: Validate session on all protected routes
2. **Authorization**: Verify user ownership for delete/edit operations
3. **Input Validation**: Sanitize all user inputs (comments, search)
4. **Rate Limiting**: Implement rate limits on API endpoints
5. **CSRF Protection**: Use Better Auth's built-in CSRF protection
6. **XSS Prevention**: Sanitize rendered user content
7. **SQL Injection**: Use Drizzle ORM parameterized queries

## Accessibility

1. **Keyboard Navigation**: All interactive elements accessible via keyboard
2. **Screen Readers**: Proper ARIA labels and semantic HTML
3. **Focus Management**: Visible focus indicators
4. **Color Contrast**: WCAG AA compliance
5. **Alt Text**: Descriptive alt text for images
6. **Form Labels**: Proper labels for all form inputs

## Mobile Responsiveness

1. **Breakpoints**: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
2. **Touch Targets**: Minimum 44x44px for touch elements
3. **Navigation**: Hamburger menu on mobile
4. **Player**: Collapsible player bar on mobile
5. **Modals**: Full-screen on mobile, centered on desktop
6. **Grid Layouts**: Responsive columns (1 → 2 → 3 → 4)

## Implementation Phases

### Phase 1: Core Infrastructure
- Post-auth redirect logic
- Profile page and API
- Enhanced navigation
- Error boundaries and loading states

### Phase 2: Enhanced Discovery
- Advanced filtering
- Infinite scroll
- Playlist detail view
- Track listings

### Phase 3: Social Features
- Optimistic updates for likes/saves
- Enhanced comment system
- Share functionality

### Phase 4: Playback Enhancement
- Global player bar
- Persistent playback
- Player controls
- Volume and progress

### Phase 5: Polish
- Performance optimization
- Accessibility improvements
- Mobile responsiveness
- Testing and bug fixes

## Deployment Considerations

1. **Environment Variables**: Ensure all Spotify credentials are set
2. **Database Migrations**: Run migrations before deployment
3. **Build Optimization**: Enable Next.js production optimizations
4. **CDN**: Use Vercel's CDN for static assets
5. **Monitoring**: Set up error tracking (Sentry)
6. **Analytics**: Track user engagement (optional)

## Future Enhancements

1. **Playlist Creation**: Allow users to create playlists within the app
2. **Collaborative Playlists**: Multiple users can contribute
3. **Recommendations**: AI-powered playlist recommendations
4. **Social Features**: Follow users, activity feed
5. **Advanced Search**: Full-text search with filters
6. **Playlist Analytics**: View stats for shared playlists
7. **Mobile App**: Native iOS/Android apps
8. **Offline Mode**: Cache playlists for offline viewing
