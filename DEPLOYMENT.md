# FREE DEPLOYMENT GUIDE

## Deploy to Render (Backend) + Vercel (Frontend) - 100% FREE

### Part 1: Deploy Backend to Render

1. **Create Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `shipra-db`
   - Database: `shipra`
   - User: `shipra`
   - Region: Choose closest to you
   - Instance Type: **Free**
   - Click "Create Database"
   - **IMPORTANT**: Copy the "Internal Database URL" (starts with postgresql://)

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Shipra`
   - Configure:
     ```
     Name: shipra-backend
     Region: Same as database
     Branch: main
     Root Directory: (leave empty)
     Runtime: Python 3
     Build Command: ./build.sh
     Start Command: cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
     Instance Type: Free
     ```

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable":
   
   ```
   DJANGO_SECRET_KEY=<generate a random 50-character string>
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com
   DATABASE_URL=<paste the Internal Database URL from step 2>
   ```
   
   To generate SECRET_KEY, run in Python:
   ```python
   import secrets
   print(secrets.token_urlsafe(50))
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for first deployment
   - Your backend URL: `https://shipra-backend.onrender.com`

6. **Create Superuser** (After deployment)
   - Go to your service dashboard
   - Click "Shell" tab
   - Run:
     ```bash
     cd backend
     python manage.py createsuperuser
     ```

---

### Part 2: Deploy Frontend to Vercel

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your `Shipra` repository
   - Configure:
     ```
     Framework Preset: Vite
     Root Directory: ./
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     Name: VITE_API_URL
     Value: https://shipra-backend.onrender.com/api
     ```
   - Select all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your frontend URL: `https://shipra.vercel.app`

---

### Part 3: Test Your Deployment

1. **Visit your frontend**: `https://shipra.vercel.app`
2. **Login** with the superuser you created
3. **Check if data loads** from the backend

---

## Important Notes

### Free Tier Limitations

**Render Free Tier:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- 750 hours/month (enough for 24/7 if only one service)
- PostgreSQL: 1GB storage, 97 connection limit

**Vercel Free Tier:**
- Unlimited deployments
- 100GB bandwidth/month
- No sleep time
- Custom domain support

### Troubleshooting

**Backend not responding:**
- Check Render logs: Dashboard → Logs
- Verify environment variables are set
- Ensure DATABASE_URL is correct

**Frontend can't connect to backend:**
- Check VITE_API_URL in Vercel
- Verify CORS settings in Django
- Check browser console for errors

**Database errors:**
- Ensure migrations ran: Check build logs
- Verify DATABASE_URL format
- Check PostgreSQL database is running

---

## Auto-Deploy on Git Push

Both Render and Vercel automatically redeploy when you push to GitHub:

```bash
git add .
git commit -m "your changes"
git push
```

- Vercel redeploys in ~2 minutes
- Render redeploys in ~5-10 minutes

---

## Custom Domain (Optional)

### Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## Cost Summary

- **Backend (Render)**: $0/month
- **Database (Render PostgreSQL)**: $0/month
- **Frontend (Vercel)**: $0/month
- **Total**: **$0/month** 🎉

---

## Alternative: Deploy Everything to Render

If you prefer a single platform:

1. **Backend Web Service** (as above)
2. **Frontend Static Site**:
   - New → Static Site
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Add environment variable: `VITE_API_URL`

Both will be on Render's free tier.
