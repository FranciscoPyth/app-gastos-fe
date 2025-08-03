# 💰 Expense Management App (Frontend)

A modern React-based expense management application that helps users track, categorize, and analyze their personal finances with voice input capabilities and comprehensive reporting features.

## 🚀 Features

### Core Functionality
- **Expense Registration**: Add new expenses with detailed information
- **Voice Input**: Register expenses using voice commands and speech recognition
- **Expense Management**: View, edit, and delete expense records
- **Categorization**: Organize expenses by custom categories
- **Payment Methods**: Track different payment methods used
- **Transaction Types**: Categorize transactions by type (income/expense)
- **Multi-Currency Support**: Handle expenses in different currencies
- **User Authentication**: Secure login and registration system

### Advanced Features
- **Expense Reports**: Generate detailed financial reports and analytics
- **Data Export**: Export expense data to Excel format
- **Real-time Charts**: Visualize spending patterns with interactive charts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Protected Routes**: Secure access to authenticated features

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling with validation
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap** - Additional UI components

### UI Components & Libraries
- **Radix UI** - Accessible UI primitives
- **Heroicons** - Beautiful SVG icons
- **Lucide React** - Additional icon library
- **React Icons** - Comprehensive icon collection
- **React Toastify** - Toast notifications
- **React Modal** - Modal dialogs

### Data Visualization
- **Chart.js** - Charting library
- **React Chart.js 2** - React wrapper for Chart.js
- **Recharts** - Composable charting library

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
src/
├── components/
│   ├── Gastos/           # Expense-related components
│   │   ├── RegistrarGastos.jsx
│   │   ├── ListarGastos.jsx
│   │   ├── EditarGasto.jsx
│   │   ├── ReporteGastos.jsx
│   │   ├── SelectInput.tsx
│   │   └── TextInput.tsx
│   ├── Usuarios/         # User management
│   │   └── RegisterUser.jsx
│   ├── Login.jsx         # Authentication
│   ├── Menu.jsx          # Navigation
│   ├── Categorias.jsx    # Category management
│   ├── MetodoPago.jsx    # Payment methods
│   ├── TiposTransacciones.jsx
│   ├── Divisas.jsx       # Currency management
│   └── ProtectedRoute.tsx
├── services/             # API service layer
│   ├── gastos.services.js
│   ├── categoria.services.js
│   ├── divisa.services.js
│   ├── login.services.js
│   ├── metodoPago.services.js
│   └── tipoTransaccion.services.js
├── hooks/                # Custom React hooks
│   └── useGastoForm.ts
├── helpers/              # Utility functions
│   └── format.ts
├── styles/               # CSS files
├── config.js             # API configuration
└── App.jsx               # Main application component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app-gastos-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - The application is configured to connect to the backend API at `https://vps-4600756-x.dattaweb.com`
   - If you need to use a different backend URL, update the `src/config.js` file

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will automatically reload when you make changes

## 📋 Available Scripts

- **`npm start`** - Runs the app in development mode
- **`npm test`** - Launches the test runner in interactive watch mode
- **`npm run build`** - Builds the app for production to the `build` folder
- **`npm run eject`** - Ejects from Create React App (one-way operation)
- **`npm run lint`** - Runs ESLint to check code quality

## 🔧 Configuration

### API Configuration
The application connects to a REST API backend. The API endpoints are configured in `src/config.js`:

- **Base URL**: `https://vps-4600756-x.dattaweb.com`
- **Endpoints**:
  - Expenses: `/api/gastos`
  - Categories: `/api/categorias`
  - Payment Methods: `/api/metodosPagos`
  - Transaction Types: `/api/tiposTransacciones`
  - Currencies: `/api/divisas`
  - Authentication: `/api/login`, `/api/register`
  - Voice Processing: `/api/audio`

## 🎯 Key Features Explained

### Voice Input System
The application includes a sophisticated voice input system that allows users to register expenses using natural language:
- Uses the Web Speech API for speech recognition
- Supports Spanish language (`es-ES`)
- Processes voice input and automatically categorizes expenses
- Integrates with the backend AI processing service

### Expense Management
- **CRUD Operations**: Full create, read, update, delete functionality
- **Form Validation**: Comprehensive form validation using React Hook Form
- **Date Handling**: Proper date formatting and parsing
- **User Association**: All expenses are associated with authenticated users

### Reporting and Analytics
- **Interactive Charts**: Visual representation of spending patterns
- **Data Export**: Export functionality to Excel format
- **Filtering**: Filter expenses by date, category, payment method
- **Summary Statistics**: Overview of total expenses and trends

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route protection for authenticated users
- **Input Validation**: Client-side and server-side validation
- **Secure API Communication**: HTTPS communication with backend

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Interface**: Clean, intuitive user interface
- **Accessibility**: WCAG compliant components using Radix UI
- **Toast Notifications**: User feedback for actions
- **Loading States**: Proper loading indicators throughout the app

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The build process creates an optimized production bundle in the `build` folder.

### Deployment Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your repository for automatic deployments
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **Traditional Hosting**: Upload the `build` folder to your web server

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v0.1.0** - Initial release with core expense management features
- Voice input functionality
- Multi-currency support
- Comprehensive reporting system
- User authentication and authorization

---

**Built with ❤️ using React and modern web technologies**
