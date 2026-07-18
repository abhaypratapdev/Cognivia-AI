# Congivia AI Frontend 

The modern, responsive React UI for Congivia AI - an AI-powered learning platform. Built with React 19, Vite, and Tailwind CSS.

##  Tech Stack

- **React** 19 - Modern UI library with latest features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **React Router** v7 - Client-side routing
- **Firebase** - Authentication and cloud services
- **Framer Motion** - Smooth animations and transitions
- **Lottie React** - Animated JSON illustrations
- **ReCharts** - Data visualization library
- **React Flow** - Node-based graph visualization
- **React Calendar** - Date selection component
- **React PDF** - PDF rendering
- **PDF.js** - Advanced PDF handling
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client

##  Directory Structure

```
frontend/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ App.jsx                    # Main app component
â”‚   â”œâ”€â”€ main.jsx                   # Entry point
â”‚   â”œâ”€â”€ App.css                    # Global styles
â”‚   â”œâ”€â”€ index.css                  # Global CSS
â”‚   â”œâ”€â”€ pdf-worker.js              # PDF worker configuration
â”‚   â”œâ”€â”€ assets/                    # Images, icons, static files
â”‚   â”œâ”€â”€ components/                # Reusable components
â”‚   â”‚   â”œâ”€â”€ LoadingSpinner.jsx
â”‚   â”‚   â”œâ”€â”€ Notifications.jsx
â”‚   â”‚   â”œâ”€â”€ ProtectedRoute.jsx
â”‚   â”‚   â”œâ”€â”€ SmartDocViewer.jsx
â”‚   â”‚   â”œâ”€â”€ SmartPDFViewer.jsx
â”‚   â”‚   â”œâ”€â”€ Chat/
â”‚   â”‚   â”œâ”€â”€ ChatBot/
â”‚   â”‚   â”œâ”€â”€ DraggableComponents/   # Draggable window system
â”‚   â”‚   â”œâ”€â”€ Error404/
â”‚   â”‚   â”œâ”€â”€ ErrorBoundary/
â”‚   â”‚   â”œâ”€â”€ FileUpload/
â”‚   â”‚   â”œâ”€â”€ Layout/
â”‚   â”‚   â”œâ”€â”€ Navbar/
â”‚   â”‚   â”œâ”€â”€ Sidebar/
â”‚   â”‚   â””â”€â”€ Notifications/
â”‚   â”œâ”€â”€ contexts/                  # React Context API
â”‚   â”‚   â”œâ”€â”€ AuthContext.jsx        # Authentication state
â”‚   â”‚   â”œâ”€â”€ SocketContext.jsx      # Socket.io state
â”‚   â”‚   â””â”€â”€ ThemeContext.jsx       # Theme management
â”‚   â”œâ”€â”€ pages/                     # Page components
â”‚   â”‚   â”œâ”€â”€ Landing.jsx            # Homepage
â”‚   â”‚   â”œâ”€â”€ Login.jsx              # Login page
â”‚   â”‚   â”œâ”€â”€ Signup.jsx             # Registration page
â”‚   â”‚   â”œâ”€â”€ Dashboard.jsx          # User dashboard
â”‚   â”‚   â”œâ”€â”€ SmartSummarizer.jsx    # Summarization tool
â”‚   â”‚   â”œâ”€â”€ Quiz/                  # Quiz pages
â”‚   â”‚   â”œâ”€â”€ Planner/               # Revision planner
â”‚   â”‚   â”œâ”€â”€ Profile.jsx            # User profile
â”‚   â”‚   â”œâ”€â”€ MindMap.jsx            # Mind mapping
â”‚   â”‚   â”œâ”€â”€ BuySell/               # Marketplace
â”‚   â”‚   â”œâ”€â”€ LostFound/             # Lost & Found
â”‚   â”‚   â”œâ”€â”€ Leaderboard.jsx        # Leaderboard
â”‚   â”‚   â”œâ”€â”€ ForgotPassword/        # Password recovery
â”‚   â”‚   â””â”€â”€ NotFound.jsx           # 404 page
â”‚   â””â”€â”€ utils/                     # Utility functions
â”‚       â”œâ”€â”€ api.js                 # API client setup
â”‚       â”œâ”€â”€ constants.js           # Constants and config
â”‚       â”œâ”€â”€ cloudinaryUpload.js    # Cloudinary integration
â”‚       â”œâ”€â”€ firebaseUpload.js      # Firebase integration
â”‚       â”œâ”€â”€ pdfText.js             # PDF text extraction
â”‚       â””â”€â”€ summaryApi.js          # Summary API calls
â”œâ”€â”€ public/
â”‚   â””â”€â”€ pdf-worker/                # PDF.js worker files
â”œâ”€â”€ index.html                     # HTML entry point
â”œâ”€â”€ vite.config.js                 # Vite configuration
â”œâ”€â”€ tailwind.config.js             # Tailwind CSS config
â”œâ”€â”€ postcss.config.js              # PostCSS config
â”œâ”€â”€ eslint.config.js               # ESLint configuration
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

##  Core Features

### 1. **Authentication**
   - User registration and login
   - Email verification
   - Password reset functionality
   - JWT token management
   - Protected routes

### 2. **Document Management**
   - File upload interface
   - Multiple file format support
   - Cloud storage integration (Cloudinary)
   - File preview (PDF, images)
   - File organization and management

### 3. **Smart Content Tools**
   - **Summarizer**: AI-powered text summarization with multiple formats
   - **Flashcards**: Interactive study flashcards
   - **Quiz Generator**: Auto-generated quizzes with scoring
   - **Mind Mapper**: Visual knowledge mapping with React Flow

### 4. **Learning Features**
   - Revision Planner with calendar scheduling
   - Progress tracking and analytics
   - Dashboard with statistics
   - Learning streak tracking
   - Personalized recommendations

### 5. **Real-time Features**
   - Live chat interface
   - Real-time notifications
   - Socket.io powered updates
   - Instant file processing feedback

### 6. **Community & Marketplace**
   - Buy/Sell section for study materials
   - Lost & Found section
   - Leaderboard system
   - User profiles
   - Social engagement

##  Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

##  Page Routes

```
/                      - Landing page
/login                 - Login page
/signup                - Registration page
/dashboard             - User dashboard
/summarizer            - Smart summarizer tool
/quiz                  - Quiz features
/planner               - Revision planner
/profile               - User profile
/mind-map              - Mind mapping
/buy-sell              - Marketplace
/lost-found            - Lost & Found section
/leaderboard           - Leaderboard
/forgot-password       - Password recovery
/404                   - Not found page
```

##  Component Architecture

### Layout Components
- **Navbar**: Top navigation with user menu
- **Sidebar**: Navigation sidebar
- **Layout**: Main layout wrapper

### Feature Components
- **SmartDocViewer**: Document preview and text selection
- **SmartPDFViewer**: Advanced PDF rendering
- **Chat**: Chat interface for real-time communication
- **DraggableComponents**: Draggable window system for multi-tasking

### Utility Components
- **LoadingSpinner**: Loading state indicator
- **ProtectedRoute**: Route protection wrapper
- **ErrorBoundary**: Error handling wrapper
- **Notifications**: Toast notifications

##  State Management

### Context API Usage

#### AuthContext
```javascript
{
  user: { id, name, email, profilePicture },
  token: JWT_TOKEN,
  isAuthenticated: Boolean,
  login: Function,
  logout: Function,
  signup: Function
}
```

#### SocketContext
```javascript
{
  socket: Socket.io instance,
  isConnected: Boolean,
  notifications: Array,
  messages: Array
}
```

#### ThemeContext
```javascript
{
  theme: 'light' | 'dark',
  toggleTheme: Function
}
```

##  API Integration

### API Base URL Configuration
```javascript
// utils/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'

