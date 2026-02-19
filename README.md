# FocusFuel

## App Summary

FocusFuel is a food and mood tracking application designed to help users discover personalized nutrition patterns that improve their mental performance. The primary user is anyone looking to optimize their focus, energy, and mental clarity through better understanding of how their diet affects their cognitive function. The app allows users to log their meals and snacks throughout the day, track their mental state (clarity, energy, stress, focus), and receive intelligent suggestions based on detected correlations. Over time, FocusFuel analyzes patterns to provide personalized food recommendations that align with the user's mental performance goals, making it easier to make informed dietary choices that support productivity and well-being.

## Tech Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 7.3
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS 3.4 with custom design system
- **Animations**: Framer Motion 12.34
- **Routing**: React Router DOM 6.30
- **State Management**: React hooks with custom localStorage persistence
- **Charts**: Recharts 2.15

### Backend
- **Runtime**: Node.js with Express 4.18
- **Language**: JavaScript (ES Modules)
- **API Style**: RESTful API

### Database
- **Database**: PostgreSQL 16+
- **Database Driver**: node-postgres (pg) 8.11

### Development Tools
- **Testing**: Vitest 3.2 with Testing Library
- **Linting**: ESLint 9.32
- **Type Checking**: TypeScript 5.8

## Architecture Diagram

```
┌─────────────┐
│    User     │
│  (Browser)  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────┐
│   Frontend (React + Vite)       │
│   - Food Log UI                 │
│   - Mood Tracking               │
│   - Dashboard & Analytics       │
│   Port: 5173                    │
└────────┬────────────────────────┘
         │ HTTP REST API
         ▼
┌─────────────────────────────────┐
│   Backend (Node.js + Express)   │
│   - /api/foodlogs               │
│   - /api/health                 │
│   Port: 5000                    │
└────────┬────────────────────────┘
         │ SQL Queries
         ▼
┌─────────────────────────────────┐
│   Database (PostgreSQL)         │
│   - Users                       │
│   - FoodLogs & FoodLogItems     │
│   - Foods                       │
│   - MentalLogs                  │
│   - Allergies & UserAllergies   │
│   Port: 5432                    │
└─────────────────────────────────┘
```

## Prerequisites

Before running this project locally, ensure you have the following software installed:

### Required Software

