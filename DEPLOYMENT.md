# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Prerequisites
- GitHub account
- Vercel account
- MongoDB Atlas account (free tier available)

### 2. Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free M0 tier)

2. **Configure Database**
   - Create a database user with read/write permissions
   - Add your IP to the IP Access List (use 0.0.0.0/0 for all IPs)
   - Get your connection string from "Connect" → "Connect your application"

### 3. Deploy to Vercel

#### Method 1: Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: **Vite**
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agriculture_management
   JWT_SECRET=your_super_secret_jwt_key_make_it_very_long_and_random
   NODE_ENV=production
   FRONTEND_URL=https://your-project-name.vercel.app
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_optional
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-project-name.vercel.app`

#### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add NODE_ENV
   vercel env add FRONTEND_URL
   ```

### 4. Post-Deployment

1. **Test the Application**
   - Visit your Vercel URL
   - Test user registration and login
   - Verify all features work correctly

2. **Monitor Logs**
   - Check Vercel dashboard for any errors
   - Monitor function logs for backend issues

### 5. Optional: Custom Domain

1. **Add Custom Domain**
   - Go to Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**
   - Update `FRONTEND_URL` to your custom domain

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | `your_super_secret_key_here` |
| `NODE_ENV` | Environment mode | Yes | `production` |
| `FRONTEND_URL` | Frontend URL for CORS | Yes | `https://your-app.vercel.app` |
| `VITE_OPENWEATHER_API_KEY` | Weather API key | No | `your_api_key` |
| `VITE_DEFAULT_LAT` | Default latitude | No | `40.7128` |
| `VITE_DEFAULT_LON` | Default longitude | No | `-74.0060` |
| `VITE_DEFAULT_CITY` | Default city | No | `New York` |

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies in package.json
   - Check build logs in Vercel dashboard

2. **Database Connection Error**
   - Verify MongoDB URI is correct
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Errors**
   - Verify FRONTEND_URL matches your Vercel domain
   - Check CORS configuration in server/index.js

4. **Function Timeout**
   - Check if database queries are optimized
   - Verify MongoDB connection is stable
   - Consider increasing function timeout in vercel.json

### Debug Tips

1. **Check Vercel Logs**
   ```bash
   vercel logs
   ```

2. **Test API Endpoints**
   - Visit `https://your-app.vercel.app/api/health`
   - Check if backend is responding

3. **Monitor Performance**
   - Use Vercel Analytics
   - Check function execution times

## Security Considerations

1. **Environment Variables**
   - Never commit .env files
   - Use strong JWT secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong database passwords
   - Limit IP access when possible
   - Enable MongoDB Atlas security features

3. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use HTTPS only

## Performance Optimization

1. **Frontend**
   - Enable Vercel Analytics
   - Use image optimization
   - Implement code splitting

2. **Backend**
   - Optimize database queries
   - Use connection pooling
   - Implement caching

3. **Database**
   - Create proper indexes
   - Optimize query patterns
   - Monitor performance metrics

## Maintenance

1. **Regular Updates**
   - Update dependencies regularly
   - Monitor security advisories
   - Test after updates

2. **Backup Strategy**
   - Enable MongoDB Atlas backups
   - Export important data regularly
   - Test restore procedures

3. **Monitoring**
   - Set up error tracking
   - Monitor application metrics
   - Create alerts for issues

---

Your Agriculture Management System is now ready for production use on Vercel! 🚀