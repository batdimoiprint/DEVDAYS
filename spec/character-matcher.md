# Cue-pid character matcher

## Goal
Choose a couple at random using a two-pointer wheel, then show the match and its video in a modal.

## Acceptance
- Each spin selects one of three pairs: Gehlee and Jeo Ong, Queen Leng and Xander Ford, or Kara David and Dinorobong Tubo. Both pointers land on the selected names.
- The modal shows the couple immediately after the wheel stops and can be dismissed. Possible pairs remain readable below the wheel.
- All three pairs show a loading placeholder, then play their assigned local video as soon as it is ready.
- The page uses solid colors, plays no background music, and makes no paid video-generation requests.

## Approach
The Next.js app serves the Cue-pid prototype and the three supplied videos from `public/`. The existing Veo API remains available for future integration but is not called by the page.
