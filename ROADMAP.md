# Guess The Pokemon Roadmap

This roadmap is optimized for a side project, not a formal product team.

Use it to answer one question quickly:

`What can I build in a day that improves the app and looks good on a resume?`

## How To Use This

- Pick from `Now` first
- Favor `S` and `M` tasks over `L`
- Try to ship one visible improvement per session
- Do not start big feature work before the core screens feel polished

Effort guide:
- `S`: 1 to 3 hours
- `M`: half day to 1 day
- `L`: 2 to 4 days

## Pick One Today

These are the best next tasks if you only have a day:

| Task | Why it matters | Effort |
| --- | --- | --- |
| Add physical keyboard support | Biggest gameplay UX win on desktop | `M` |
| Show `caught / total` during a run | Makes progress visible and motivating | `S` |
| Replace text lives with visual lives | Improves clarity and game feel | `S` |
| Tighten spacing on guessing screen | Removes dead space and improves polish | `S` |
| Improve used-letter states | Makes correct vs wrong guesses easier to read | `S` |
| Add clearer resume state on home screen | Makes returning to a run much easier | `M` |
| Redesign generation select into cards | Big visual upgrade for portfolio value | `L` |

## Now

These are the highest-value tasks for the current version of the app.

### Core Gameplay UX

| Task | Effort | Resume value | Notes |
| --- | --- | --- | --- |
| Add physical keyboard support | `M` | High | Good polish signal for recruiters |
| Show in-run progress `43 / 151` | `S` | Medium | Small change, strong UX gain |
| Add visual lives indicator | `S` | Medium | Better than text-only lives |
| Improve correct/wrong guess feedback | `S` | Medium | Motion, color, or status refinement |
| Make misses easier to scan | `S` | Medium | Current misses are too quiet visually |

### UI Polish

| Task | Effort | Resume value | Notes |
| --- | --- | --- | --- |
| Tighten vertical layout on guessing screen | `S` | High | Most visible improvement from the recording |
| Strengthen top stats hierarchy | `S` | Medium | Streak, best, and lives should feel more important |
| Improve footer action placement | `S` | Low | Bottom helper text feels detached |
| Improve splash/loading screen | `M` | Medium | Current delay works but is not very purposeful |
| Refine button disabled states | `S` | Medium | Used letters should communicate state more clearly |

### Home Screen Improvements

| Task | Effort | Resume value | Notes |
| --- | --- | --- | --- |
| Show current run progress on home | `M` | High | Better resume state for returning users |
| Add pack completion summary | `S` | Medium | Helps show progression at a glance |
| Improve offline availability messaging | `S` | Medium | Reduce confusion before starting a pack |

## Next

These are strong follow-up tasks once the current core loop feels better.

| Task | Effort | Why it should wait |
| --- | --- | --- |
| Redesign generation dropdown into cards | `L` | More UI work, but high portfolio value |
| Add a simple stats summary on home | `M` | Better after run-progress improvements ship |
| Add reduced-motion support | `M` | Worth doing once motion patterns exist |
| Improve focus states and keyboard nav | `M` | Pairs well with keyboard support |
| Add optional sound effects with mute toggle | `M` | Nice polish, not core UX |

## v1.2 Home Screen Mock

This is the recommended direction for the home screen redesign.

The current screen works, but it is too dependent on a dropdown and hides useful information until after selection. The next version should feel more browseable and more game-like.

### Layout Structure

```text
+--------------------------------------------------+
|                   Guess The Pokemon              |
|         short tagline or progress summary        |
+--------------------------------------------------+
| Resume Run                                       |
| Gen 1   43 / 151 caught   Best streak 12         |
| [ Resume ]                     [ Reset ]         |
+--------------------------------------------------+
| Your Progress                                    |
| Packs completed: 2 / 9     Total clears: 5       |
+--------------------------------------------------+
| Choose a Generation                              |
| [Gen 1 card] [Gen 2 card]                        |
| [Gen 3 card] [Gen 4 card]                        |
| [Gen 5 card] [Gen 6 card]                        |
| ...                                              |
+--------------------------------------------------+
| Offline Packs                                    |
| 3 / 9 ready                      [ Manage ]      |
+--------------------------------------------------+
```

