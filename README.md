# Agriculture Management System

A comprehensive farm management system built with React, Node.js, Express, and MongoDB. This application helps farmers manage crops, fields, tasks, inventory, equipment, and finances efficiently.

## Features

- **Dashboard**: Overview of farm operations with real-time statistics
- **Crop Management**: Track crop lifecycle, health, and progress
- **Field Management**: Monitor soil conditions and field utilization
- **Weather Monitoring**: Real-time weather data and forecasts
- **Task Management**: Organize and track farm activities
- **Inventory Management**: Monitor supplies and equipment
- **Equipment Management**: Track maintenance and usage
- **Financial Management**: Monitor income, expenses, and profitability
- **Reports & Analytics**: Generate detailed reports and insights
- **AI Chatbot**: Get farming advice and assistance

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ 
- MongoDB database
- OpenWeatherMap API key (optional, for weather features)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (use a strong, random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Weather API (optional)
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-domain.vercel.app
```

## Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agriculture-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start the development server**
   ```bash
   # Start backend server
   npm run server

   # In another terminal, start frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## Deployment to Vercel

### 1. Prepare for Deployment

Ensure your project has the following files:
- `vercel.json` (already included)
- `.env.example` (for reference)
- Updated `package.json` with build scripts

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

#### Option B: Using Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Set Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
MONGODB_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_super_secret_jwt_key_here
OPENWEATHERMAP_API_KEY = your_openweathermap_api_key (optional)
NODE_ENV = production
```

### 4. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Configure Database Access**
   - Create a database user
   - Whitelist IP addresses (0.0.0.0/0 for all IPs)

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### 5. Weather API Setup (Optional)

1. **Get OpenWeatherMap API Key**
   - Go to [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up and get a free API key

2. **Add to Environment Variables**
   - Add `OPENWEATHERMAP_API_KEY` to Vercel environment variables

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Crops
- `GET /api/crops` - Get all crops
- `POST /api/crops` - Create new crop
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop

### Fields
- `GET /api/fields` - Get all fields
- `POST /api/fields` - Create new field
- `PUT /api/fields/:id` - Update field
- `DELETE /api/fields/:id` - Delete field

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Create new item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Equipment
- `GET /api/equipment` - Get all equipment
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Finance
- `GET /api/finance/transactions` - Get all transactions
- `POST /api/finance/transactions` - Create new transaction
- `PUT /api/finance/transactions/:id` - Update transaction
- `DELETE /api/finance/transactions/:id` - Delete transaction
- `GET /api/finance/summary` - Get financial summary

### Weather
- `GET /api/weather?city=<city_name>` - Get current weather
- `GET /api/weather/forecast?city=<city_name>` - Get weather forecast

### Health Check
- `GET /api/health` - API health status

## Troubleshooting

### Common Issues

1. **Registration Failed Error**
   - Check MongoDB connection
   - Verify environment variables are set correctly
   - Check server logs for detailed error messages

2. **CORS Errors**
   - Ensure FRONTEND_URL is set correctly in environment variables
   - Check that the domain is whitelisted in CORS configuration

3. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist settings
   - Ensure database user has proper permissions

4. **Weather API Not Working**
   - Verify OpenWeatherMap API key is valid
   - Check API key usage limits
   - The app works with mock data if API key is not provided

### Debug Mode

To enable debug logging, set `NODE_ENV=development` in your environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section
- Review server logs in Vercel dashboard
- Check MongoDB Atlas logs
- Verify all environment variables are set correctly

## Demo Credentials

For testing purposes, you can use:
- Email: demo@agrimanage.com
- Password: demo123

Or register a new account with your own credentials.