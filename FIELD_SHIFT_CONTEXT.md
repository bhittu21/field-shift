# FIELD SHIFT — PROJECT CONTEXT

## 1. Project Identity

**Project:** Field Shift

**Competition:** NASA Space Apps Challenge 2026

**Challenge:** Field Shift: Adapting Farms with NASA Data

**Repository:** https://github.com/bhittu21/field-shift

**Target audience:** Farmers in Bangladesh.

**Primary language:** Bangla.

**Secondary language:** English.

**Design identity:** Bangladesh-inspired green and red.

## 2. The Problem

Farmers face changing temperatures, rainfall patterns, water availability, and soil conditions.

Traditional farming practices may become less suitable as environmental conditions change.

Choosing appropriate crop rotations is difficult because farmers must consider:

- Water availability.
- Soil health.
- Nutrient cycling.
- Crop characteristics.
- Pest cycles.
- Erosion.
- Growing seasons.
- Market opportunities.

Scientific environmental datasets are also difficult for ordinary farmers to interpret.

## 3. Our Solution

Field Shift is a bilingual agricultural decision-support demonstration platform.

It translates environmental observations and agricultural knowledge into accessible insights.

The platform has two connected experiences:

### Experience A: Crop Rotation Explorer

The primary feature.

Compare three illustrative farming strategies:

1. Existing Farming Practice.
2. Legume-Inclusive Rotation.
3. Water-Conscious Rotation.

Help farmers explore the potential benefits and risks of different rotation strategies.

### Experience B: Climate Shift Explorer

The supporting feature.

Demonstrate how historical and recent environmental conditions differ.

Compare:

- 1991–2005.
- 2010–2024.

Show temperature trends, hot-day frequency, rainfall patterns, and estimated planting-window changes.

The climate explorer provides environmental context for the rotation explorer.

## 4. Core User Journey

The main user experience should follow this flow:

1. Visit the Field Shift homepage.
2. Understand the platform's purpose.
3. Select a district.
4. Select a crop.
5. Explore local environmental indicators.
6. Compare three rotation strategies.
7. Select personal farming priorities.
8. Review potential benefits and risks.
9. Understand why each strategy is being suggested.
10. Review the data limitations and seek local agricultural guidance.

Keep this journey simple.

Do not introduce unnecessary forms or complicated configuration.

## 5. Supported Locations

Start with:

- Dhaka.
- Rajshahi.
- Khulna.
- Rangpur.
- Barishal.
- Sylhet.

Use appropriate Bangla labels.

District-level demo values must be explicitly identified as illustrative, not field-level measurements.

## 6. Supported Crops

Start with:

- Boro rice — বোরো ধান.
- Aman rice — আমন ধান.
- Wheat — গম.
- Mustard — সরিষা.
- Lentil — মসুর.
- Mung bean — মুগ ডাল.

Do not invent precise agronomic thresholds.

Where evidence is missing, show the information gap instead.

## 7. Crop Rotation Scenarios

Implement three comparable scenarios.

### Scenario 1: Existing Practice

Show a simplified example of the current cropping pattern.

Use it as a baseline.

### Scenario 2: Legume-Inclusive Rotation

Demonstrate how incorporating suitable legumes may contribute to nitrogen cycling and soil improvement.

Include risks, local suitability limitations, and water requirements.

### Scenario 3: Water-Conscious Rotation

Demonstrate alternative crop sequences that may reduce water pressure.

Include potential benefits and trade-offs.

For all three:

- Display crop sequences.
- Show illustrative water-demand categories.
- Describe potential soil benefits.
- Explain nitrogen-fixing potential where applicable.
- Identify potential erosion implications.
- Mention pest-cycle considerations.
- Show market-related uncertainties.
- Display evidence status.

Never claim universal superiority.

## 8. Farmer Priorities

Allow users to choose multiple priorities:

- Water conservation.
- Soil health.
- Erosion reduction.
- Additional income opportunities.
- Climate resilience.

Update the comparison interface based on their choices.

Use an explainable, illustrative scoring method.

Clearly identify all weights and results as demonstration assumptions.

Do not present them as validated scientific recommendations.

## 9. Climate Shift Explorer

Display:

- Annual hot-day counts.
- Rainfall patterns.
- Estimated heavy-rain onset.
- Soil moisture indicators.
- Vegetation health indicators.
- Historical planting-window comparisons.

Use old and recent period comparisons.

Keep the charts simple and understandable.

Include explanatory labels.

## 10. NASA and Scientific Resources

Use the official challenge's resources as the intended future scientific foundation.

NASA resources:

