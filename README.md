# CDPTA Platform

Center for Drug Policy & Technology Assessment (CDPTA) - A comprehensive React TypeScript platform with role-based access control for Applicants, Fellows, Staff, and Administrators.

## 🚀 Features

### User Roles & Permissions
- **Applicants**: Submit fellowship applications directly without registration, track status, upload research documents
- **Fellows**: Access drug policy research courses, manage projects, track progress
- **Staff**: Mentor fellows, manage research programs, review applications
- **Admin**: System administration, user management, research analytics

### Application Process
- **Direct Application**: Applicants can apply directly at `/apply` without creating an account
- **Simplified Form**: 4-step application process (Personal Info → Education → Documents → Review)
- **No Essay Requirements**: Streamlined application without mandatory essay questions
- **Auto-save**: Application progress is automatically saved as users work

### Core Features
- ✅ Role-based authentication and authorization
- ✅ Responsive UI with Tailwind CSS
- ✅ Type-safe development with TypeScript
- ✅ Modern React with hooks and context
- ✅ Protected routes and navigation
- ✅ Toast notifications
- ✅ Loading states and error handling
- ✅ Clean component architecture

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Testing framework
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   ├── ui/            # Base UI components (Button, Card, Input, etc.)
│   ├── ProtectedRoute.tsx
│   └── ErrorBoundary.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboards/    # Role-specific dashboards
│   ├── applicant/     # Applicant-specific pages
│   ├── fellow/        # Fellow-specific pages
│   ├── staff/         # Staff-specific pages
│   └── admin/         # Admin-specific pages
├── routes/            # Routing configuration
│   └── AppRoutes.tsx
├── services/          # API services
│   ├── apiClient.ts
│   └── authService.ts
├── types/             # TypeScript type definitions
│   ├── auth.ts
│   └── index.ts
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
└── App.tsx
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd educational-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript compiler check
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate test coverage report

## 🔐 Authentication

The application includes a complete authentication system with:

- **Login/Register** - Email and password authentication
- **Password Reset** - Forgot password functionality
- **Role-based Access** - Different permissions per user role
- **Protected Routes** - Automatic redirection for unauthorized access
- **Token Management** - JWT with automatic refresh

### Demo Credentials

For testing purposes, you can use these demo credentials:

- **Admin**: admin@example.com / password123
- **Staff**: staff@example.com / password123  
- **Fellow**: fellow@example.com / password123
- **Applicant**: applicant@example.com / password123

## 🎨 UI Components

The application includes a comprehensive set of reusable UI components:

- **Button** - Various styles and sizes
- **Card** - Structured content containers
- **Input** - Form input with validation
- **LoadingSpinner** - Loading indicators
- **Toast** - Notification system

All components are built with:
- TypeScript for type safety
- Tailwind CSS for styling
- Accessibility best practices
- Responsive design

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_NODE_ENV=development
VITE_APP_NAME=Educational Platform
```

### API Integration

The application is designed to work with a REST API. Update the API base URL in your environment variables and implement the backend endpoints according to the service interfaces.

## 🏗️ Architecture

### State Management
- **React Context** - User authentication state
- **React Query** - Server state and caching
- **Zustand** - Client-side state (if needed)

### Routing
- **Protected Routes** - Role-based access control
- **Dynamic Routing** - User-specific navigation
- **Route Guards** - Permission checking

### Error Handling
- **Error Boundaries** - Graceful error recovery
- **Toast Notifications** - User feedback
- **Loading States** - Better UX during async operations

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options

- **Vercel** - Recommended for React apps
- **Netlify** - Static site hosting
- **AWS S3** - With CloudFront CDN
- **Traditional hosting** - Any static file server

## 🔮 Future Enhancements

### Planned Features
- [ ] Real-time notifications with WebSocket
- [ ] File upload and document management
- [ ] Advanced course content management
- [ ] Video conferencing integration
- [ ] Mobile app with React Native
- [ ] Offline support with PWA
- [ ] Advanced analytics dashboard
- [ ] Multi-language support (i18n)

### Technical Improvements
- [ ] Backend API implementation
- [ ] Database integration
- [ ] End-to-end testing with Playwright
- [ ] Performance monitoring
- [ ] CI/CD pipeline
- [ ] Docker containerization

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the excellent framework
- Tailwind CSS for the utility-first approach
- Vite for the lightning-fast build tool
- All the open source contributors

---

## 📞 Support

If you have any questions or need help, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

**Built with ❤️ using React + TypeScript + Tailwind CSS**
