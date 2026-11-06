# Cue-pid

Cue-pid is a character-matching game. Edit the two name lists, spin the wheel, and see a fictional match. You can also enter two names directly.

Each match includes a ship name, a compatibility score, a three-part story, and other playful details. Copy a summary, save the illustrated portrait, or make a 24-second trailer in a browser that supports recording. Taglish, English, and a music toggle are available. Results are for entertainment, not a real measure of compatibility.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Google Veo video

1. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey) and enable billing for the Google project. Veo is a paid service; check [Google's current pricing](https://ai.google.dev/gemini-api/docs/pricing) before use.
2. Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY` and a long, private `VIDEO_ACCESS_CODE`.
3. Restart the server. Enter the access code on a match card to generate a video. Each request can incur charges; share the code only with trusted users.

For Vercel, add both variables in the project's environment settings and redeploy. Keep both values secret and never commit them. The access code gates this small shared installation; use proper user authentication, rate limits and billing controls before offering video generation publicly.
