# 🚀 Complete Deployment Guide

## Backend Configuration (Render)

Your backend is already deployed at: `https://agirculture-management-system.onrender.com`

### Environment Variables on Render:
```
MONGODB_URI=mongodb+srv://ssb:pankaj11@blinkeyit.youg5oa.mongodb.net/?retryWrites=true&w=majority&appName=blinkeyit
JWT_SECRET=d08f24691432cf9e385a0f83ade44d05
VITE_OPENWEATHER_API_KEY=32b3b56df7655a06cb6f450a7ac06616
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-netlify-domain.netlify.app
```

## Frontend Configuration (Netlify)

### Environment Variables on Netlify:
```
VITE_API_URL=https://agirculture-management-system.onrender.com/api
VITE_OPENWEATHER_API_KEY=32b3b56df7655a06cb6f450a7ac06616
VITE_DEFAULT_LAT=40.7128
VITE_DEFAULT_LON=-74.0060
VITE_DEFAULT_CITY=New York
```

## 🔧 Post-Deployment Steps

1. **Update CORS Settings**: After Netlify deployment, update your Render backend's `FRONTEND_URL` environment variable with your actual Netlify domain.

2. **Test API Connection**: 
   - Visit your Netlify site
   - Try registering a new user
   - Test login functionality
   - Verify all features work correctly

3. **Monitor Logs**: Check both Netlify and Render logs for any errors.

## 🌐 Live URLs

- **Frontend (Netlify)**: Will be provided after deployment
- **Backend (Render)**: https://agirculture-management-system.onrender.com
- **API Health Check**: https://agirculture-management-system.onrender.com/api/health

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors**: Update `FRONTEND_URL` in Render with your Netlify domain
2. **API Connection Failed**: Check if backend is running at the Render URL
3. **Authentication Issues**: Verify JWT_SECRET is set correctly on backend

### Debug Steps:

1. Check Netlify build logs
2. Verify environment variables are set
3. Test API endpoints directly
4. Check browser console for errors

## ✅ Success Checklist

- [ ] Backend running on Render
- [ ] Frontend deployed to Netlify
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] User registration/login working
- [ ] All features functional

Your Agriculture Management System is now fully deployed! 🌱