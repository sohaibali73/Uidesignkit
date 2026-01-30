# Analyst by Potomac - Complete UI Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [Design System](#design-system)
3. [Authentication](#authentication)
4. [Navigation & Layout](#navigation--layout)
5. [Core Features](#core-features)
6. [Settings & Customization](#settings--customization)
7. [Admin Panel](#admin-panel)
8. [Responsive Design](#responsive-design)

---

## Overview

**Analyst by Potomac** is a comprehensive AI-powered AFL (AmiBroker Formula Language) code generation and trading strategy analysis platform. The UI is built with React, TypeScript, and custom styling using the Quicksand and Rajdhani font families.

### Brand Identity
- **Primary Color**: Potomac Yellow (#FEC00F)
- **Typography**: 
  - Headings: Rajdhani (Bold, uppercase, wide letter-spacing)
  - Body: Quicksand (Clean, modern sans-serif)
- **Theme**: Dark mode by default with light mode and system preference support

---

## Design System

### Color Palette

#### Dark Theme (Default)
- **Background**: #121212
- **Card Background**: #1E1E1E
- **Input Background**: #2A2A2A
- **Border**: #424242
- **Text Primary**: #FFFFFF
- **Text Muted**: #9E9E9E
- **Text Secondary**: #757575
- **Accent**: #FEC00F (Potomac Yellow)
- **Success**: #2D7F3E / #22C55E
- **Error**: #DC2626
- **Warning**: #FF9800
- **Info**: #2196F3

#### Light Theme
- **Background**: #FFFFFF
- **Card Background**: #F8F9FA
- **Input Background**: #F5F5F5
- **Border**: #E0E0E0
- **Text Primary**: #212121
- **Text Muted**: #757575
- **Text Secondary**: #9E9E9E

### Typography
- **Headings**: Rajdhani (700 weight, uppercase, 1-2px letter-spacing)
- **Body Text**: Quicksand (400-600 weight)
- **Code**: Fira Code, Monaco, Consolas (monospace)

### Component Patterns
- **Border Radius**: 8-12px for cards, 6-8px for buttons/inputs
- **Shadows**: Subtle elevation with `0 2px 8px rgba(0,0,0,0.08)`
- **Transitions**: 0.2-0.3s ease for smooth interactions
- **Hover States**: Border color changes to #FEC00F, slight scale transforms

---

## Authentication

### Login Page (`LoginPage.tsx`)

#### Layout
- **Split Screen Design**:
  - **Left Panel**: Branding, features showcase, background patterns
  - **Right Panel**: Login form (500px width on desktop, full width on mobile)

#### Features
1. **Branding Section**
   - Animated background with radial gradients
   - Grid pattern overlay (50px × 50px)
   - Logo display (100px × 100px, rounded)
   - "ANALYST BY POTOMAC" title with yellow accent
   - Tagline: "Break the status quo"

2. **Feature Highlights**
   - AI-Powered Code Generation (Zap icon)
   - Advanced Backtest Analysis (BarChart3 icon)
   - Enterprise-Grade Security (Shield icon)
   - Each feature in a card with yellow accent border

3. **Login Form**
   - Email input field
   - Password input with show/hide toggle (Eye/EyeOff icons)
   - "Forgot password?" link
   - Sign in button with loading state (Loader2 animation)
   - Error message display with AlertCircle icon
   - Link to registration page

4. **Visual Effects**
   - Focus states with yellow border and glow
   - Smooth transitions on all interactive elements
   - Responsive padding for mobile devices
   - Safe area insets for mobile browsers

### Registration Page
- Similar design to login page
- Additional fields for user registration
- Account creation flow

---

## Navigation & Layout

### Main Layout (`MainLayout.tsx`)

#### Sidebar Navigation
- **Collapsible Sidebar**: 256px expanded, 80px collapsed (0px on mobile)
- **Logo Section**: 
  - Yellow logo (40px × 40px)
  - "ANALYST" text (hidden when collapsed)
  - Collapse/expand button (ChevronLeft/ChevronRight)

#### Navigation Items
1. **Dashboard** (LayoutDashboard icon)
2. **AFL Generator** (Code2 icon)
3. **Chat** (MessageCircle icon)
4. **Researcher** (TrendingUp icon)
5. **Training** (BookOpen icon)
6. **Knowledge Base** (Database icon)
7. **Backtest** (TrendingUp icon)
8. **Reverse Engineer** (Zap icon)
9. **Admin** (Lock icon) - Admin only
10. **Settings** (Settings icon)

#### Navigation Features
- Active state highlighting with yellow background
- Hover effects with background color change
- Icon-only view when collapsed
- Tooltips on collapsed items
- Smooth width transitions

#### User Section
- User avatar (circular gradient, first letter of name)
- User name and email (hidden when collapsed)
- Logout button with red accent

#### Mobile Navigation
- Hamburger menu toggle
- Full-screen overlay menu
- Backdrop click to close
- Sticky header with logo

---

## Core Features

### 1. Dashboard (`DashboardPage.tsx`)

#### Header Section
- Welcome message with user name in yellow
- Tagline: "Your AI-powered AFL code generation and trading strategy studio"
- Primary CTA: "GENERATE CODE NOW" button

#### Statistics Cards
- **Total Strategies**: Count of generated AFL codes
- **Documents Uploaded**: Knowledge base document count
- **Backtests Analyzed**: Total backtest analyses
- Each card shows:
  - Icon indicator
  - Large number display (Rajdhani font)
  - Subtitle with context
  - Optional trend indicator

#### Feature Cards Grid
- **AFL Generator**: Blue accent (#3B82F6)
- **AI Chat**: Purple accent (#8B5CF6)
- **Knowledge Base**: Green accent (#22C55E)
- **Backtest Analysis**: Orange accent (#F97316)
- **Reverse Engineer**: Yellow accent (#FEC00F)

Each card includes:
- Colored icon
- Feature title
- Description
- "Get Started" link with arrow
- Hover effect with border color change

#### Recent Activity
- Timeline of recent actions
- Activity items with timestamps
- Empty state message for new users

---

### 2. AFL Generator (`AFLGeneratorPage.tsx`)

#### Input Panel (Left)
1. **Strategy Type Selector**
   - Standalone Strategy
   - Entry Signal
   - Exit Signal

2. **Strategy Description**
   - Large textarea (200px min-height)
   - Placeholder with example
   - Character counter (optional)

3. **Generate Button**
   - Sparkles icon
   - Loading state with spinner
   - Disabled when empty

4. **Tips Section**
   - Best practices for better results
   - Bulleted list of suggestions

#### Output Panel (Right)
1. **Header Actions**
   - Copy button (Copy/Check icons)
   - Download button (.afl file)

2. **Code Display**
   - Dark code editor background (#0D1117)
   - Line numbers (right-aligned, gray)
   - Syntax highlighting:
     - Comments: #6A9955 (green)
     - Keywords (Buy/Sell): #FEC00F (yellow)
     - Functions: #DCDCAA (yellow-tan)
     - Variables: #9CDCFE (blue)
     - Numbers: #B5CEA8 (light green)
   - Scrollable container

3. **Action Buttons**
   - Optimize (Zap icon)
   - Debug (Bug icon)
   - Explain (Lightbulb icon)
   - Feedback (MessageSquare icon) - Opens feedback modal

4. **Empty State**
   - Zap icon (48px, opacity 0.5)
   - "Generate code to see results here" message

---

### 3. AI Chat (`ChatPage.tsx`)

#### Layout
- **Sidebar** (300px): Conversations list
- **Main Area**: Active chat interface

#### Conversations Sidebar
1. **Header**
   - "CONVERSATIONS" title
   - New conversation button (Plus icon, yellow background)

2. **Conversation List**
   - Each conversation shows:
     - MessageSquare icon
     - Conversation title (truncated)
     - Active state highlighting
     - Delete button (Trash2 icon, red on hover)
   - Loading state with spinner
   - Empty state with icon and message

#### Chat Interface
1. **Chat Header**
   - AI avatar (yellow logo, 40px × 40px)
   - "AI Assistant" title
   - "Always here to help" subtitle
   - Clear chat button (X icon)

2. **Messages Area**
   - User messages:
     - Right-aligned
     - Yellow background (#FEC00F)
     - Dark text (#212121)
     - Rounded corners (20px 20px 4px 20px)
     - User avatar (circular gradient)
   
   - Assistant messages:
     - Left-aligned
     - Gray background (#2A2A2A dark, #f0f0f0 light)
     - AI avatar (yellow logo)
     - Rounded corners (20px 20px 20px 4px)
     - Code block rendering with syntax highlighting
     - Copy button for code blocks
     - Tools used badges (if applicable)
   
   - Timestamp display (Clock icon, HH:MM format)
   - Loading indicator (3 bouncing dots)

3. **Code Block Rendering**
   - Language label (uppercase, yellow)
   - Copy button with success state
   - Syntax highlighting
   - Line wrapping
   - Scrollable for long code

4. **Text Formatting**
   - **Bold**: `**text**`
   - *Italic*: `*text*`
   - `Inline code`: Highlighted background
   - Line breaks preserved

5. **Input Area**
   - File upload button (Paperclip icon)
   - Multi-line textarea (56px min-height, 200px max-height)
   - Send button (Send icon, yellow when active)
   - Keyboard shortcuts:
     - Enter: Send message
     - Shift+Enter: New line
   - Placeholder: "Describe your trading strategy or ask a question..."

6. **Empty State**
   - Large MessageSquare icon (64px, opacity 0.3)
   - "Start a conversation" message
   - Helpful prompt suggestion

---

### 4. Knowledge Base (`KnowledgeBasePage.tsx`)

#### Statistics Cards
- **Total Documents**: Count with icon
- **Total Size**: Formatted file size (B/KB/MB)
- **Categories**: Number of unique categories

#### Upload Section
1. **Drag & Drop Area**
   - Dashed border (2px, #424242)
   - Upload icon (32px)
   - "Click to upload files" text
   - Supported formats: PDF, TXT, DOC, DOCX
   - Multiple file selection
   - Hover effect (border changes to yellow)

2. **Upload Progress**
   - Progress bar with percentage
   - File count (completed/total)
   - Failed uploads indicator
   - Individual file status

#### Search Section
1. **Search Input**
   - Search icon (left-aligned)
   - Placeholder: "Search documents..."
   - Search button (yellow background)
   - Loading state

2. **Search Results**
   - Result cards with:
     - Filename
     - Content excerpt (2 lines max)
     - Relevance score (percentage)
   - Scrollable container (250px max-height)

#### Documents List
1. **Header**
   - "DOCUMENTS" title
   - Document count

2. **Document Items**
   - FileText icon (yellow)
   - Filename (truncated)
   - Metadata:
     - Category
     - File size
     - Upload date
   - Delete button (Trash2 icon, red on hover)
   - Hover effect (background color change)

3. **Empty State**
   - Database icon (48px, opacity 0.5)
   - "No documents yet" message
   - Upload prompt

---

### 5. Backtest Analysis (`BacktestPage.tsx`)

#### Upload Section
- Drag & drop area for CSV/JSON files
- Max file size: 100MB
- Upload icon with loading state
- Error message display

#### Backtest Results Grid
Each backtest card shows:

1. **Header**
   - Strategy ID (first 8 characters)
   - Upload date
   - BarChart3 icon (blue)

2. **Total Return**
   - Large percentage display
   - Green (positive) or red (negative)
   - Arrow indicator (up/down)
   - Progress bar visualization

3. **Win Rate**
   - Percentage display
   - Blue color (#3B82F6)
   - Progress bar

4. **Metrics Grid**
   - **Max Drawdown**: Red, percentage
   - **Sharpe Ratio**: Yellow, decimal

5. **AI Insights**
   - Zap icon (yellow)
   - "AI INSIGHTS" label
   - Generated analysis text
   - Recommendations

#### Empty State
- TrendingUp icon (64px, opacity 0.3)
- "No backtests yet" message
- Upload prompt

---

### 6. Reverse Engineer (`ReverseEngineerPage.tsx`)

#### Progress Steps
Visual stepper showing:
1. **DESCRIBE**: FileText icon - "Describe the strategy"
2. **RESEARCH**: Search icon - "AI researches components"
3. **SCHEMATIC**: GitBranch icon - "Generate architecture"
4. **CODE**: Code icon - "Generate AFL code"

Each step shows:
- Icon (24px)
- Label (uppercase, Rajdhani)
- Description
- Active state (yellow background)
- Complete state (green background with checkmark)
- Progress line between steps

#### Left Panel
**Initial State (Step 0)**:
- Large textarea for strategy description
- "START ANALYSIS" button with arrow

**Chat State (Steps 1-4)**:
- Chat header with AI avatar
- Message history:
  - User messages (right-aligned, yellow)
  - AI messages (left-aligned, gray)
  - Timestamps
- Chat input with send button
- Action buttons:
  - Reset (RefreshCw icon)
  - Generate Schematic (Step 2)
  - Generate Code (Step 3)

#### Right Panel
**Output Display**:
- Header with title and copy button
- Content area:
  - **Schematic**: Text-based architecture diagram
  - **Code**: Syntax-highlighted AFL code
  - Empty state with Zap icon

---

### 7. Researcher (`Researcher.tsx`)

#### Dashboard View
1. **Search Section**
   - Large search input with Search icon
   - Placeholder: "Enter stock symbol (AAPL, MSFT, GOOGL)"
   - "Research" button (yellow)

2. **Research Tools Grid**
   - **Company Research** (Building icon)
   - **Strategy Analysis** (TrendingUp icon)
   - **Peer Comparison** (BarChart3 icon)
   - **News Analysis** (Newspaper icon)
   - **Macro Context** (DollarSign icon)
   - **Settings** (Settings icon)

Each tool card:
- Icon (28px, yellow)
- Title (uppercase, Rajdhani)
- Description
- Hover effect (yellow border, shadow)

3. **Recent Activity**
   - Activity history
   - Empty state for new users

#### Company Research View
1. **Header**
   - Company symbol (large, uppercase)
   - Company name and sector
   - Back button

2. **Key Metrics Grid**
   - P/E Ratio
   - Market Cap
   - Revenue Growth
   - Earnings Growth (with change indicator)

3. **Analyst Consensus Card**
   - Rating (large, green)
   - CheckCircle icon
   - Target price
   - Buy/Hold/Sell counts (color-coded)

4. **Insider Activity Card**
   - Recent buys (green, positive)
   - Recent sells (red, negative)
   - Net position

5. **Price Action Card**
   - Current price (large)
   - Daily change (with arrow indicator)

6. **AI Analysis Summary**
   - Gray background
   - Generated summary text
   - Readable paragraph format

7. **Action Buttons**
   - Generate Report (yellow)
   - Compare Peers (white with border)

---

### 8. Training Page (`TrainingPage.tsx`)

#### Tab Navigation
1. **Overview**: Statistics and progress
2. **Test Training**: Compare with/without training
3. **Knowledge Base**: Search training examples
4. **Suggestions**: User-submitted training ideas
5. **Feedback**: User feedback on generated code

#### Overview Tab
1. **Statistics Grid**
   - Total Examples
   - Active Examples
   - Feedback Submitted
   - Suggestions Made

2. **Learning Progress**
   - Chart placeholder for quality improvements

3. **Popular Patterns**
   - Grid of training pattern cards
   - Usage count
   - Category and type

4. **Action Buttons**
   - Test Training (Play icon, yellow)
   - Suggest Training (Lightbulb icon)
   - Submit Feedback (MessageCircle icon)

#### Test Training Tab
- Prompt input textarea
- "Run Test" button
- Results comparison:
  - Without training (left)
  - With training (right)
  - Differences indicator

#### Knowledge Base Tab
- Search input
- Search button
- Results grid with:
  - Training type badge
  - Title
  - Excerpt
  - Relevance score
  - Category

#### Suggestions Tab
- List of user suggestions
- Status badges:
  - Pending (yellow)
  - Approved (green)
  - Implemented (blue)
  - Rejected (red)
- Suggestion details:
  - Title
  - Description
  - Example input/output
  - Creation date

#### Feedback Tab
- List of user feedback
- Feedback type icons:
  - Praise (ThumbsUp, green)
  - Correction (AlertTriangle, blue)
  - Improvement (Zap, orange)
  - Bug (AlertCircle, red)
- Rating display (stars)
- Feedback text
- Correct code (if provided)
- Status and date

---

## Settings & Customization

### Settings Page (`SettingsPage.tsx`)

#### Sidebar Navigation
- Profile
- API Keys
- Appearance
- Notifications
- Security
- Logout button (red)

#### Profile Section
1. **Avatar Display**
   - Circular gradient (80px)
   - First letter of name

2. **Profile Fields**
   - Full Name
   - Nickname
   - Email Address

#### API Keys Section
1. **Security Notice**
   - Shield icon (yellow)
   - Encryption message

2. **Claude API Key**
   - Required badge (green)
   - Password input with show/hide toggle
   - Link to Anthropic console

3. **Tavily API Key**
   - Optional badge (gray)
   - Password input with show/hide toggle

#### Appearance Section
1. **Theme Selection**
   - Light (Sun icon)
   - Dark (Moon icon)
   - System (Monitor icon)
   - Each option shows:
     - Icon (32px)
     - Label
     - Description
     - Selected state (yellow border, checkmark)

2. **Accent Color**
   - Color swatches (48px × 48px):
     - Potomac Yellow (#FEC00F)
     - Blue (#3B82F6)
     - Green (#22C55E)
     - Purple (#8B5CF6)
     - Orange (#F97316)
     - Pink (#EC4899)
   - Selected state (white border, checkmark)

3. **Font Size**
   - Small / Medium / Large buttons
   - Selected state (yellow background)

#### Notifications Section
Toggle switches for:
- Email Notifications
- Code Generation Complete
- Backtest Analysis Complete
- Weekly Digest

Each toggle shows:
- Label and description
- Switch (52px × 28px)
- Active state (yellow background)

#### Security Section
1. **Change Password**
   - Current password input
   - New password input
   - Confirm password input
   - "UPDATE PASSWORD" button

2. **Danger Zone**
   - AlertTriangle icon (red)
   - Warning message
   - "DELETE ACCOUNT" button (red border)

#### Save Button
- Fixed at bottom of content
- "SAVE CHANGES" button (yellow)
- Success state: "SAVED!" with checkmark

---

## Admin Panel

### Admin Page (`AdminPage.tsx`)

#### Tab Navigation
1. **Overview**: System statistics
2. **Users**: User management
3. **Content**: Training management
4. **Settings**: Feedback and suggestions

#### Overview Tab
1. **System Statistics**
   - Total Users
   - Training Examples
   - Active Training
   - Documents

2. **Feedback Analytics**
   - Total Feedback
   - Average Rating
   - Corrections
   - Pending Review

3. **Code Generation Stats**
   - Codes Generated
   - Training Examples
   - Pending Suggestions

#### Users Tab
- User table with columns:
  - Username
  - Email
  - Status (Active/Inactive)
  - Codes Generated
  - Joined Date
- Sortable columns
- Pagination

#### Content Tab
- Training examples table:
  - Title
  - Type
  - Category
  - Priority
  - Status (Active/Inactive)
- Limit: 10 items displayed

#### Settings Tab
1. **Pending Reviews**
   - Pending Feedback count
   - Pending Suggestions count

2. **Recent Feedback**
   - Feedback type
   - Rating (stars)
   - Feedback text (truncated)
   - Status badge

3. **Recent Suggestions**
   - Title
   - Status badge (color-coded)
   - Priority

---

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations

#### Navigation
- Sidebar hidden by default
- Hamburger menu in header
- Full-screen overlay menu
- Backdrop click to close

#### Layout
- Single column layouts
- Reduced padding (24px → 16px)
- Smaller font sizes
- Touch-friendly button sizes (min 44px)

#### Components
- Stacked cards instead of grids
- Collapsible sections
- Bottom sheet modals
- Swipe gestures (where applicable)

#### Typography
- Reduced heading sizes (48px → 24px)
- Adjusted line heights
- Shorter text truncation

### Tablet Adaptations
- 2-column grids
- Sidebar visible but collapsible
- Medium padding (32px)
- Balanced font sizes

### Touch Interactions
- Larger tap targets (44px minimum)
- Swipe gestures for navigation
- Pull-to-refresh (where applicable)
- Touch feedback (ripple effects)

---

## Modals & Dialogs

### Feedback Modal (`FeedbackModal.tsx`)

#### Structure
- Fixed overlay (rgba(0,0,0,0.7))
- Centered modal (600px max-width)
- Rounded corners (16px)
- Close button (X icon)

#### Content
1. **Header**
   - "PROVIDE FEEDBACK" title
   - Subtitle: "Help us improve the AI"

2. **Feedback Type Selection**
   - Grid of 4 options:
     - Correction (AlertCircle icon)
     - Improvement (MessageSquare icon)
     - Bug Report (Bug icon)
     - Praise (ThumbsUp icon)
   - Selected state (yellow border)

3. **Rating**
   - 5-star rating buttons
   - Selected state (yellow background)

4. **Feedback Details**
   - Large textarea (120px min-height)
   - Required field

5. **Correct Code** (for corrections)
   - Code textarea (monospace font)
   - Optional field

6. **Footer Actions**
   - Cancel button
   - Submit button (yellow, with loading state)

#### Success State
- ThumbsUp icon (64px, green background)
- "Thank You!" message
- Auto-close after 2 seconds

---

## Animations & Transitions

### Loading States
- **Spinner**: Rotating Loader2 icon
- **Skeleton**: Pulsing gray rectangles
- **Dots**: Bouncing animation (3 dots)
- **Progress Bar**: Smooth width transition

### Hover Effects
- Border color change to yellow
- Background color lightening
- Scale transform (1.05)
- Shadow increase
- Transition: 0.2s ease

### Focus States
- Yellow border (2px)
- Glow effect (box-shadow)
- Outline removal (custom focus ring)

### Page Transitions
- Fade in (opacity 0 → 1)
- Slide up (translateY 10px → 0)
- Duration: 0.3s ease

### Button States
- **Default**: Base styling
- **Hover**: Opacity 0.9 or background change
- **Active**: Scale 0.98
- **Disabled**: Opacity 0.6, cursor not-allowed
- **Loading**: Spinner animation

---

## Accessibility Features

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators (yellow outline)
- Escape key closes modals
- Enter key submits forms
- Arrow keys for navigation (where applicable)

### Screen Reader Support
- Semantic HTML elements
- ARIA labels on icons
- Alt text on images
- Role attributes
- Live regions for dynamic content

### Color Contrast
- WCAG AA compliant
- Text contrast ratios:
  - Normal text: 4.5:1 minimum
  - Large text: 3:1 minimum
- Focus indicators visible

### Form Accessibility
- Label associations
- Error messages
- Required field indicators
- Placeholder text (not relied upon)
- Validation feedback

---

## Performance Optimizations

### Code Splitting
- Route-based splitting
- Lazy loading components
- Dynamic imports

### Image Optimization
- SVG icons (scalable, small)
- Optimized PNG logos
- Lazy loading images

### State Management
- Context API for global state
- Local state for component-specific data
- Memoization for expensive computations

### Rendering Optimization
- React.memo for pure components
- useCallback for event handlers
- useMemo for derived values
- Virtual scrolling for long lists

---

## Browser Support

### Supported Browsers
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest version

### Progressive Enhancement
- Core functionality without JavaScript
- Graceful degradation
- Fallback fonts
- CSS feature detection

---

## Error Handling

### Error Display
- Alert components with icons
- Toast notifications
- Inline validation messages
- Error boundaries for crashes

### Error States
- Network errors
- Validation errors
- Permission errors
- Server errors
- Empty states

### User Feedback
- Loading indicators
- Success messages
- Error messages
- Progress indicators
- Confirmation dialogs

---

## Summary

The Analyst by Potomac UI is a comprehensive, modern web application featuring:

✅ **10+ Core Features**: AFL Generator, Chat, Knowledge Base, Backtest, Reverse Engineer, Researcher, Training, Admin, Settings, Dashboard

✅ **Responsive Design**: Mobile-first approach with tablet and desktop optimizations

✅ **Theme Support**: Dark mode (default), light mode, and system preference

✅ **Customization**: Accent color selection, font size adjustment

✅ **Accessibility**: WCAG AA compliant, keyboard navigation, screen reader support

✅ **Performance**: Code splitting, lazy loading, optimized rendering

✅ **Professional Design**: Consistent branding, smooth animations, intuitive UX

The UI emphasizes clarity, efficiency, and user empowerment with AI-powered tools for trading strategy development and analysis.
