# FocusFuel - Grading Checklist

## Quick Verification (5 minutes)

### ✅ Database (2 points)

1. **Schema file present and correct:**
   ```bash
   cat backend/db/schema.sql | grep "CREATE TABLE" | wc -l
   # Should output: 7 (seven tables)
   ```

2. **Schema matches ERD:**
   - Users ✓
   - Allergies ✓
   - UserAllergies ✓
   - Foods ✓
   - FoodLogs ✓
   - FoodLogItems ✓
   - MentalLogs ✓

3. **Seed file present with sample data:**
   ```bash
   psql -U postgres -d focusfuel_db -f backend/db/schema.sql
   psql -U postgres -d focusfuel_db -f backend/db/seed.sql
   ```
   Output should confirm data inserted.

4. **README documents setup:**
   See README.md sections:
   - "Installation and Setup" → Step 2
   - Complete commands provided ✓

**Score: ____ / 2**

---

### ✅ Working Button - Vertical Slice (3 points)

**Test the "Log Food" feature:**

1. **Setup:**
   ```bash
   # Terminal 1
   cd backend && npm run dev
   
   # Terminal 2  
   cd frontend && npm run dev
   ```

2. **Trigger feature:**
   - Open http://localhost:5173
   - Click "Log Food"
   - See green "Connected to database" indicator ✓
   - Click + button next to any food (e.g., "Almonds")
   - Success modal appears ✓

3. **Verify database update:**
   ```bash
   psql -U postgres -d focusfuel_db
   ```
   ```sql
   SELECT f.FoodName, fl.LoggedAt 
   FROM FoodLogs fl
   JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
   JOIN Foods f ON fli.FoodID = f.FoodID
   ORDER BY fl.LoggedAt DESC
   LIMIT 5;
   ```
   New food should appear with current timestamp ✓

4. **Verify UI update:**
   - Food appears in "Added today" section ✓

5. **Verify persistence:**
   - Refresh browser (F5 or Cmd+R)
   - Food still visible in "Added today" ✓
   - Data persists after refresh ✓

**Checklist:**
- [ ] Button triggers backend code
- [ ] Backend updates database
- [ ] Response returns updated value
- [ ] UI displays updated value
- [ ] Change persists after page refresh
- [ ] README has concrete verification steps (see "Verifying the Vertical Slice")

**Score: ____ / 3**

---

### ✅ README (5 points)

**Evaluation criteria:**

1. **App Summary (5-8 sentences):**
   - [ ] Explains problem app solves
   - [ ] Identifies primary user
   - [ ] Describes what product does
   - Located at: README.md → "App Summary"

2. **Tech Stack (organized by layer):**
   - [ ] Frontend framework and tooling
   - [ ] Backend framework
   - [ ] Database
   - [ ] Clear and organized
   - Located at: README.md → "Tech Stack"

3. **Architecture Diagram:**
   - [ ] Shows user, frontend, backend, database
   - [ ] Has labeled arrows
   - [ ] Shows communication flow
   - Located at: README.md → "Architecture Diagram"

4. **Prerequisites:**
   - [ ] Lists required software (Node.js, PostgreSQL, Git)
   - [ ] Links to installation instructions
   - [ ] Includes verification commands
   - Located at: README.md → "Prerequisites"

5. **Installation and Setup:**
   - [ ] Clear step-by-step instructions
   - [ ] Covers database creation
   - [ ] Covers schema.sql and seed.sql
   - [ ] Covers environment variables
   - [ ] Logically ordered
   - Located at: README.md → "Installation and Setup"

6. **Running the Application:**
   - [ ] Explains how to start backend
   - [ ] Explains how to start frontend
   - [ ] Specifies URL to open
   - Located at: README.md → "Running the Application"

7. **Verifying the Vertical Slice:**
   - [ ] Specific steps to trigger feature
   - [ ] How to confirm database update
   - [ ] How to verify persistence after refresh
   - [ ] Concrete and detailed
   - Located at: README.md → "Verifying the Vertical Slice"

**Overall README Quality:**
- [ ] Clear and concise
- [ ] Professional presentation
- [ ] Easy to understand
- [ ] New teammate could run project confidently

**Score: ____ / 5**

---

## Total Score: ____ / 10

---

## Additional Notes

**Bonus observations:**
- Setup verification script included (`verify-setup.sh`)
- QUICKSTART.md for rapid setup
- Comprehensive error handling
- Graceful offline fallback
- Connection status indicator
- Clean code organization
- Professional git commit history

**Repository:** https://github.com/lafebenn/focus-fuel-backend

---

## Common Issues & Solutions

**"Cannot connect to database"**
- Check PostgreSQL is running: `pg_isready`
- Verify backend/.env has correct credentials

**"Module not found"**
- Run: `cd backend && npm install`
- Run: `cd frontend && npm install`

**"Port already in use"**
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`
- Kill process on port 5173: `lsof -ti:5173 | xargs kill -9`