// Auto-includes JWT token in headers
```

### API Endpoints Used
- Authentication: `/auth/login`, `/auth/signup`, `/auth/refresh-token`
- Files: `/upload`, `/files`, `/file/:id`
- Summaries: `/summary/generate`, `/summary/:fileId`
- Flashcards: `/flashcards/generate`, `/flashcards/:fileId`
- Quizzes: `/quiz/generate`, `/quiz/:id/submit`
- Dashboard: `/dashboard/stats`, `/dashboard/recent-files`

##  Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Tailwind CSS responsive utilities
- Flexible grid layouts
- Mobile-optimized navigation
- Touch-friendly interactions

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

##  Animations & Transitions

- **Framer Motion**: Smooth page transitions and component animations
- **Lottie**: Animated illustrations and loaders
- **CSS Transitions**: Tailwind CSS transition utilities
- **Hover Effects**: Interactive feedback on buttons and links

##  Authentication Flow

1. User enters credentials
2. Submit to `/auth/login` endpoint
3. Receive JWT token
4. Token stored in context
5. Token sent in headers for authenticated requests
6. Protected routes check authentication
7. Logout clears token

##  Data Visualization

- **ReCharts**: Progress charts, statistics visualization
- **React Flow**: Mind mapping and knowledge graphs
- **React Calendar**: Event scheduling and planning

##  Performance Optimizations

- **Code Splitting**: Route-based code splitting with React Router
- **Lazy Loading**: Component and image lazy loading
- **Memoization**: React.memo for component optimization
- **Vite Optimization**: Fast module resolution and HMR
- **Bundle Analysis**: Optimized bundle size

##  Security Features

- JWT token management
- Protected routes
- Secure API communication
- Environment variables for sensitive data
- XSS prevention with React's built-in escaping
- CSRF protection

##  Testing & Debugging

### Development Tools
- React Developer Tools
- Redux DevTools (if Redux used)
- Network inspection in DevTools
- Console logging for debugging

### Common Commands
```bash
# Start dev server with debugging
npm run dev

# Build and test production
npm run build && npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix
```

##  Deployment

### Build for Production
```bash
npm run build
```

This creates a `dist/` folder with optimized assets.

### Deploy to Render.com
- Push code to repository
- Connect Render.com to repository
- Configure build command: `npm install && npm run build`
- Configure start command: `npm run preview`

##  Best Practices

1. **Component Structure**: Keep components small and focused
2. **State Management**: Use Context for global state
3. **API Calls**: Centralize in utils/api.js
4. **Styling**: Use Tailwind utilities, avoid inline styles
5. **Naming**: Use descriptive, consistent naming
6. **Error Handling**: Implement try-catch and error boundaries
7. **Accessibility**: Use semantic HTML and ARIA attributes
8. **Performance**: Use lazy loading and code splitting

##  Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 5173
# Windows: netstat -ano | findstr :5173
# Then: taskkill /PID <PID> /F
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

**Hot Module Replacement not working:**
```bash
# Restart dev server
npm run dev
```

**Build fails:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

##  License

This project is proprietary. All rights reserved.

---

**Happy coding!** For more information, see the main [README.md](../README.md)