### Recommended Sections

#### 1. Hero

Keep:
- logo
- app title

Add:
- short supporting line such as `Catch every Pokemon one generation at a time`
- optional high-level summary like `2 generations completed`

Why:
- gives the page stronger identity
- makes the screen feel less like a form

#### 2. Resume Run Card

Only show this if a run exists.

Should include:
- generation name
- `caught / total`
- current streak
- best streak
- primary `Resume` action
- secondary `Reset` action

Why:
- returning users should not have to re-select a pack just to continue

#### 3. Progress Summary

Show a compact stats strip:
- packs completed
- total clears
- best streak overall

Why:
- gives progression more meaning
- adds portfolio-friendly product thinking

#### 4. Generation Card Grid

Replace the dropdown with cards.

Each card should show:
- generation name
- dex range or Pokemon count
- status badge: `new`, `in progress`, `completed`, `offline ready`
- best streak
- completion progress if a run exists

Card actions:
- default tap selects the card
- selected card reveals primary CTA below the grid or inside the card

Why:
- much stronger visual design
- easier to scan than a select menu
- better for resume screenshots

#### 5. Offline Packs Row

Keep offline pack management accessible, but demote it below the core game choice.

Should include:
- count of downloaded packs
- short offline status message
- `Manage` action

Why:
- useful feature, but should not compete with starting the game

### Visual Direction

The redesign should move from `single centered form` to `stacked dashboard`.

Visual goals:
- stronger section hierarchy
- more card-based layout
- less empty space
- clearer status badges
- more visible progression data

Do not:
- add too many tiny stats
- make every card visually loud
- bury the main play action under management UI

### Suggested Build Slices

If you want to build this over several sessions:

1. Add `Resume Run` card above the selector
2. Add `Progress Summary` strip
3. Replace dropdown with static generation cards
4. Wire generation cards to selection state
5. Add badges and progress states to each card
6. Refine spacing and responsive layout

### Best One-Day Version

If you only want the smallest strong step toward this redesign:

- keep the current page shell
- add a `Resume Run` card
- add a `Progress Summary` row
- replace the dropdown with a simple two-column card grid

That is enough to make the home screen feel materially better without turning it into a full UI rewrite.

## Later

These are good ideas, but not the best use of side-project time yet.

| Task | Effort | Why later |
| --- | --- | --- |
| Hint system | `M` | Better once the base loop is fully polished |
| Difficulty modes | `M` | Depends on stronger baseline UX |
| Achievements / badges | `M` | More useful after stats and progression improve |
| Daily challenge | `L` | Strong feature, but bigger product step |
| Pokédex browser | `L` | Great feature, not the highest immediate ROI |
| Shareable result cards | `L` | Valuable for growth, less valuable than core polish |

## Good Resume-Friendly Milestones

If your goal is portfolio value, these are the strongest mini-milestones:

1. `Input + accessibility pass`
   Includes keyboard support, better focus states, and clearer used-letter states.

2. `Gameplay HUD polish`
   Includes progress indicator, visual lives, improved misses, and better spacing.

3. `Home screen redesign`
   Replace the generation dropdown with cards and clearer progression data.

4. `PWA polish`
   Improve offline messaging, pack status, and loading/update handling.

## Suggested Pace

Reasonable side-project pace:

- 1 small task in a weeknight session
- 1 medium task on a focused weekend session
- 1 larger UI milestone every 3 to 5 weeks

If you want momentum, do not plan by version first.
Plan by `one visible improvement per session`.

## Recommended Order

If starting today, tackle these in order:

1. Add in-run progress indicator
2. Tighten the guessing screen layout
3. Add visual lives
4. Add physical keyboard support
5. Improve the home screen resume state
6. Redesign generation selection into cards

## Not Worth Prioritizing Yet

These are tempting, but premature for this app right now:

- Accounts
- Leaderboards
- Backend services
- Social systems
- Large content expansions before the current UI is polished

The best investment for this project is still local UX quality.
