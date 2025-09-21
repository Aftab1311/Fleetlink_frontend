# FleetLink Frontend

A production-grade React frontend for the FleetLink Logistics Vehicle Booking System.

## 🚀 Features

- **Modern React Application**: Built with React 18, functional components, and hooks
- **Professional UI**: Clean and responsive design with TailwindCSS
- **Complete Vehicle Management**: Add vehicles, search availability, and book rides
- **Real-time Booking**: Search and book vehicles with date-time selection
- **Booking Management**: View, track, and manage all bookings
- **Production Ready**: Docker support, error handling, and optimized builds
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📦 Tech Stack

- **React 18** - Frontend framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **TailwindCSS** - Utility-first CSS framework
- **React DatePicker** - Date and time selection
- **Docker** - Containerization and deployment

## 🏗️ Project Structure

```
fleet_frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/                 # API layer
│   │   ├── axios.js         # Axios configuration
│   │   ├── vehicleApi.js    # Vehicle API functions
│   │   ├── bookingApi.js    # Booking API functions
│   │   └── index.js         # API exports
│   ├── components/          # Reusable components
│   │   ├── Layout/
│   │   │   └── Navbar.jsx   # Navigation component
│   │   └── UI/              # UI components
│   │       ├── Alert.jsx    # Alert/notification component
│   │       ├── Button.jsx   # Button component
│   │       ├── Card.jsx     # Card container component
│   │       ├── Input.jsx    # Input field component
│   │       ├── LoadingSpinner.jsx # Loading indicator
│   │       └── index.js     # UI exports
│   ├── pages/               # Main pages
│   │   ├── AddVehicle.jsx   # Add new vehicle page
│   │   ├── SearchAndBook.jsx # Search & book vehicles page
│   │   └── Bookings.jsx     # Bookings management page
│   ├── App.jsx              # Main App component
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
├── nginx.conf               # Nginx configuration
├── tailwind.config.js       # TailwindCSS configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm 8+
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone and navigate to the frontend directory:**
   ```bash
   cd fleet_frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed to match your backend URL.

4. **Start development server:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3001`

## 🐳 Docker Deployment

### Development with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build and run manually
docker build -t fleetlink-frontend .
docker run -p 3001:80 fleetlink-frontend
```

### Production Deployment

```bash
# Build production image
docker build -t fleetlink-frontend:latest .

# Run in production mode
docker run -d \
  --name fleet-frontend \
  -p 3001:80 \
  --restart unless-stopped \
  fleetlink-frontend:latest
```

## 📱 Application Pages

### 1. Search & Book Vehicles (`/`)
- **Search Form**: Filter vehicles by capacity, route (pincodes), and date/time
- **Results Display**: View available vehicles with details
- **Instant Booking**: Book vehicles directly from search results
- **Real-time Validation**: Form validation and error handling

### 2. Add Vehicle (`/add-vehicle`)
- **Vehicle Form**: Add new vehicles with name, capacity, tyres, type
- **Validation**: Comprehensive form validation
- **Success Feedback**: Confirmation messages and error handling

### 3. Bookings Management (`/bookings`)
- **Booking List**: View all bookings with filtering options
- **Status Management**: Update booking status (confirm, start, complete)
- **Cancellation**: Cancel bookings (with time restrictions)
- **Detailed View**: Complete booking information with vehicle details

## 🎨 UI Components

### Core Components
- **Alert**: Success/error/warning notifications
- **Button**: Styled buttons with loading states and variants
- **Card**: Container component with consistent styling
- **Input**: Form input with validation and icons
- **LoadingSpinner**: Loading indicators with different sizes

### Design System
- **Colors**: Primary blue, success green, warning yellow, error red
- **Typography**: Inter font with consistent sizing
- **Spacing**: Tailwind's spacing scale for consistency
- **Responsive**: Mobile-first responsive design

## 🔧 API Integration

### Centralized API Layer
- **Axios Configuration**: Base URL, timeouts, interceptors
- **Error Handling**: Consistent error responses
- **Request/Response Logging**: Development debugging
- **Type Safety**: Structured API responses

### API Functions
- **Vehicle APIs**: Add, search, get, update, delete vehicles
- **Booking APIs**: Create, get, cancel, update bookings
- **Error Handling**: Graceful error handling with user feedback

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Docker commands
npm run docker:build
npm run docker:run
```

### Environment Variables

```env
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:3000/api

# Environment
REACT_APP_ENV=development

# Default Customer ID for demo
REACT_APP_DEFAULT_CUSTOMER_ID=demo-customer-001
```

## 🌐 Production Features

### Performance Optimization
- **Code Splitting**: Automatic code splitting with React
- **Asset Optimization**: Minified CSS and JS
- **Gzip Compression**: Nginx gzip compression
- **Caching**: Static asset caching headers

### Security
- **Content Security Policy**: CSP headers
- **XSS Protection**: Security headers
- **CORS Handling**: Proper CORS configuration

### Monitoring
- **Health Checks**: Docker health check endpoint
- **Error Logging**: Console error logging
- **Performance Monitoring**: Web Vitals integration

## 🔄 API Endpoints Used

### Vehicle Endpoints
- `POST /api/vehicles` - Add new vehicle
- `GET /api/vehicles/available` - Search available vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get vehicle by ID

### Booking Endpoints
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `DELETE /api/bookings/:id` - Cancel booking
- `PATCH /api/bookings/:id/status` - Update booking status

## 🚨 Error Handling

### Client-Side Error Handling
- **Form Validation**: Real-time form validation
- **API Errors**: User-friendly error messages
- **Network Errors**: Connection error handling
- **Loading States**: Loading indicators during API calls

### User Feedback
- **Success Messages**: Confirmation for successful actions
- **Error Alerts**: Clear error messages with dismissal
- **Loading States**: Visual feedback during operations

## 📝 Best Practices

### Code Organization
- **Component Structure**: Logical component organization
- **API Layer**: Centralized API management
- **Reusable Components**: DRY principle implementation
- **Consistent Styling**: Design system approach

### Performance
- **Lazy Loading**: Route-based code splitting
- **Optimized Images**: Proper image handling
- **Minimal Bundle Size**: Tree shaking and optimization
- **Caching Strategy**: Proper caching implementation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact the FleetLink team or create an issue in the repository.

---

**FleetLink Frontend** - Professional vehicle booking system built with modern React and TailwindCSS.
#   F l e e t l i n k _ f r o n t e n d 
 
 
