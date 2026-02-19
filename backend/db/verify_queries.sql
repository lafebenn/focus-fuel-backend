-- Quick Database Verification Queries
-- Run these in psql to verify your food logs are being saved

-- 1. See all food logs with details (most recent first)
SELECT 
  fl.FoodLogID,
  u.Username,
  f.FoodName,
  fl.LoggedAt
FROM FoodLogs fl
JOIN Users u ON fl.UserID = u.UserID
JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
JOIN Foods f ON fli.FoodID = f.FoodID
ORDER BY fl.LoggedAt DESC
LIMIT 10;

-- 2. Count how many food logs exist
SELECT COUNT(*) as TotalFoodLogs FROM FoodLogs;

-- 3. See today's food logs only
SELECT 
  f.FoodName,
  fl.LoggedAt
FROM FoodLogs fl
JOIN FoodLogItems fli ON fl.FoodLogID = fli.FoodLogID
JOIN Foods f ON fli.FoodID = f.FoodID
WHERE DATE(fl.LoggedAt) = CURRENT_DATE
ORDER BY fl.LoggedAt DESC;

-- 4. See all foods in the system
SELECT FoodID, FoodName, IsCommon FROM Foods ORDER BY FoodID DESC LIMIT 10;
