# Component Extraction Tracker

This file tracks UI pieces that still appear to be page-local or duplicated and should likely be extracted into reusable components.

## High Priority

- [x] `GameScreenShell`
  - Shared outer layout/card wrapper repeated in `src/pages/Home.tsx`, `src/pages/Guessing.tsx`, `src/pages/Success.tsx`, and `src/pages/PokedexComplete.tsx`
- [x] `GameStatsBar`
  - Top stat row repeated in `src/pages/Guessing.tsx` and `src/pages/Success.tsx`
- [x] `PokemonArtPanel`
  - Framed Pokemon image area repeated in `src/pages/Guessing.tsx` and `src/pages/Success.tsx`
- [ ] `LetterKeyboard`
  - On-screen keyboard in `src/pages/Guessing.tsx`
- [ ] `OfflinePackCard`
  - Individual offline pack row in `src/components/OfflinePacks.tsx`

## Game Flow

- [ ] `PageTitleHero`
  - Pokeball/logo + title block in `src/pages/Home.tsx`
- [ ] `PuzzleWord`
  - Underscore/reveal row in `src/pages/Guessing.tsx`
- [ ] `MissesLabel`
  - “Misses / No misses yet” status line in `src/pages/Guessing.tsx`
- [ ] `TextActionLink` or `BackHomeLink`
  - Repeated text-only action button/link style in `src/pages/Guessing.tsx`, `src/pages/Success.tsx`, and `src/pages/OfflinePacksPage.tsx`

## Result / Completion

- [ ] `PokemonIdentity`
  - Dex number + Pokemon name block in `src/pages/Success.tsx`
- [ ] `PrimaryActionButton`
  - Page-local primary action button styles in `src/pages/Success.tsx` and `src/pages/PokedexComplete.tsx`
- [ ] `CompletionSummary`
  - “You completed this dex in…” summary block in `src/pages/PokedexComplete.tsx`

## Offline Packs / Messaging

- [ ] `ProgressBar`
  - Download progress UI in `src/components/OfflinePacks.tsx`
- [ ] `InlineStatusMessage`
  - Error/help text patterns in `src/components/OfflinePacks.tsx` and `src/pages/Home.tsx`

## Notes

- `Badge` has already been extracted.
- `GenerationSelect` and `OfflinePacks` are composite components and should stay out of Storybook unless they are split into smaller presentational pieces.
