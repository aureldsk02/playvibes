# Requirements Document

## Introduction

PlayVibes est une plateforme de partage et de découverte de playlists Spotify. Après l'authentification Spotify, les utilisateurs doivent pouvoir accéder à une expérience complète incluant la gestion de leurs playlists, la découverte de contenu communautaire, l'interaction sociale, et la lecture de musique. Ce document définit les exigences pour compléter la plateforme après l'authentification.

## Glossary

- **PlayVibes System**: La plateforme web complète de partage de playlists Spotify
- **User**: Un utilisateur authentifié via Spotify OAuth
- **Playlist**: Une collection de morceaux Spotify partagée sur la plateforme
- **Community Playlist**: Une playlist partagée publiquement par un utilisateur
- **Saved Playlist**: Une playlist d'un autre utilisateur sauvegardée par l'utilisateur actuel
- **Spotify Player**: Le lecteur web Spotify intégré dans l'application
- **Profile**: La page personnelle d'un utilisateur affichant ses playlists et informations
- **Browse Page**: La page de découverte des playlists communautaires
- **Manage Page**: La page de gestion des playlists personnelles de l'utilisateur
- **Saved Page**: La page affichant les playlists sauvegardées par l'utilisateur

## Requirements

### Requirement 1

**User Story:** En tant qu'utilisateur connecté, je veux être redirigé vers une page pertinente après l'authentification, afin de commencer immédiatement à utiliser la plateforme.

#### Acceptance Criteria

1. WHEN the User completes Spotify authentication, THE PlayVibes System SHALL redirect the User to the Browse Page
2. WHEN the User lands on the Browse Page after authentication, THE PlayVibes System SHALL display a welcome message with the User's Spotify display name
3. IF the User is a first-time visitor, THEN THE PlayVibes System SHALL display an onboarding tooltip explaining the main features
4. WHEN the User navigates to any protected page, THE PlayVibes System SHALL maintain the User's authentication state across all pages

### Requirement 2

**User Story:** En tant qu'utilisateur, je veux voir et gérer mon profil utilisateur, afin de personnaliser mon expérience et voir mes statistiques.

#### Acceptance Criteria

1. THE PlayVibes System SHALL provide a Profile Page accessible via the navigation menu
2. WHEN the User accesses their Profile Page, THE PlayVibes System SHALL display the User's Spotify profile picture, display name, and email
3. WHEN the User accesses their Profile Page, THE PlayVibes System SHALL display statistics including total shared playlists count, total likes received count, and total saves received count
4. THE PlayVibes System SHALL display all playlists shared by the User on their Profile Page with pagination of 12 playlists per page
5. WHEN another User views a Profile Page, THE PlayVibes System SHALL display only public information and shared playlists

### Requirement 3

**User Story:** En tant qu'utilisateur, je veux parcourir les playlists de la communauté avec des filtres avancés, afin de découvrir de la musique qui correspond à mes goûts.

#### Acceptance Criteria

1. THE PlayVibes System SHALL display Community Playlists on the Browse Page with infinite scroll loading
2. WHEN the User applies genre filters, THE PlayVibes System SHALL display only playlists matching the selected genres
3. WHEN the User applies mood filters, THE PlayVibes System SHALL display only playlists matching the selected moods
4. WHEN the User applies activity filters, THE PlayVibes System SHALL display only playlists matching the selected activities
5. WHEN the User enters a search query, THE PlayVibes System SHALL filter playlists by name, description, or creator name containing the query text
6. THE PlayVibes System SHALL display each playlist card with cover image, title, creator name, track count, like count, and save count

### Requirement 4

**User Story:** En tant qu'utilisateur, je veux interagir avec les playlists (liker, sauvegarder, commenter), afin de participer à la communauté.

#### Acceptance Criteria

1. WHEN the User clicks the like button on a playlist, THE PlayVibes System SHALL toggle the like status and update the like count immediately
2. WHEN the User clicks the save button on a playlist, THE PlayVibes System SHALL toggle the save status and add or remove the playlist from the User's Saved Page
3. WHEN the User opens a playlist detail view, THE PlayVibes System SHALL display all comments with author name, profile picture, timestamp, and comment text
4. WHEN the User submits a comment, THE PlayVibes System SHALL add the comment to the playlist and display it immediately
5. WHEN the User deletes their own comment, THE PlayVibes System SHALL remove the comment from the playlist immediately

### Requirement 5

