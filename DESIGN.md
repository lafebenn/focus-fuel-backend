# FocusFuel – Design & Behavior Notes

## Latest Updates (Feb 2026)

### ✅ Implemented Features

1. **Center modals**: All popups (Suggestions detail, day detail, success messages) now center on screen (not bottom sheets)
2. **Success messages**: Modal stays until user clicks X (no auto-dismiss)
3. **Settings**: Custom reminder schedule with multiple times; "Other allergies" field; removed "Twice a day"
4. **Suggestions page**: 
   - "Brain" → "Mood" filter
   - Foods support multiple tags (e.g. Dark Chocolate & Almonds → Focus + Mood)
   - Allergen filtering (excludes foods matching user's allergies)
   - Smaller cards (text-4xl emoji, text-xs names)
5. **Food Log**: 
   - "Based on your recent eats" with 2 small personalized suggestion cards at top
   - Search with no results shows "Add as custom" button
6. **Week graph**: Real data from logs (last 7 days), day circles colored by mood (red/yellow/green), tap day for detail modal with all foods + moods with timestamps
7. **Track Progress page** (`/progress`): 30-day mood trend, metric breakdowns (Energy/Focus/Clarity/Stress), food frequency bar chart, correlation insights, recent logs, stats

---

## How the Food Suggestions Page Works

- **Data**: Static list (`foodSuggestions` in `mockData.ts`). Does **not** change based on user history.
- **Filtering**: Filter by **All**, **Energy ⚡**, **Focus 🎯**, or **Mood 😌**. Matches any tag in `benefitTags` array (foods can have multiple tags).
- **Allergen filtering**: Foods with allergens matching user's selected allergies are automatically hidden.
- **Interaction**: Tap card → center modal with description and "Log this food" button. Success modal centers on screen and stays until dismissed.

---

## Custom Food Analysis

**Question**: How can we analyze custom foods and rate them when users add foods not in the suggestion list?

**Options**:

1. **AI Chatbot Integration (OpenAI/Gemini)**  
   - When user adds custom food, send to AI API: `"Analyze the nutritional benefits of [food name] for focus and energy"`
   - AI returns tags (Energy, Focus, Mood), a brief "why," and potential allergens
   - Store in localStorage as enriched custom food with tags and description
   - **Pros**: Very flexible, handles anything (e.g. "leftover pizza," "mom's pasta")
   - **Cons**: Requires API key, costs per request, needs network
   - **Implementation**: Add "Rate custom foods with AI" toggle in Settings; if enabled, call AI API after logging custom food and show a loading state, then update the food log entry with tags/benefits

2. **Large Food Database (USDA, Open Food Facts, Nutritionix)**  
   - Search food name in nutrition database API
   - Map nutrients to tags: high protein/fat → Energy, magnesium/omega-3 → Focus, antioxidants → Mood
   - **Pros**: Accurate nutrition data, no AI ambiguity
   - **Cons**: Requires API, complex mapping logic, only works for known foods
   - **Implementation**: When adding custom food, query API; if found, auto-tag and show "Found in database: [name]" with tags

3. **Hybrid: Keyword + AI fallback**  
   - First check custom food name against expanded keyword list (e.g. "pizza" → Heavy meal tag, "pasta" → carbs)
   - If no match, optionally call AI or show "Unknown food — we'll track it but can't rate it yet"
   - **Pros**: Works offline for common items, AI only when needed
   - **Cons**: Still needs AI key for uncommon foods
   - **Implementation**: Expand `FOOD_TAG_KEYWORDS` in `calculateCorrelations.ts` to 100+ common foods; add "Analyze with AI" button in custom food success modal for unmatched foods

4. **User self-tagging**  
   - When adding custom food, show optional "What kind? Energy, Focus, Mood, or skip"
   - User picks tags; app uses that for future correlations
   - **Pros**: No API, user knows their food best, educational (user learns which foods are which)
   - **Cons**: More friction, users might not know or skip
   - **Implementation**: After typing custom food name, show 3 buttons: "Energy ⚡", "Focus 🎯", "Mood 😌", "Skip". Store tags with the food log entry.

**Recommendation**:  
Start with **Option 4 (User self-tagging)** for immediate value with no API cost. Then add **Option 3 (Hybrid)** later: expand keyword list to 100+ common foods (pizza, pasta, burger, sandwich, salad variants, common brands), then for truly unknown foods offer "Analyze with AI" as an opt-in feature (with user's own API key in Settings).

---

## Track Progress Page

- **Access**: Dashboard → "Track Progress" button (or `/progress` URL)
- **Charts tab**:
  - 30-day mood trend line chart (overall avg mood)
  - Metric breakdown: Energy, Focus, Clarity, Stress as separate lines over 30 days
  - Most logged foods bar chart (top 10)
  - Detected patterns (correlation insights) with confidence levels
- **Recent tab**: Last 20 food logs and last 20 mood logs with timestamps and details
- **Stats tab**: Overall averages for each metric, best/worst mood days, total log counts

---

## Snacks vs Full Meals

- **Current**: **Snack-focused** by design.
- **Rationale**: Focus and energy are often influenced by **between-meal choices**. Snacks are quick to log and correlate well with mood fluctuations.
- **Custom food**: Supports logging full meals; correlation engine tracks them the same way.

---

## Other Improvement Ideas

1. ✅ Week graph with real data and day detail (implemented)
2. ✅ Track Progress page (implemented)
3. **Mood log → Food**: From Mood screen, add "Log what you ate before this" link
4. **Suggestions "Bookmark"**: Persist favorites; add to Food Log quick-add
5. **Accessibility**: Focus traps on modals, Escape to dismiss, keyboard navigation
6. **Onboarding**: One-time tour: "Log food → log mood → see patterns"
7. **Export data**: "Export my data" in Settings (CSV or JSON download)
8. **Streaks heatmap**: Calendar view of logging activity like GitHub contributions
9. **Smart notifications**: If user logged food but not mood for 2+ hours, remind them
10. **Weekly email**: Summary of the week's patterns, best day, suggestions for next week