1. **Node.js (v18 or higher)** and **npm**
   - [Download and install from nodejs.org](https://nodejs.org/)
   - Verify installation:
     ```bash
     node --version  # Should output v18.x.x or higher
     npm --version   # Should output 9.x.x or higher
     ```

2. **PostgreSQL (v16 or higher)**
   - [Download and install from postgresql.org](https://www.postgresql.org/download/)
   - Verify installation:
     ```bash
     psql --version  # Should output psql (PostgreSQL) 16.x or higher
     ```
   - **Important**: Ensure `psql` is available in your system PATH

3. **Git**
   - [Download from git-scm.com](https://git-scm.com/downloads)
   - Verify installation:
     ```bash
     git --version
     ```

## Installation and Setup

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/lafebenn/focus-fuel-backend.git
cd focus-fuel-backend
```

### 2. Set Up the Database

#### Step 2.1: Create the PostgreSQL Database

Open a terminal and connect to PostgreSQL:

```bash
psql -U postgres
```

Create the database:

```sql
CREATE DATABASE focusfuel_db;
\q
```

#### Step 2.2: Run the Schema Script

Navigate to the backend directory and run the schema script:

```bash
psql -U postgres -d focusfuel_db -f backend/db/schema.sql
```

You should see output confirming that 7 tables have been created successfully.

#### Step 2.3: Run the Seed Script

Populate the database with sample data:

```bash
psql -U postgres -d focusfuel_db -f backend/db/seed.sql
```

You should see confirmation messages showing:
- 2 users created
- 8 allergies added
- ~20 foods added
- Sample food logs and mental logs inserted

### 3. Configure Environment Variables

#### Backend Configuration

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file with your PostgreSQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=focusfuel_db
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password_here
   PORT=5000
   ```

#### Frontend Configuration

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. The default configuration should work:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### 4. Install Dependencies

#### Backend Dependencies

```bash
cd backend
npm install
```

This installs Express, PostgreSQL driver, CORS, and development tools.

#### Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs React, Vite, TypeScript, UI components, and all dependencies.

## Running the Application

You'll need to run both the backend and frontend servers simultaneously. Open two terminal windows:

### Terminal 1: Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
🚀 Server running on http://localhost:5000
📊 Health check: http://localhost:5000/api/health
```

### Terminal 2: Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.3.1  ready in X ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Verifying the Vertical Slice

The vertical slice demonstrates the full stack integration through the **"Log Food"** feature. Follow these steps to verify it works end-to-end:

### Step 1: Trigger the Feature

1. Open the app at `http://localhost:5173`
2. Click on the **"Log Food"** button on the dashboard, or navigate directly to `/food`
3. You should see a **green status indicator** at the top saying "Connected to database"
4. In the "Smart Recommendations" section, click the **+ button** next to any food item (e.g., "Almonds")
5. A success modal should appear confirming the food was logged

### Step 2: Confirm Database Update

Open a new terminal and verify the data was inserted into PostgreSQL:

```bash
psql -U postgres -d focusfuel_db
```

Run this query:

```sql
SELECT 
  fl.FoodLogID,
  fl.LoggedAt,
  f.FoodName,
  u.Username
FROM FoodLogs fl
JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
JOIN Foods f ON fli.FoodID = f.FoodID
JOIN Users u ON fl.UserID = u.UserID
ORDER BY fl.LoggedAt DESC
LIMIT 5;
```

You should see your newly logged food in the results with the current timestamp.

### Step 3: Verify Persistence After Page Refresh

1. **Refresh the browser page** (press F5 or Cmd+R)
2. The food you logged should still appear in the **"Added today"** section
3. The data persists because it's stored in the PostgreSQL database

### Step 4: Verify Through API (Optional)

You can also test the API directly using curl or a browser:

```bash
curl http://localhost:5000/api/foodlogs/today?userId=1
```

You should receive a JSON response with your food logs for today.

### Expected Behavior

✅ **Success Criteria:**
- Button click triggers backend API call
- Backend inserts record into PostgreSQL (FoodLogs + FoodLogItems tables)
- API returns the new food log data
- UI displays the food in the "Added today" section with timestamp
- After page refresh, the food log persists and is still visible

❌ **If Something Goes Wrong:**
- Check that both backend and frontend servers are running
- Verify PostgreSQL is running: `pg_isready`
- Check backend logs for errors
- Look for the status indicator: if it shows "Using local storage", the backend connection failed
- Verify your `.env` file has correct database credentials

## API Endpoints

### Health Check
- **GET** `/api/health` - Returns API status

### Food Logs
- **GET** `/api/foodlogs?userId=1` - Get all food logs for a user
- **GET** `/api/foodlogs/today?userId=1` - Get today's food logs
- **POST** `/api/foodlogs` - Add a new food log
  ```json
  {
    "userId": 1,
    "foodName": "Almonds",
    "emoji": "🥜"
  }
  ```
- **DELETE** `/api/foodlogs/:foodLogId?userId=1` - Delete a food log

## Project Structure

```
focus-fuel-main/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/             # API integration layer
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Helper functions
│   │   └── lib/             # Third-party configurations
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Express app entry point
│   ├── db/
│   │   ├── schema.sql       # Database schema (7 tables)
│   │   └── seed.sql         # Sample data
│   ├── .env.example         # Environment template
│   └── package.json
├── .gitignore
├── DESIGN.md                 # Design documentation
└── README.md                 # This file
```

## Database Schema

The database consists of 7 tables:

1. **Users** - User accounts with reminder preferences
2. **Allergies** - List of possible allergies
3. **UserAllergies** - Junction table for user-allergy relationships
4. **Foods** - Catalog of food items
5. **FoodLogs** - Parent table for logging sessions
6. **FoodLogItems** - Individual food items within a log
7. **MentalLogs** - Mood and mental state tracking

See `backend/db/schema.sql` for the complete schema definition.

## Troubleshooting

### Backend won't start
- Ensure PostgreSQL is running: `pg_isready`
- Check your `.env` file credentials
- Verify port 5000 is not in use: `lsof -i :5000`

### Database connection errors
- Confirm database exists: `psql -U postgres -l | grep focusfuel_db`
- Check PostgreSQL is accepting connections
- Verify username and password in `.env`

### Frontend shows "Using local storage"
- Check that backend is running on port 5000
- Verify `VITE_API_URL` in frontend `.env`
- Check browser console for CORS or network errors

### CORS errors in browser
- Ensure backend has CORS enabled (already configured in `server.js`)
- Check that you're accessing frontend via `localhost:5173`

## Team

- **Repository**: https://github.com/lafebenn/focus-fuel-backend
- **Collaborators**: Add your team members here

## License

This project is for educational purposes as part of IS 401.
