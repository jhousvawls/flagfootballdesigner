# Changelog

All notable changes to the Flag Football Play Designer will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-09-16

### Fixed
- **CRITICAL**: Route Scaling Issue - Routes now properly scaled to field dimensions
- **Route Coordinates**: Fixed tiny route coordinates (12-35px) to realistic proportions (40-120px)
- **Visual Impact**: Routes now use 10-30% of field space instead of 3-9%
- **Route Accuracy**: Corrected Post route from diagonal to proper L-shaped cut
- **Label Positioning**: Smart route label positioning to avoid player overlap

### Changed
- **Route Library**: Completely rescaled all route coordinates for realistic proportions
  - Short routes: 40-60px (10-15% of field)
  - Medium routes: 60-90px (15-25% of field) 
  - Long routes: 90-120px (25-35% of field)
- **Hitch Route**: Fixed from 3-point comeback to proper 2-point stop route
- **Post Route**: Changed from diagonal to sharp L-shaped cut toward center
- **Advanced Routes**: Updated Comeback, Dig, and Fade routes with proper scaling

### Technical
- Enhanced route coordinate system in `PlayDesigner.jsx`
- Improved route label positioning algorithm in `Field.jsx`
- Added field-position awareness for directional routes
- Maintained SVG path generation compatibility
- Added route scaling documentation and comments

### Visual Improvements
- Routes now appear professional and realistic on field
- Better visual hierarchy between short, medium, and long routes
- Improved route label readability with smart positioning
- Enhanced overall play diagram quality

## [1.3.0] - 2025-09-16

### Added
- **Hand-Drawn Play Import**: Upload photos of hand-drawn plays and digitize them
- **Image Upload Component**: Drag-and-drop interface supporting JPG, PNG, HEIC files up to 10MB
- **Image Overlay Controls**: Comprehensive positioning system with opacity, scale, rotation, and translation
- **Import Mode**: Visual indicator and workflow for importing hand-drawn plays
- **Reference Image Overlay**: Semi-transparent background image on field for tracing
- **Non-destructive Workflow**: Original images preserved as reference only

### Changed
- **Field Component**: Enhanced to support background image rendering with proper layering
- **PlayDesigner**: Added import state management and image handling functionality
- **User Interface**: New import section with intuitive controls and visual feedback

### Technical
- Added `src/components/ImageUpload.jsx` for file upload functionality
- Added `src/components/ImageOverlay.jsx` for image positioning controls
- Enhanced `Field.jsx` with SVG image element and transform support
- Updated `PlayDesigner.jsx` with import state management
- Comprehensive file validation and error handling
- Mobile-friendly touch controls for image manipulation

### Documentation
- Updated README.md with comprehensive import feature documentation
- Added step-by-step usage instructions for hand-drawn play import
- Enhanced technical documentation with new component architecture

## [1.2.1] - 2025-09-16

### Changed
- **Field Optimization**: Removed unnecessary vertical yard lines and hash marks
- **Clean Design**: Simplified field appearance while maintaining essential markings
- **Print Efficiency**: Further reduced visual clutter for better print output

### Removed
- All yard lines except the 50-yard line (center divider)
- Hash marks at yard line positions
- Maintained sidelines, goal lines, end zones, and line of scrimmage

### Technical
- Updated `Field.jsx` to remove yard line and hash mark generation
- Preserved essential field boundaries and functionality
- Improved visual clarity for play design

## [1.2.0] - 2025-09-16

### Added
- **Cloud Storage**: Supabase integration for persistent data storage
- **Offline Support**: Automatic fallback to localStorage when offline
- **Real-time Sync**: Cloud synchronization with visual status indicators
- **Sync Status UI**: Header indicators showing connection status (synced/syncing/offline/error)
- **Error Recovery**: Automatic retry functionality for failed sync operations
- **Data Persistence**: Plays survive browser data clearing and device changes
- **Loading States**: Visual feedback during data operations

### Changed
- **Storage Architecture**: Hybrid cloud/local storage system
- **App Component**: Enhanced with cloud sync state management
- **Playbook Component**: Added loading states and offline indicators
- **Play Management**: Improved save/delete operations with cloud backup

### Technical
- Added `src/utils/supabaseOperations.js` for cloud database operations
- Enhanced `App.jsx` with sync status management and error handling
- Updated `Playbook.jsx` with loading states and sync status display
- Implemented automatic retry mechanisms for network failures
- Added comprehensive error handling and user feedback

### Infrastructure
- Supabase database schema for plays table
- MCP server integration for database operations
- Cloud-first architecture with local fallback
- Real-time synchronization capabilities

## [1.1.0] - 2025-09-16

### Changed
- **BREAKING**: Updated to proper 5v5 formation with 5 players (QB, C, RB, WR1, WR2)
- **Field Design**: Changed field background from green to white for print optimization
- **Print Efficiency**: Significantly reduced ink usage for printed playbooks
- **Field Lines**: Updated all field markings to black for better print contrast

### Removed
- WR3 and WR4 positions (corrected to proper 5v5 formation)

### Technical
- Updated `PlayDesigner.jsx` default player formation
- Modified `Field.jsx` and `PlayCard.jsx` color schemes
- Enhanced `print.css` for white field optimization
- Updated `ControlsPanel.jsx` player mappings

## [1.0.0] - 2025-09-16

### Added
- Initial release of 5v5 Flag Football Play Designer
- Interactive SVG football field with professional markings
- Drag-and-drop player positioning system
- Comprehensive route library with 15+ predefined routes
- Route categorization (Short, Medium, Long distance)
- Visual route assignment with color coding
- Professional playbook format matching industry standards
- Play details form with categories and strategy notes
- Local storage for automatic play persistence
- Print optimization for professional playbook output
- PDF export functionality using jsPDF
- Mobile responsive design with touch support
- Component-based React architecture
- Tailwind CSS styling system
- Comprehensive documentation and contributing guidelines

### Features
- **Player Management**: 5 player positions (QB, C, RB, WR1, WR2)
- **Route Library**: 
  - Short Routes: Slant, Quick Out, Hitch, Screen, Pop
  - Medium Routes: Comeback, Dig, Post, Corner, Deep Out
  - Long Routes: Go/Streak, Deep Post, Deep Corner, Fade
- **Play Categories**: Quick Hit, Trick Play, Goal Line, Red Zone, Short Yardage, Long Yardage, Screen, Running Play
- **Export Options**: Browser print and PDF download
- **Strategy Integration**: vs. Man Defense and vs. Zone Defense sections
- **Cross-Platform**: Desktop and mobile browser support

### Technical
- React 18.x with functional components and hooks
- Vite build system for fast development
- SVG-based field rendering for crisp graphics
- Touch event handling for mobile devices
- localStorage API for data persistence
- Print CSS media queries for professional output
- Responsive grid layouts with Tailwind CSS

### Documentation
- Comprehensive README with setup instructions
- Contributing guidelines for developers
- MIT License for open source usage
- Component architecture documentation
- Development and deployment guides

---

## Future Releases

### Planned Features
- [ ] Team customization (colors, logos, names)
- [ ] AI-powered strategy suggestions
- [x] Cloud storage and sharing
- [ ] Animation preview of plays
- [ ] Formation templates
- [ ] Advanced route drawing tools
- [ ] Multi-team playbook management
- [ ] Export to coaching software formats
- [ ] Play ordering and sorting functionality

### Technical Improvements
- [ ] TypeScript migration
- [ ] Unit and integration tests
- [ ] Performance optimizations
- [ ] Accessibility enhancements
- [ ] PWA capabilities
- [x] Offline functionality

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
