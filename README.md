# 5v5 Flag Football Play Designer

A comprehensive React-based application for designing, saving, and printing professional flag football plays. Create custom plays with an intuitive drag-and-drop interface and export them as print-ready playbooks.

![Flag Football Play Designer](https://img.shields.io/badge/React-18.x-blue) ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🏈 Features

### Core Functionality
- **Interactive Field Design**: Professional SVG football field with accurate markings
- **Drag & Drop Players**: Intuitive player positioning with 7 positions (QB, C, RB, WR1-WR4)
- **Predefined Route Library**: 15+ professional routes categorized by distance
- **Visual Route Assignment**: Color-coded routes with directional arrows
- **Professional Playbook Format**: Matches industry-standard playbook layouts

### Route Library
- **Short Routes (5-10 yards)**: Slant, Quick Out, Hitch, Screen, Pop
- **Medium Routes (10-20 yards)**: Comeback, Dig, Post, Corner, Deep Out
- **Long Routes (20+ yards)**: Go/Streak, Deep Post, Deep Corner, Fade

### Export & Print
- **Print Optimization**: Professional formatting for physical playbooks
- **PDF Export**: Download plays as PDF documents
- **Strategy Notes**: vs. Man Defense and vs. Zone Defense sections
- **Play Categories**: Quick Hit, Trick Play, Goal Line, Red Zone, etc.

### Technical Features
- **Local Storage**: Automatic save/load functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Touch Support**: Mobile-friendly drag and touch interactions
- **Component Architecture**: Modular React components for maintainability

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for development)
- Modern web browser (Chrome, Safari, Firefox, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jhousvawls/flagfootballdesigner.git
   cd flagfootballdesigner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Alternative: Standalone Version
For quick testing without Node.js:
```bash
# Serve with Python
python3 -m http.server 3000
# Open http://localhost:3000/standalone.html
```

## 📖 How to Use

### Creating a Play

1. **Enter Play Details**
   - Play name (required)
   - Category selection
   - Description
   - Strategy notes for vs. Man/Zone defense

2. **Position Players**
   - Click any player to select them
   - Drag players to reposition on the field
   - Selected player highlighted with yellow ring

3. **Assign Routes**
   - Select a player first
   - Choose from route library (Short/Medium/Long)
   - Click "Assign Route to Player"
   - Routes appear with color coding and labels

4. **Save Your Play**
   - Click "Save Play" to add to playbook
   - Plays automatically saved to browser storage

### Managing Your Playbook

- **View Plays**: All saved plays appear in the playbook panel
- **Delete Plays**: Click the X button on any play card
- **Print Playbook**: Use "Print Playbook" for browser printing
- **Export PDF**: Download plays as PDF document

## 🏗️ Project Structure

```
flag-football-designer/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── App.jsx              # Main application component
│   │   ├── PlayDesigner.jsx     # Play design workspace
│   │   ├── ControlsPanel.jsx    # Form controls and route selection
│   │   ├── Field.jsx            # Interactive SVG football field
│   │   ├── Player.jsx           # Draggable player components
│   │   ├── Playbook.jsx         # Saved plays display
│   │   └── PlayCard.jsx         # Individual play cards
│   ├── main.jsx                 # React entry point
│   ├── index.css               # Base styles
│   └── print.css               # Print-optimized styles
├── index.html                   # Vite HTML template
├── standalone.html              # Self-contained demo
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Component Architecture

### Core Components

- **App.jsx**: Root component managing global state and localStorage
- **PlayDesigner.jsx**: Main workspace with player/route state management
- **Field.jsx**: SVG field rendering with interactive elements
- **Player.jsx**: Individual draggable player with touch/mouse support

### UI Components

- **ControlsPanel.jsx**: Form inputs and route selection interface
- **Playbook.jsx**: Display grid of saved plays with export controls
- **PlayCard.jsx**: Individual play display with scaled field diagram

## 🔧 Technical Details

### State Management
- React Hooks (useState, useEffect, useCallback)
- Local state for play design
- Global state for saved plays
- Automatic localStorage persistence

### Styling
- Tailwind CSS for responsive design
- Custom print CSS for professional output
- SVG for crisp field graphics
- Color-coded route system

### Browser Support
- Chrome 90+
- Safari 14+
- Firefox 88+
- Edge 90+

## 📱 Mobile Support

The application is fully responsive and includes:
- Touch event handlers for mobile drag operations
- Responsive grid layouts
- Mobile-optimized button sizes
- Viewport-aware SVG scaling

## 🖨️ Print Features

### Print Optimization
- Professional page layouts
- Proper page breaks between plays
- Black and white compatibility
- Standard paper size formatting

### PDF Export
- Client-side PDF generation
- Play details and diagrams
- Multi-page support
- Download functionality

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Adding New Routes

Routes are defined in `PlayDesigner.jsx`:

```javascript
const ROUTE_LIBRARY = {
  short: {
    newRoute: { 
      name: 'New Route', 
      points: [{x: 0, y: 0}, {x: 10, y: -5}], 
      distance: 'short' 
    }
  }
};
```

### Customizing Field Dimensions

Field settings in `Field.jsx`:

```javascript
const fieldWidth = 600;   // SVG width
const fieldHeight = 400;  // SVG height
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by professional football playbook formats
- Built with React and modern web technologies
- Tailwind CSS for rapid UI development
- jsPDF for client-side PDF generation

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check the documentation
- Review the component code for implementation details

---

**Made with ❤️ for flag football coaches and players**
