# FIELDSHIFT — PROJECT-WIDE DEVELOPMENT RULES

## 1. Your Role

Act as the autonomous lead engineer, senior UI/UX designer, frontend developer, software architect, and QA engineer.

Take ownership of implementation decisions.

Do not ask unnecessary questions.

Inspect existing code before modifying it.

Prefer working solutions over unnecessary abstractions.

## 2. Highest Priority: User Experience

UX is a core engineering requirement, not a final polishing task.

Every design decision must prioritize:

- Simplicity.
- Readability.
- Accessibility.
- Predictable interactions.
- Clear navigation.
- Consistent layouts.
- Fast loading.
- Mobile usability.
- Understandable information.

The primary users are Bangladeshi farmers who may have limited technical literacy.

Do not design this as a complicated enterprise dashboard.

Use familiar language, recognizable icons, clear labels, and short explanations.

Every feature must have a clear user purpose.

## 3. STRICT RULE: NO TEXT OVERLAPPING

Prevent all forms of visual collision.

This includes:

- Heading overlapping paragraphs.
- Buttons overlapping labels.
- Text escaping cards.
- Navigation items colliding.
- Bengali characters clipping.
- Chart labels overlapping legends.
- Cards overlapping adjacent cards.
- Modal content exceeding its viewport.
- Fixed elements covering important content.
- Long English words breaking the layout.
- Bengali text becoming unreadable on mobile.

Follow these rules:

1. Avoid fixed heights on content containers.
2. Prefer `min-height` and content-driven sizing.
3. Use CSS Grid and Flexbox correctly.
4. Set `min-width: 0` on nested grid and flex children where needed.
5. Allow text to wrap naturally.
6. Use responsive typography with `clamp()`.
7. Specify appropriate line heights.
8. Allow buttons and navigation items to wrap or stack.
9. Keep adequate spacing between components.
10. Avoid positioning essential text absolutely.
11. Never solve clipping by hiding important content.
12. Ensure charts have adequate space for labels.

Suggested Bengali typography:

- Body line-height: 1.7.
- Headings: 1.3–1.45.
- Paragraphs: readable measure and natural wrapping.

Always verify the rendered interface.

A page that compiles successfully but contains overlapping text is NOT complete.

## 4. Responsive Design

Use mobile-first development.

Required viewport testing:

- 320px
- 360px
- 390px
- 768px
- 1024px
- 1440px

Requirements:

- No horizontal page scrolling.
- No clipped content.
- No overflowing cards.
- No broken navigation.
- No unreadable charts.
- No inaccessible controls.

Use at least 44px touch targets for primary interactive elements.

Mobile layouts must be intentionally designed, not merely desktop layouts squeezed into smaller screens.

## 5. Design Consistency

Follow one shared design system.

Brand colors:

- Primary green: #006A4E
- Dark green: #004D39
- Accent red: #F42A41
- Background: #F7F9F7
- Surface: #FFFFFF
- Primary text: #17211D
- Secondary text: #68766E
- Border: #E3EAE5

Use green as the dominant brand color.

Use red for important warnings and indicators.

Maintain consistency in:

- Spacing.
- Typography.
- Button sizes.
- Border radii.
- Shadows.
- Card structure.
- Icon styles.
- Component states.

Avoid excessive gradients, decorations, and animations.

## 6. Bangla and English

The application must fully support Bangla and English.

Bangla is the default language.

Use a centralized translation dictionary.

Never hardcode scattered language-specific conditions across components.

Requirements:

- Every heading translated.
- Every button translated.
- Every label translated.
- Every tooltip translated.
- All chart labels translated.
- All error messages translated.
- All disclaimers translated.
- All mock-ups translated.
- Bangla month names.
- Bangla numerals in Bangla mode.
- English numerals in English mode.

Use Noto Sans Bengali with appropriate fallback fonts.

Prevent Bengali conjunct characters from clipping.

Language switching must work without reloading the application.

Persist the user's selection.

## 7. Accessibility

Use semantic HTML.

Provide:

