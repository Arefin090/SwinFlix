# 🎬 FinnFlix

A (not so modern😔) modern, Netflix-inspired movie discovery platform built with Vue.js 3, featuring user authentication, personalized movie lists, and a fully responsive design.

<!-- ![FinnFlix Screenshot] will add later  -->

## 📚 Project Evolution

This project began as an assignment during my early days in Uni and has since evolved into a showcase of modern web development practices. What started as a basic CRUD application has been continuously refined with:

- **Modern Architecture**: Migrated from basic Vue patterns to Vue 3 Composition API
- **Responsive Design**: Complete mobile-first redesign with Tailwind CSS
- **Professional Practices**: Added proper state management, error handling, and code organization
- **Engineering Excellence**: Implementing testing, TypeScript, and performance optimizations

This project represents both my learning journey and current capabilities as an Engineer

## ✨ Features

- **Movie Discovery**: Browse popular movies, search by title, and explore by genre
- **User Authentication**: Secure login/signup with Firebase Auth
- **Fully Responsive**: Mobile-first design that works on all devices
- **Personal Lists**: Add movies to your watchlist and manage viewing history
- **Modern UI**: Netflix-inspired design with smooth animations and hover effects
- **Trailer Integration**: Watch movie trailers directly in the app
- **⚡ Real-time Updates**: Instant synchronization across devices

## 🚀 Tech Stack

### Frontend

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Pinia** - Modern state management for Vue.js
- **Vue Router 4** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript

### Backend & Services

- **Firebase Auth** - User authentication
- **Firebase Firestore** - NoSQL database
- **TMDB API** - Movie data and metadata

### Development & Testing

- **Vitest** - Unit testing framework
- **Vue Test Utils** - Vue component testing utilities
- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **Vercel** - Deployment and hosting

## 🛠️ Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase project with Auth and Firestore enabled
- TMDB API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Arefin090/FinnFlix.git
   cd FinnFlix
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   VUE_APP_TMDB_API_KEY=your_tmdb_api_key
   VUE_APP_FIREBASE_API_KEY=your_firebase_api_key
   VUE_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VUE_APP_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

4. **Start development server**

   ```bash
   npm run serve
   ```

5. **Open your browser**

   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── MovieBooking.vue    # Movie card component
│   ├── MovieExplorer.vue   # Main browse interface
│   ├── UserLogin.vue       # Authentication
│   └── ...
├── stores/             # Pinia stores
│   ├── auth.ts            # Authentication state
│   ├── movies.ts          # Movies data management
│   └── watchlist.ts       # User watchlist
├── services/           # API services
│   ├── firebaseService.ts # Firebase operations
│   └── tmdbApi.ts         # TMDB API client
├── composables/        # Vue composables
├── types/             # TypeScript definitions
│   ├── index.ts           # Core types
│   ├── api.ts             # API response types
│   └── components.ts      # Component prop types
├── tests/             # Unit tests
├── utils/             # Utility functions
├── firebase.ts        # Firebase configuration
├── router.ts          # Vue Router configuration
└── main.ts           # Application entry point
```

## 🎯 Roadmap

### Architecture Improvements (Completed ✅)

- [x] **State Management**: Migrated to Pinia for reactive state handling
- [x] **TypeScript Integration**: Full TypeScript conversion with strict typing
- [x] **Service Layer**: Proper API abstraction and error handling
- [x] **Testing**: Comprehensive unit test suite with Vitest
- [x] **Development Workflow**: ESLint, Prettier, Husky pre-commit hooks
- [x] **Performance**: Caching strategies and optimization

### Feature Enhancements (Planned)

- [ ] **Advanced Search**: AI-powered search with filters
- [ ] **Social Features**: User reviews and ratings
- [ ] **Recommendations**: Personalized movie suggestions
- [ ] **Offline Support**: PWA capabilities
- [ ] **Multi-language**: Internationalization support

## 🧪 Development

### Available Scripts

```bash
npm run serve         # Start development server
npm run build         # Build for production
npm run lint          # Run ESLint
npm run lint:fix      # Run ESLint with auto-fix
npm run format        # Format code with Prettier
npm run format:check  # Check code formatting
npm run type-check    # Run TypeScript type checking
npm run test          # Run unit tests
npm run test:coverage # Run tests with coverage report
```

### Code Style

This project uses ESLint and Prettier for code formatting. The configuration follows Vue.js 3 best practices with TypeScript support.

## 🚀 Deployment

The application is automatically deployed to Vercel on every push to the master branch.

**Live Demo**: [https://finn-flix.vercel.app](https://finn-flix.vercel.app)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Firebase](https://firebase.google.com/) for authentication and database services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- Netflix for design inspiration

---

**Built with ❤️ by yours truly** | [Portfolio](https://aarefin.com) | [LinkedIn](https://linkedin.com/in/arefin-n-sojol)
