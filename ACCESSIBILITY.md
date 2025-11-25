# Accessibility Documentation

This document outlines the accessibility features implemented in the PlayVibes platform to ensure WCAG 2.1 AA compliance.

## Overview

PlayVibes is committed to providing an accessible experience for all users, including those using assistive technologies such as screen readers, keyboard-only navigation, and other accessibility tools.

## Implemented Features

### 1. Keyboard Navigation

#### Focus Management
- **Visible Focus Indicators**: All interactive elements have clear, high-contrast focus indicators (2px primary color ring with 2px offset)
- **Focus Styles**: Applied to buttons, links, inputs, textareas, selects, and custom interactive elements
- **Tab Order**: Logical tab order follows visual layout and content hierarchy

#### Keyboard Shortcuts
- **Playback Controls**:
  - `Space`: Play/Pause
  - `Left Arrow`: Previous track
  - `Right Arrow`: Next track
- **Modal Navigation**:
  - `Escape`: Close modals and dialogs
- **Skip Navigation**:
  - `Tab` from page load: Access "Skip to main content" link

### 2. ARIA Labels and Landmarks

#### Semantic HTML
- `<header role="banner">`: Main navigation header
- `<main id="main-content">`: Main content area on all pages
- `<nav aria-label="...">`: Navigation sections with descriptive labels
- `<article>`: Playlist cards
- `<dialog role="dialog" aria-modal="true">`: Modal dialogs

#### ARIA Attributes
- **Buttons**: `aria-label` for icon-only buttons
- **Expandable Sections**: `aria-expanded`, `aria-controls`
- **Dropdowns**: `aria-haspopup`, `aria-expanded`
- **Form Controls**: `aria-describedby`, `aria-invalid`, `aria-live`
- **Sliders**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`
- **Status Messages**: `aria-live="polite"` for dynamic content updates

### 3. Screen Reader Support

#### Text Alternatives
- **Images**: All images have descriptive `alt` text or are marked `aria-hidden="true"` if decorative
- **Icons**: Decorative icons marked with `aria-hidden="true"`, functional icons have `aria-label`
- **Screen Reader Only Text**: `.sr-only` class for visually hidden but screen-reader accessible text

#### Live Regions
- Character counters in forms use `aria-live="polite"`
- Toast notifications are announced to screen readers
- Loading states and error messages are properly announced

#### Form Labels
- All form inputs have associated `<label>` elements
- Labels use `for` attribute or wrap the input
- Hidden labels use `.sr-only` class when visual label is not needed

### 4. Color Contrast (WCAG AA)

#### Text Contrast Ratios
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text** (18pt+): Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio for interactive elements

#### Color Scheme
- Light mode uses dark text on light backgrounds
- Dark mode uses light text on dark backgrounds
- Primary color (oklch values) ensures sufficient contrast
- Muted colors maintain readability

#### Non-Color Indicators
- Interactive states don't rely solely on color
- Focus indicators use both color and border
- Error states use icons in addition to color
- Required fields marked with asterisk and label text

### 5. Touch Targets

#### Minimum Sizes
- **Mobile Touch Targets**: Minimum 44x44px (iOS/Android guidelines)
- **Desktop Click Targets**: Minimum 44x44px for consistency
- **Spacing**: Adequate spacing between interactive elements

#### Implementation
- All buttons use `min-w-[44px] min-h-[44px]` classes
- Touch-friendly utility classes: `.touch-target`, `.touch-target-lg`
- Mobile menu items have increased padding

### 6. Responsive Design

#### Mobile Optimization
- Hamburger menu for mobile navigation
- Full-screen modals on mobile devices
- Larger text sizes on mobile (responsive typography)
- Collapsible sections for better mobile UX

#### Viewport Support
- Responsive breakpoints: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- Safe area insets for devices with notches
- Flexible layouts that adapt to screen size

### 7. Error Handling

#### Error Messages
- Clear, descriptive error messages
- Error states indicated with color, icon, and text
- Form validation errors associated with inputs via `aria-describedby`
- Retry options provided for failed operations

#### Loading States
- Loading indicators for async operations
- Skeleton screens during content loading
- Disabled state for buttons during processing
- Progress indicators for long operations

## Testing Recommendations

### Manual Testing
1. **Keyboard Navigation**:
   - Navigate entire site using only keyboard
   - Verify all interactive elements are reachable
   - Check focus indicators are visible
   - Test keyboard shortcuts

2. **Screen Reader Testing**:
   - Test with NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
   - Verify all content is announced correctly
   - Check form labels and error messages
   - Test modal dialogs and dynamic content

3. **Color Contrast**:
   - Use browser DevTools or WebAIM Contrast Checker
   - Verify all text meets WCAG AA standards
   - Test in both light and dark modes

4. **Touch Target Testing**:
   - Test on actual mobile devices
   - Verify all buttons are easily tappable
   - Check spacing between interactive elements

### Automated Testing Tools
- **axe DevTools**: Browser extension for accessibility auditing
- **Lighthouse**: Chrome DevTools accessibility audit
- **WAVE**: Web accessibility evaluation tool
- **Pa11y**: Command-line accessibility testing

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

1. **Spotify Web Playback SDK**: Some playback controls are limited by Spotify's SDK capabilities
2. **Third-party Content**: Playlist images and descriptions from Spotify may not always have optimal alt text
3. **Dynamic Content**: Some real-time updates may require page refresh for full screen reader support

## Future Improvements

1. **Enhanced Keyboard Navigation**:
   - Add more keyboard shortcuts
   - Implement roving tabindex for complex widgets
   - Add keyboard navigation for playlist grids

2. **Improved Screen Reader Support**:
   - Add more descriptive ARIA labels
   - Implement better live region announcements
   - Add skip links for repeated content

3. **Customization Options**:
   - User preference for reduced motion
   - Font size adjustment controls
   - High contrast mode toggle

4. **Additional Testing**:
   - Regular automated accessibility audits
   - User testing with people who use assistive technologies
   - Continuous monitoring and improvement

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/resources/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Contact

For accessibility concerns or suggestions, please open an issue on the project repository.
