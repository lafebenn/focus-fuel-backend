# FocusFuel - Quick Start Guide

## 🚀 5-Minute Setup

### 1. Prerequisites Check
Run the verification script:
```bash
./verify-setup.sh
```

### 2. Start PostgreSQL
Make sure PostgreSQL is running. On macOS with Homebrew:
```bash
brew services start postgresql@16
```

Or start manually:
```bash
pg_ctl -D /usr/local/var/postgres start
```

### 3. Create Database & Load Data
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE focusfuel_db;"

# Run schema (creates tables)
psql -U postgres -d focusfuel_db -f backend/db/schema.sql

# Load sample data
psql -U postgres -d focusfuel_db -f backend/db/seed.sql
```

### 4. Configure Environment
The `.env` file is already created in `backend/.env`. Update the password if needed:
```bash
cd backend
nano .env  # Change DB_PASSWORD if your postgres password is different
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ You should see: `🚀 Server running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ You should see: `➜ Local: http://localhost:5173/`

### 6. Open the App
Go to: **http://localhost:5173**

---

## 🧪 Testing the Vertical Slice

1. Click **"Log Food"** button
2. See green banner: "Connected to database" ✅
3. Click **+** next to any food (e.g., Almonds)
4. Success modal appears
5. Food appears in "Added today" section
6. **Refresh the page** - food still there! (persisted in database)

---

## 🔍 Verify Database

```bash
psql -U postgres -d focusfuel_db
```

```sql
-- See all your food logs
SELECT f.FoodName, fl.LoggedAt 
FROM FoodLogs fl
JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
JOIN Foods f ON fli.FoodID = f.FoodID
ORDER BY fl.LoggedAt DESC;
```

---

## 🐛 Common Issues

### "Connection refused" or backend not connecting
- Check PostgreSQL is running: `pg_isready`
- Check backend is running on port 5000
- Check `.env` file has correct credentials

### "Database does not exist"
- Run: `psql -U postgres -c "CREATE DATABASE focusfuel_db;"`

### "Password authentication failed"
- Update `DB_PASSWORD` in `backend/.env`

### Frontend shows "Using local storage"
- Backend is not running or not accessible
- Check backend terminal for errors

---

## 📚 Additional Commands

**Stop PostgreSQL:**
```bash
brew services stop postgresql@16
```

**Reset Database:**
```bash
psql -U postgres -d focusfuel_db -f backend/db/schema.sql
psql -U postgres -d focusfuel_db -f backend/db/seed.sql
```

**View All Tables:**
```bash
psql -U postgres -d focusfuel_db -c "\dt"
```

---

## 📊 API Testing

Test the API directly:
```bash
# Health check
curl http://localhost:5000/api/health

# Get today's food logs
curl http://localhost:5000/api/foodlogs/today?userId=1

# Add a food log
curl -X POST http://localhost:5000/api/foodlogs \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"foodName":"Apple","emoji":"🍎"}'
```

---

## ✅ You're Ready!

Your full-stack PERN application is now running with:
- ✅ React frontend (Vite)
- ✅ Express backend
- ✅ PostgreSQL database
- ✅ Working vertical slice (Log Food feature)
