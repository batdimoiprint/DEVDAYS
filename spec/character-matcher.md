# Cue-pid character matcher

## Goal
Let a player spin two groups of character names, see the resulting match, and create a short AI video of the pair.

## Scope and acceptance
- Players can edit the male and female name lists and spin both rings of a wheel; the two pointers indicate the names that match the revealed result.
- The existing Cue-pid match results and trailer remain available. The room-matching mode is removed.
- A player can request a Veo video for the selected pair, see progress and failures, and play the finished video.
- Google credentials stay server-side. Video generation is protected by an access code to prevent anonymous use of a paid API key.
- Missing configuration and provider errors are shown clearly. No real paid generation is required for local verification.

## Approach
Keep the existing prototype as the interface, serve it from Next.js, and add a wheel interaction to its duo flow. Add server route handlers for starting and polling a Gemini Veo operation and proxying its result. Use environment variables for the Gemini key and access code. Document setup and cost considerations.
