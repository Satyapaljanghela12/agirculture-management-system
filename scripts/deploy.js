// Deployment helper script
const fs = require('fs');
const path = require('path');

console.log('🚀 Agriculture Management Deployment Helper\n');

// Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('📝 Create .env file with your backend URL:');
  console.log('   VITE_API_URL=https://agirculture-management-system.onrender.com\n');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your-backend-url')) {
    console.log('⚠️  Please update VITE_API_URL in .env file');
    console.log('   Replace "your-backend-url" with your actual Render URL\n');
  } else {
    console.log('✅ .env file configured\n');
  }
}

// Check package.json for required dependencies
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const requiredDeps = ['axios', 'cors', 'express', 'mongoose', 'jsonwebtoken'];
const missingDeps = requiredDeps.filter(dep => 
  !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
);

if (missingDeps.length > 0) {
  console.log('❌ Missing dependencies:', missingDeps.join(', '));
  console.log('   Run: npm install', missingDeps.join(' '));
} else {
  console.log('✅ All required dependencies found\n');
}

// Deployment checklist
console.log('📋 Deployment Checklist:');
console.log('   □ 1. Deploy backend to Render');
console.log('   □ 2. Set up MongoDB Atlas');
console.log('   □ 3. Configure environment variables');
console.log('   □ 4. Update frontend .env file');
console.log('   □ 5. Test API connection');
console.log('   □ 6. Deploy frontend to Netlify');
console.log('   □ 7. Test full application\n');

console.log('🔗 Useful Links:');
console.log('   Render: https://render.com');
console.log('   MongoDB Atlas: https://cloud.mongodb.com');
console.log('   Your Frontend: https://creative-pika-0f2778.netlify.app');
console.log('   Deployment Guide: ./DEPLOYMENT_CHECKLIST.md\n');

console.log('💡 Need help? Check DEPLOYMENT_CHECKLIST.md for detailed steps!');