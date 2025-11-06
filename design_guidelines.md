# MagicPin Automation - Design Guidelines

## Design Approach

**System Selected**: Modern SaaS Dashboard Pattern inspired by Linear, Notion, and Asana
**Justification**: Utility-focused productivity tool requiring information density, clear hierarchy, and efficient workflows for managing multiple social platforms simultaneously.

## Core Design Principles

1. **Information Clarity**: Prioritize scannable layouts with clear visual hierarchy
2. **Efficient Workflows**: Minimize clicks for common actions (publish, schedule, connect accounts)
3. **Platform Recognition**: Use recognizable social media brand patterns without violating guidelines
4. **Data Visualization**: Clear metrics display with at-a-glance performance indicators

## Typography System

**Font Family**: Inter (Google Fonts) for all text
- **Headings**: 
  - H1: text-3xl font-bold (Dashboard titles)
  - H2: text-2xl font-semibold (Section headers)
  - H3: text-xl font-semibold (Card titles)
  - H4: text-lg font-medium (Subsections)
- **Body**: text-base font-normal (primary content)
- **Small**: text-sm (labels, metadata, timestamps)
- **Micro**: text-xs (badges, helper text)

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-2 (compact lists, tight groups)
- Standard spacing: p-4, gap-4 (cards, form fields)
- Section spacing: p-6 to p-8 (major sections)
- Page margins: p-8 to p-12 (main content areas)

**Grid Structure**:
- Sidebar navigation: w-64 fixed left
- Main content: Flexible width with max-w-7xl container
- Multi-column grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for platform cards
- Analytics: grid-cols-2 lg:grid-cols-4 for metric tiles

## Application Structure

### 1. Navigation (Persistent Sidebar)
- Fixed left sidebar (w-64)
- Logo at top (h-16)
- Primary navigation items with icons from Heroicons
- User profile at bottom
- Sections: Dashboard, Content Calendar, AI Generator, Connected Accounts, Analytics, Templates, Settings

### 2. Dashboard Layout
**Top Bar** (h-16, border-b):
- Page title (text-2xl font-bold)
- Quick action button "New Post" (right-aligned)
- Account switcher dropdown

**Main Content Grid**:
- **Connected Accounts Overview** (grid-cols-2 lg:grid-cols-4, gap-4)
  - Platform cards showing connection status
  - Platform logo, account name, follower count
  - Connection indicator dot
  
- **Recent Activity Feed** (2-column layout: 2/3 + 1/3)
  - Left: Scheduled posts list with platform badges
  - Right: Quick stats sidebar (engagement metrics)

- **Quick Actions Panel** (grid-cols-3, gap-4)
  - "Schedule Post" card
  - "Generate Content" card  
  - "View Analytics" card

### 3. Content Calendar Interface
- Month/Week/Day view tabs (horizontal tabs)
- Calendar grid with color-coded post indicators per platform
- Drag-and-drop scheduling zones
- Side panel: Post details when date selected

### 4. AI Content Generator
**Two-Column Layout**:
- Left (w-2/5): Input form
  - Platform multi-select checkboxes with icons
  - Topic/description textarea (h-32)
  - Tone selector (dropdown)
  - Generate button (w-full, prominent)
  
- Right (w-3/5): Generated content preview
  - Tabbed interface showing content for each selected platform
  - Platform-specific preview card (Instagram square, Twitter compact, etc.)
  - Edit/regenerate/schedule actions

### 5. Post Composer
**Modal/Full-screen overlay**:
- Platform selector pills at top (horizontal scroll)
- Rich text editor with formatting toolbar
- Media upload dropzone (border-2 border-dashed, h-48)
- Multi-platform preview grid below (shows how post appears on each network)
- Schedule options (date picker, time picker, recurrence settings)
- Primary action: "Schedule Post" / "Publish Now"

### 6. Analytics Dashboard
**Metric Cards** (grid-cols-2 lg:grid-cols-4):
- Total Posts, Total Reach, Engagement Rate, Best Performing Platform
- Each card: Large number (text-3xl font-bold), label (text-sm), trend indicator

**Charts Section**:
- Engagement timeline (line chart, h-64)
- Platform comparison (bar chart, h-64)
- Top performing posts (horizontal cards with thumbnails)

### 7. Connected Accounts Page
**Platform Grid** (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6):
- Each platform card (p-6, rounded-lg, border):
  - Platform logo and name (text-xl font-semibold)
  - Connection status badge
  - Account details (username, followers if connected)
  - "Connect" or "Disconnect" button
  - OAuth permissions list (text-sm)

## Component Library

### Cards
- Standard: rounded-lg, border, p-6, shadow-sm
- Hover: hover:shadow-md transition
- Header: border-b, pb-4, mb-4

### Buttons
- Primary: px-4 py-2, rounded-md, font-medium, w-auto or w-full as needed
- Secondary: px-4 py-2, rounded-md, border, font-medium
- Icon-only: p-2, rounded-md (for actions)

### Form Inputs
- Text/Textarea: w-full, px-3 py-2, rounded-md, border
- Select: w-full, px-3 py-2, rounded-md, border
- Checkbox: Custom styled with platform logos for multi-select

### Badges
- Status: px-2 py-1, rounded-full, text-xs font-medium
- Platform: Inline with platform icon, px-2 py-1, rounded

### Data Tables
- Striped rows for readability
- Sticky header (position-sticky top-0)
- Actions column (right-aligned)
- Sortable columns with icons

### Modals/Overlays
- Backdrop: Semi-transparent overlay
- Content: max-w-4xl, mx-auto, rounded-lg, shadow-xl
- Close button: Absolute top-right

## Platform Visual Identity
- Use official social media icons (from Font Awesome or custom icon set)
- Platform-specific accent treatments (subtle border or background tint on cards)
- Never use actual brand colors, use neutral presentation

## Responsive Behavior
- Mobile: Stack sidebar into top hamburger menu
- Tablet: Reduce grid columns (3-col becomes 2-col)
- Desktop: Full multi-column layouts with sidebar

## Animations
**Minimal and purposeful only**:
- Page transitions: Fade in (200ms)
- Modal open/close: Scale + fade (150ms)
- Dropdown menus: Slide down (100ms)
- No scroll-triggered animations

## Images
**Dashboard**: No hero image - purely functional interface
**Empty States**: Simple illustrations for "No posts scheduled", "No accounts connected" (placeholder SVG or icon-based)
**Post Previews**: User-uploaded media shows in preview cards
**Account Avatars**: Circular profile images (h-10 w-10) throughout interface

This design prioritizes **efficient information architecture** over visual spectacle, ensuring users can manage complex multi-platform workflows with minimal friction.