# Bible Version Switcher - Feature Documentation

## Overview
The Bible reader now supports multiple Bible versions with seamless switching between them.

## Supported Versions
1. **KJV (King James Version)** - Default version
   - Loaded from `/bible/bible_kjv.csv`
   - Classic English translation from 1611
   - 66 books (Protestant canon)

2. **NABRE (New American Bible Revised Edition)**
   - Loaded from `/bible/books/*.json`
   - Modern Catholic translation
   - 73 books (Catholic canon with Deuterocanonical books)

## Features Added

### 1. Version Selector Component
- **Location**: Sidebar, below the header
- **Functionality**: Dropdown menu to switch between KJV and NABRE
- **Persistence**: Version selection persists during the session

### 2. CSV Parser Utility
- **File**: `src/utils/csvParser.ts`
- **Purpose**: Parses the KJV CSV file into the same data structure as NABRE JSON
- **Features**:
  - Handles quoted text with commas
  - Organizes data by book → chapter → verse
  - Efficient Map-based storage for fast lookups

### 3. Visual Indicators
- **Version Badge**: Displays current version (KJV/NABRE) next to chapter title
- **Styling**: Blue badge with rounded corners, visible on all screen sizes

### 4. Smart Data Loading
- KJV CSV is loaded once on app initialization (cached in memory)
- NABRE JSON files are loaded on-demand per book
- Smooth transitions when switching versions
- Automatic reset to Chapter 1 when changing versions or books

## Technical Implementation

### Type System
```typescript
export type BibleVersion = 'KJV' | 'NABRE';
```

### Data Flow
1. User selects version from dropdown
2. App loads appropriate book list (from CSV or JSON)
3. User selects book and chapter
4. Content displays with version badge

### File Structure
```
src/
├── utils/
│   └── csvParser.ts          # KJV CSV parsing logic
├── components/
│   ├── VersionSelector.tsx   # Version dropdown component
│   └── VersionSelector.css   # Styling for selector
├── types/
│   └── bible.ts             # Updated with BibleVersion type
└── App.tsx                  # Main app with version switching logic
```

## User Experience

### Switching Versions
1. Open the sidebar
2. Look for "Version:" dropdown at the top
3. Select desired version (KJV or NABRE)
4. Content automatically updates
5. Book list updates to match version's canon

### Visual Differences
- **KJV**: Traditional English, 66 books
- **NABRE**: Modern English, 73 books (includes Tobit, Judith, Wisdom, Sirach, Baruch, 1-2 Maccabees)

## Performance Optimizations
- KJV CSV (62,000+ lines) parsed once and cached
- Lazy loading for NABRE books
- Efficient Map data structure for O(1) lookups
- HMR-friendly architecture for development

## Mobile Responsiveness
- Version selector adapts to mobile screen sizes
- Touch-friendly dropdown
- Visible version badge on all devices
