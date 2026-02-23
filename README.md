# Task Management Tool - Frontend

A modern, responsive Next.js frontend application for managing tasks with user authentication and real-time updates.

## 🎨 Features

- **User Authentication**: Secure login and registration system
- **Task Dashboard**: Create, view, update, and delete tasks
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Modern UI**: Built with React and Next.js 16
- **Real-time Updates**: Axios for API communication
- **Form Validation**: Client-side validation for user inputs
- **Error Handling**: Comprehensive error messages and feedback
- **Icons**: React Icons for UI enhancements
- **TypeScript Support**: Full TypeScript configuration for type safety

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see Backend README)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-tool/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.0.10 | React framework |
| react | 19.2.1 | UI library |
| react-dom | 19.2.1 | DOM rendering |
| axios | ^1.13.2 | HTTP client |
| swr | ^2.3.7 | Data fetching and caching |
| react-icons | ^5.5.0 | Icon library |
| tailwindcss | ^4 | Utility-first CSS framework |
| typescript | ^5 | Type safety |
| eslint | ^9 | Code linting |

## 📁 Project Structure

```
frontend/
├── pages/
│   ├── index.js              # Home page
│   ├── login.js              # Login page
│   ├── register.js           # Registration page
│   ├── dashboard.js          # Task dashboard
│   ├── dashboard_new.js      # New dashboard variant
│   └── _app.js               # App wrapper
├── components/               # Reusable React components
├── utils/
│   └── api.js                # API configuration and helpers
├── styles/
│   ├── globals.css           # Global styles
│   └── Dashboard.module.css  # Component-specific styles
├── public/                   # Static assets
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── postcss.config.mjs        # PostCSS configuration
├── eslint.config.mjs         # ESLint configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 🚀 Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint for code quality
npm run lint
```

## 🔐 Authentication Flow

1. **Register**: New users create account at `/register`
2. **Login**: Users authenticate at `/login`
3. **Token Storage**: JWT token stored in browser (localStorage/sessionStorage)
4. **Protected Routes**: Dashboard requires valid authentication token
5. **Auto-logout**: Invalid/expired tokens trigger automatic logout

## 📄 Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Home/Landing page |
| `/register` | User registration |
| `/login` | User login |
| `/dashboard` | Task management dashboard |

## 🎯 Key Features Explained

### Authentication Pages
- **Login** (`/login`): Secure user authentication with error handling
- **Register** (`/register`): New user registration with validation

### Dashboard Features
- **Create Tasks**: Add new tasks with title and description
- **View Tasks**: Display all user tasks in organized layout
- **Update Tasks**: Edit task details and status
- **Delete Tasks**: Remove completed or unwanted tasks
- **Task Filtering**: Filter by status and priority
- **Responsive Cards**: Mobile-friendly task card layout

### Error Handling
- Network errors with retry options
- Form validation before submission
- User-friendly error messages
- Automatic logout on authentication failures

## 🔌 API Integration

All API calls are configured in `utils/api.js`:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Example: Login request
POST ${API_URL}/auth/login
Body: { email, password }
```

### Key API Endpoints Used

- `POST /auth/register` - Register new user
- `POST /auth/login` - Authenticate user
- `GET /tasks` - Fetch all tasks (requires token)
- `POST /tasks` - Create new task (requires token)
- `PUT /tasks/:id` - Update task (requires token)
- `DELETE /tasks/:id` - Delete task (requires token)

## 🎨 Styling

### Tailwind CSS
Utility-first CSS framework for rapid UI development. Configuration in `tailwind.config.mjs`.

### Custom Styles
- `Dashboard.module.css` - Dashboard-specific styles
- `globals.css` - Global styles and resets

### Theme Configuration
Customize colors, fonts, and spacing in Tailwind config.

## 🧪 Development Tips

### Using React Developer Tools
- Install React DevTools browser extension
- Inspect component props and state
- Check component tree and updates

### Network Debugging
- Open browser DevTools → Network tab
- Check API requests/responses
- Verify token in request headers

### Local Storage Inspection
- DevTools → Application → Storage
- Check saved authentication token
- Monitor localStorage changes

## 🚀 Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| NEXT_PUBLIC_API_URL | Backend API base URL | http://localhost:5000/api |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🐛 Troubleshooting

- **API Connection Error**: Verify backend is running and `NEXT_PUBLIC_API_URL` is correct
- **Login/Register Failing**: Check backend API responses in browser DevTools
- **Port Already in Use**: Kill process on port 3000 or change port with `PORT=3001 npm run dev`
- **Styles Not Loading**: Clear Next.js cache with `rm -rf .next` then `npm run dev`
- **Authentication Lost**: Check browser localStorage for token, verify token expiration

## 🔗 Related Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com)

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Build amazing things!** ✨