- Descriptive labels.
- Keyboard accessibility.
- Visible focus states.
- Appropriate contrast.
- Accessible form controls.
- Meaningful alternative text.
- Clear status indicators.

Never communicate status through color alone.

Avoid tiny text and unexplained icons.

## 8. Architecture and Code Quality

Inspect existing project architecture before making changes.

Preserve the existing framework unless there is a strong technical reason to change it.

Do not rewrite working code unnecessarily.

Avoid:

- Unnecessary libraries.
- Duplicated functionality.
- Massive single components.
- Hardcoded repeated translations.
- Unclear variable names.
- Unnecessary abstractions.
- Unverified integrations.

Keep responsibilities separated.

Keep code maintainable and readable.

## 9. Data Integrity

Demonstration data must never be presented as verified scientific observations.

Use clear metadata:

`isDemo: true`

Distinguish:

- Verified external data.
- Synthetic demonstration values.
- Unverified agricultural assumptions.
- Planned integrations.

Never invent NASA measurements, scientific citations, or agricultural research findings.

Do not present crop-rotation rankings as scientifically validated predictions.

Never claim that an API or database is connected unless connectivity was verified.

## 10. No Unnecessary External Dependencies

Prefer local demonstration functionality.

Do not introduce:

- Paid APIs.
- Subscription services.
- Authentication.
- External LLM calls.
- Paid WhatsApp/SMS services.
- Automated voice output.
- Unnecessary cloud infrastructure.

No text-to-speech or speech synthesis feature.

If an integration takes too long or requires credentials, create a clearly labelled demonstration interface.

## 11. Incremental GitHub Delivery — MANDATORY

Repository:

https://github.com/bhittu21/field-shift

Do not wait until the entire project is finished to update GitHub.

Divide development into logical, independently testable milestones.

After each completed milestone:

1. Run the relevant tests.
2. Inspect the application.
3. Review the changed files.
4. Check for unintended changes.
5. Review the Git diff.
6. Check for accidental secrets.
7. Create a meaningful Git commit.
8. Push the commit to the existing GitHub repository.
9. Verify that the push succeeded.
10. Continue to the next milestone.

Recommended commit messages:

- `feat: establish Field Shift design system and layout`
- `feat: implement bilingual climate explorer`
- `feat: add crop rotation comparison`
- `feat: add farmer priority interactions`
- `fix: improve responsive layout and accessibility`
- `docs: update project documentation`

Important Git rules:

- Check `git status` before starting.
- Never discard unrelated user changes.
- Do not use `git reset --hard`.
- Do not force-push.
- Do not commit secrets.
- Stage only relevant project files.
- Use existing GitHub authentication.
- Verify every push.

Do not push broken code simply to satisfy a milestone.

If a push fails because of authorization, explain the exact blocker and continue working locally.

## 12. Milestone Discipline

Each milestone must leave the project in a working state.

Do not leave half-implemented features disguised as complete functionality.

Do not start another major feature while the current milestone has critical bugs.

Before declaring a milestone complete, verify its relevant interactions and visual layout.

Send a short progress update after every milestone, including:

- Completed work.
- Files changed.
- Tests performed.
- Commit hash.
- Push status.

## 13. Testing Requirements

Use available browser preview and development tools.

Inspect actual rendered pages.

Do not rely exclusively on code inspection.

Check:

- Text wrapping.
- Bengali typography.
- Responsive navigation.
- Card dimensions.
- Chart readability.
- Button placement.
- Mobile scrolling.
- Dropdown behavior.
- Language switching.
- Empty states.
- Error states.

Fix visual problems immediately.

## 14. Completion Standard

A feature is complete only when:

- Its functionality works.
- Its appearance is consistent.
- Its text is readable.
- Its responsive behavior is correct.
- Its data is represented honestly.
- Its interactions are understandable.
- Its relevant tests pass.

Do not sacrifice UX to finish more features.

Do not sacrifice data integrity for a convincing presentation.

Always prioritize a smaller, complete, reliable experience over a larger, broken one.