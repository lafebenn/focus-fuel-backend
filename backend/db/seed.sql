-- FocusFuel Database Seed Data
-- Sample data to test the application

-- Insert sample users
INSERT INTO Users (Username, Reminder_Frequency, Reminder_Time, PushNotifications) VALUES
('testuser', 'Daily', '09:00:00', true),
('demo_user', 'Twice a day', '12:00:00', false);

-- Insert common allergies
INSERT INTO Allergies (AllergyName, Type) VALUES
('Peanuts', 'Nut'),
('Tree Nuts', 'Nut'),
('Dairy', 'Dairy'),
('Gluten', 'Grain'),
('Shellfish', 'Seafood'),
('Soy', 'Legume'),
('Eggs', 'Egg'),
('Fish', 'Seafood');

-- Assign some allergies to testuser (UserID = 1)
INSERT INTO UserAllergies (UserID, AllergyID) VALUES
(1, 1),  -- testuser has peanut allergy
(1, 3);  -- testuser has dairy allergy

-- Insert common foods (from your suggestions list)
INSERT INTO Foods (FoodName, IsCommon) VALUES
-- Energy foods
('Almonds', true),
('Dark Chocolate', true),
('Banana', true),
('Greek Yogurt', true),
('Oatmeal', true),
('Sweet Potato', true),
('Eggs', true),
-- Focus foods
('Blueberries', true),
('Salmon', true),
('Walnuts', true),
('Avocado', true),
('Green Tea', true),
('Spinach', true),
-- Mood foods
('Dark Chocolate', true),
('Chamomile Tea', true),
('Turkey', true),
('Pumpkin Seeds', true),
-- Other common foods
('Apple', true),
('Coffee', true),
('Water', true),
('Orange', true);

-- Insert sample food logs for testuser
-- Log 1: Yesterday morning
INSERT INTO FoodLogs (UserID, LoggedAt) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '8 hours');

-- Items for Log 1
INSERT INTO FoodLogItems (FoodLogID, FoodID) VALUES
(1, 1),  -- Almonds
(1, 2);  -- Dark Chocolate

-- Log 2: Yesterday afternoon
INSERT INTO FoodLogs (UserID, LoggedAt) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '14 hours');

-- Items for Log 2
INSERT INTO FoodLogItems (FoodLogID, FoodID) VALUES
(2, 8),  -- Blueberries
(2, 4);  -- Greek Yogurt

-- Log 3: Today morning
INSERT INTO FoodLogs (UserID, LoggedAt) VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '2 hours');

-- Items for Log 3
INSERT INTO FoodLogItems (FoodLogID, FoodID) VALUES
(3, 5),  -- Oatmeal
(3, 3);  -- Banana

-- Insert sample mental/mood logs
-- Mental log from yesterday
INSERT INTO MentalLogs (UserID, BrainFog, Exhaustion, Stress, Burnout, FocusScore, Note, LoggedAt) VALUES
(1, 3, 4, 5, 4, 7, 'Felt pretty good after morning snack', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '10 hours'),
(1, 2, 3, 3, 2, 8, 'Very focused in the afternoon', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '16 hours'),
(1, 4, 5, 4, 5, 6, 'Slight energy dip', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '20 hours');

-- Mental log from today
INSERT INTO MentalLogs (UserID, BrainFog, Exhaustion, Stress, Burnout, FocusScore, Note, LoggedAt) VALUES
(1, 2, 2, 2, 2, 9, 'Great start to the day!', CURRENT_TIMESTAMP - INTERVAL '1 hour');

-- Verify data
SELECT 'Seed data inserted successfully!' AS status;
SELECT 'Users:', COUNT(*) FROM Users;
SELECT 'Allergies:', COUNT(*) FROM Allergies;
SELECT 'Foods:', COUNT(*) FROM Foods;
SELECT 'FoodLogs:', COUNT(*) FROM FoodLogs;
SELECT 'FoodLogItems:', COUNT(*) FROM FoodLogItems;
SELECT 'MentalLogs:', COUNT(*) FROM MentalLogs;
