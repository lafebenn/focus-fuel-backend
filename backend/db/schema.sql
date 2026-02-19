-- FocusFuel Database Schema
-- Based on ERD: 7 tables for tracking food, mood, and user preferences

-- Drop tables if they exist (for clean re-runs)
DROP TABLE IF EXISTS UserAllergies CASCADE;
DROP TABLE IF EXISTS FoodLogItems CASCADE;
DROP TABLE IF EXISTS FoodLogs CASCADE;
DROP TABLE IF EXISTS MentalLogs CASCADE;
DROP TABLE IF EXISTS Foods CASCADE;
DROP TABLE IF EXISTS Allergies CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- 1. Users table
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Reminder_Frequency VARCHAR(20),
    Reminder_Time TIME,
    PushNotifications BOOLEAN DEFAULT false,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Allergies table
CREATE TABLE Allergies (
    AllergyID SERIAL PRIMARY KEY,
    AllergyName VARCHAR(100) NOT NULL UNIQUE,
    Type VARCHAR(50)
);

-- 3. UserAllergies junction table (many-to-many)
CREATE TABLE UserAllergies (
    UserID INTEGER NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    AllergyID INTEGER NOT NULL REFERENCES Allergies(AllergyID) ON DELETE CASCADE,
    PRIMARY KEY (UserID, AllergyID)
);

-- 4. Foods table
CREATE TABLE Foods (
    FoodID SERIAL PRIMARY KEY,
    FoodName VARCHAR(100) NOT NULL,
    IsCommon BOOLEAN DEFAULT false,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. FoodLogs table (parent for logging sessions)
CREATE TABLE FoodLogs (
    FoodLogID SERIAL PRIMARY KEY,
    UserID INTEGER NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    LoggedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. FoodLogItems table (tracks individual foods in a log)
CREATE TABLE FoodLogItems (
    LogItemID SERIAL PRIMARY KEY,
    FoodLogID INTEGER NOT NULL REFERENCES FoodLogs(FoodLogID) ON DELETE CASCADE,
    FoodID INTEGER NOT NULL REFERENCES Foods(FoodID) ON DELETE CASCADE
);

-- 7. MentalLogs table (mood tracking)
CREATE TABLE MentalLogs (
    Mental_Log_ID SERIAL PRIMARY KEY,
    UserID INTEGER NOT NULL REFERENCES Users(UserID) ON DELETE CASCADE,
    BrainFog INTEGER CHECK (BrainFog >= 0 AND BrainFog <= 10),
    Exhaustion INTEGER CHECK (Exhaustion >= 0 AND Exhaustion <= 10),
    Stress INTEGER CHECK (Stress >= 0 AND Stress <= 10),
    Burnout INTEGER CHECK (Burnout >= 0 AND Burnout <= 10),
    FocusScore INTEGER CHECK (FocusScore >= 0 AND FocusScore <= 10),
    Note TEXT,
    LoggedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common queries
CREATE INDEX idx_foodlogs_userid ON FoodLogs(UserID);
CREATE INDEX idx_foodlogs_loggedat ON FoodLogs(LoggedAt);
CREATE INDEX idx_mentallogs_userid ON MentalLogs(UserID);
CREATE INDEX idx_mentallogs_loggedat ON MentalLogs(LoggedAt);
CREATE INDEX idx_foodlogitems_foodlogid ON FoodLogItems(FoodLogID);
CREATE INDEX idx_userallergies_userid ON UserAllergies(UserID);

-- Success message
SELECT 'Schema created successfully! 7 tables ready.' AS status;
