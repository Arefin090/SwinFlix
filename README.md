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
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Swiper.js** - Touch slider components

### Backend & Services
- **Firebase Auth** - User authentication
- **Firebase Firestore** - NoSQL database
- **TMDB API** - Movie data and metadata

### Development & Deployment
- **Vite** - Build tool and development server
- **ESLint** - Code linting
- **Prettier** - Code formatting
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
├── services/           # API services (planned)
├── composables/        # Vue composables (planned)
├── types/             # TypeScript definitions (planned)
├── utils/             # Utility functions (planned)
├── firebase.js        # Firebase configuration
├── router.js          # Vue Router configuration
└── main.js           # Application entry point
```

## 🎯 Roadmap

### Architecture Improvements (In Progress)
- [ ] **State Management**: Migrate to Pinia for better state handling
- [ ] **TypeScript Integration**: Full TypeScript conversion
- [ ] **Service Layer**: Proper API abstraction and error handling
- [ ] **Testing**: Unit and integration test setup
- [ ] **Performance**: Caching and optimization strategies

### Feature Enhancements (Planned)
- [ ] **Advanced Search**: AI-powered search with filters
- [ ] **Social Features**: User reviews and ratings
- [ ] **Recommendations**: Personalized movie suggestions
- [ ] **Offline Support**: PWA capabilities
- [ ] **Multi-language**: Internationalization support

## 🧪 Development

### Available Scripts
```bash
npm run serve      # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run test       # Run tests (coming soon)
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