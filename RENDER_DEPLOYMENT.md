# Backend Deployment Guide for Render

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

## Step 2: Deploy to Render

1. **Go to Render.com**:
   - Visit [render.com](https://render.com)
   - Sign up or log in with your GitHub account

2. **Create a New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your agriculture management repository

3. **Configure the Service**:
   - **Name**: `agriculture-management-api` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty (or `.` if needed)
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`

4. **Set Environment Variables**:
   Click "Advanced" and add these environment variables:
   
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://creative-pika-0f2778.netlify.app
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_optional
   ```

   **Important**: 
   - Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Generate a strong JWT secret (at least 32 characters)
   - OpenWeather API key is optional (app works with mock data)

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment to complete (5-10 minutes)
   - Your API will be available at: `https://your-service-name.onrender.com`

## Step 3: Update Frontend Configuration

1. **Create/Update .env file** in your frontend:
   ```
   VITE_API_URL=https://your-service-name.onrender.com/api
   ```

2. **Update AuthContext.tsx** (already done in the artifact above):
   - The `getApiUrl()` function now uses `VITE_API_URL` environment variable
   - Fallback to your Render URL for production

## Step 4: Test the Connection

1. **Test API Health**:
   - Visit: `https://your-service-name.onrender.com/api/health`
   - Should return JSON with status "OK"

2. **Test CORS**:
   - Open browser dev tools on your Netlify site
   - Try to register/login
   - Check for CORS errors in console

## Step 5: Redeploy Frontend

1. **Build and deploy** your frontend:
   ```bash
   npm run build
   ```
   
2. **Deploy to Netlify**:
   - If connected to GitHub: Push changes and auto-deploy
   - Or manually drag the `dist` folder to Netlify

## Alternative: Railway Deployment

If you prefer Railway over Render:

1. **Go to Railway.app**:
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy**:
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js and deploys

3. **Set Environment Variables**:
   - Go to your project → Variables
   - Add the same environment variables as above

4. **Custom Domain** (optional):
   - Go to Settings → Domains
   - Generate a Railway domain or add custom domain

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` environment variable is set correctly
   - Check that your Netlify URL is in the CORS allowed origins

2. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Ensure IP whitelist includes 0.0.0.0/0 (all IPs)
   - Check database user permissions

3. **Build Failures**:
   - Ensure Node.js version is 18+ in Render settings
   - Check that all dependencies are in package.json
   - Verify start command points to correct file

4. **Environment Variables**:
   - Double-check all required variables are set
   - Ensure no typos in variable names
   - JWT_SECRET should be long and random

### Testing Commands:

```bash
# Test API health
curl https://your-service-name.onrender.com/api/health

# Test CORS
curl -H "Origin: https://creative-pika-0f2778.netlify.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://your-service-name.onrender.com/api/auth/login
```

## Next Steps

1. **Monitor Logs**: Check Render dashboard for any errors
2. **Set up Monitoring**: Consider adding uptime monitoring
3. **Custom Domain**: Add your own domain if needed
4. **SSL**: Render provides free SSL certificates
5. **Scaling**: Upgrade plan if you need more resources

Your backend should now be live and accessible from your Netlify frontend!