- SMAP — soil moisture.
- GPM / IMERG — precipitation.
- NASA POWER — meteorological and agroclimatology data.
- MODIS / VIIRS / Landsat — vegetation indices and seasonal changes.
- SRTM — elevation and terrain.
- ECOSTRESS — land-surface temperature and evapotranspiration.
- GRACE / GRACE-FO — large-scale water-storage context.

Partner resources:

- ESA Sentinel-2.
- ECMWF ERA5.

Do not mistake U.S.-specific datasets such as USDA Web Soil Survey, SSURGO, PRISM, or USDA Cropland Data Layer for Bangladeshi agricultural observations.

Clearly label integrations as:

- Verified Source.
- Demo Data.
- Planned Integration.
- Not Connected.

## 11. Technical Strategy

The project must work without external API credentials.

Inspect existing framework and preserve useful code.

Use the existing architecture wherever practical.

Preferred demonstration setup:

- Existing frontend framework.
- Local JSON demonstration dataset.
- Existing chart library, if available.
- localStorage for language preferences.
- Existing database only if valid credentials and connectivity are available.

Otherwise use local demonstration storage.

No new cloud infrastructure.

No paid subscriptions.

No authentication.

No external LLM.

No live messaging API.

No automated voice or speech synthesis.

WhatsApp and SMS should be visual mock-ups only.

## 12. Bilingual Requirements

Default language: Bangla.

Alternative: English.

Translate the entire application, including charts, labels, navigation, messages, disclaimers, and data descriptions.

Use Bengali numerals and month names in Bangla mode.

Use English numerals and month names in English mode.

Store translation dictionaries centrally.

Persist the selected language.

## 13. Visual Identity

Primary green: #006A4E.

Dark green: #004D39.

Accent red: #F42A41.

Background: #F7F9F7.

Surface: #FFFFFF.

Primary text: #17211D.

Secondary text: #68766E.

Border: #E3EAE5.

Use minimal, professional agricultural technology styling.

Focus on clarity instead of decoration.

Typography must support Bengali correctly.

## 14. UX Acceptance Requirements

The application must:

- Be mobile-first.
- Use simple navigation.
- Use clear visual hierarchy.
- Have readable Bengali typography.
- Provide clear feedback for interactions.
- Use understandable charts.
- Have adequate button sizes.
- Avoid unnecessary forms.
- Avoid cluttered dashboards.
- Use consistent spacing.
- Avoid overlapping text.
- Avoid clipped content.
- Avoid horizontal scrolling.

Test widths:

320px, 360px, 390px, 768px, 1024px, 1440px.

Never declare the interface finished without inspecting its rendered appearance.

## 15. Data Integrity

All synthetic measurements must be labelled.

Use:

`isDemo: true`

Do not fabricate NASA measurements.

Do not fabricate citations.

Clearly distinguish between potential benefits and verified evidence.

State that the platform supports farmer judgment and does not replace agricultural experts.

## 16. Incremental GitHub Delivery

Repository:

https://github.com/bhittu21/field-shift

Work in the following milestones.

**Milestone 1 — Foundation**
- Repository inspection.
- Design system.
- Responsive navigation.
- Homepage and layout.
- Initial demo dataset.

Test and push to GitHub.

**Milestone 2 — Climate Explorer**
- District and crop selection.
- Climate indicators.
- Charts.
- Then vs Now comparison.
- Bilingual functionality.

Test and push to GitHub.

**Milestone 3 — Crop Rotation Explorer**
- Three rotation scenarios.
- Comparison cards.
- Farmer priority selection.
- Explanation and risk sections.

Test and push to GitHub.

**Milestone 4 — Completion and QA**
- NASA resource section.
- WhatsApp/SMS mock-ups.
- Responsive polish.
- Text-overlap fixes.
- Accessibility checks.
- README updates.

Test and push to GitHub.

Do not wait until the end to push.

Each milestone must leave a working application.

Never force-push or overwrite unrelated changes.

## 17. Time Constraint

The target development time is approximately 60 minutes.

Prioritize:

1. Working core experience.
2. Crop rotation comparison.
3. Bilingual interface.
4. Climate visualization.
5. Responsive UX.
6. Visual polish.
7. Future integration mock-ups.

Do not spend the hour on infrastructure.

Freeze new feature development around minute 45.

Use the final time for testing, GitHub delivery, and fixing critical issues.

## 18. Product Vision

Field Shift should feel like a practical agricultural decision-support tool.

A farmer should understand:

- What is changing.
- Why it matters.
- What different farming strategies could offer.
- What risks exist.
- Where more local information is needed.

The ultimate goal is to make environmental information more understandable and useful for agricultural decisions in Bangladesh.