**User Story:** En tant qu'utilisateur, je veux gérer mes playlists Spotify et choisir lesquelles partager, afin de contrôler ma présence sur la plateforme.

#### Acceptance Criteria

1. WHEN the User accesses the Manage Page, THE PlayVibes System SHALL fetch and display all playlists from the User's Spotify account
2. THE PlayVibes System SHALL display each playlist with a toggle switch indicating shared or private status
3. WHEN the User toggles a playlist to shared, THE PlayVibes System SHALL make the playlist visible on the Browse Page and the User's Profile Page
4. WHEN the User toggles a playlist to private, THE PlayVibes System SHALL remove the playlist from public visibility within 5 seconds
5. WHEN the User clicks sync button, THE PlayVibes System SHALL refresh the playlist list from Spotify and update metadata for all shared playlists

### Requirement 6

**User Story:** En tant qu'utilisateur, je veux écouter des playlists directement sur la plateforme, afin de prévisualiser la musique sans quitter l'application.

#### Acceptance Criteria

1. THE PlayVibes System SHALL integrate the Spotify Web Playback SDK for in-app music playback
2. WHEN the User clicks play on a playlist, THE PlayVibes System SHALL initialize the Spotify Player and start playback of the playlist
3. WHILE a playlist is playing, THE PlayVibes System SHALL display a persistent player bar at the bottom of the screen showing current track, artist, album art, and playback controls
4. THE PlayVibes System SHALL provide play, pause, next track, previous track, and volume controls in the player bar
5. WHEN the User navigates between pages, THE PlayVibes System SHALL maintain playback state and continue playing the current track

### Requirement 7

**User Story:** En tant qu'utilisateur, je veux voir les détails complets d'une playlist, afin de décider si je veux l'écouter ou la sauvegarder.

#### Acceptance Criteria

1. WHEN the User clicks on a playlist card, THE PlayVibes System SHALL open a detailed view modal or page
2. THE PlayVibes System SHALL display the playlist cover image, title, description, creator profile, track count, total duration, like count, and save count
3. THE PlayVibes System SHALL display the complete tracklist with track name, artist name, album name, and duration for each track
4. THE PlayVibes System SHALL display the comment section with all comments sorted by most recent first
5. THE PlayVibes System SHALL provide action buttons for play, like, save, and share within the detail view

### Requirement 8

**User Story:** En tant qu'utilisateur, je veux accéder à mes playlists sauvegardées facilement, afin de retrouver rapidement la musique que j'ai découverte.

#### Acceptance Criteria

1. WHEN the User accesses the Saved Page, THE PlayVibes System SHALL display all Saved Playlists with pagination of 20 playlists per page
2. THE PlayVibes System SHALL display each saved playlist with the same information as on the Browse Page
3. WHEN the User unsaves a playlist from the Saved Page, THE PlayVibes System SHALL remove it from the view immediately
4. IF the User has no saved playlists, THEN THE PlayVibes System SHALL display an empty state with a call-to-action button to browse playlists
5. THE PlayVibes System SHALL allow the User to play any saved playlist directly from the Saved Page

### Requirement 9

**User Story:** En tant qu'utilisateur, je veux une navigation fluide et intuitive, afin de me déplacer facilement entre les différentes sections de la plateforme.

#### Acceptance Criteria

1. THE PlayVibes System SHALL provide a persistent navigation bar on all pages with links to Browse, Manage, Saved, and Profile pages
2. THE PlayVibes System SHALL highlight the active page in the navigation bar
3. WHEN the User is on a mobile device, THE PlayVibes System SHALL provide a responsive hamburger menu for navigation
4. THE PlayVibes System SHALL display the User's profile picture and name in the navigation bar with a dropdown menu for logout
5. WHEN the User clicks logout, THE PlayVibes System SHALL sign out the User and redirect to the home page within 2 seconds

### Requirement 10

**User Story:** En tant qu'utilisateur, je veux que l'interface soit réactive et performante, afin d'avoir une expérience utilisateur agréable.

#### Acceptance Criteria

1. WHEN the User performs any action, THE PlayVibes System SHALL provide visual feedback within 100 milliseconds
2. WHEN the User loads a page, THE PlayVibes System SHALL display loading skeletons for content that is being fetched
3. THE PlayVibes System SHALL implement optimistic UI updates for like, save, and comment actions
4. WHEN an API request fails, THE PlayVibes System SHALL display an error message with a retry option
5. THE PlayVibes System SHALL cache playlist data for 5 minutes to reduce unnecessary API calls
