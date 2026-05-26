POST /api/synastry

Request example (JSON):
{
  "chartA": {"Sun": 10.0, "Moon": 120.0},
  "chartB": {"Sun": 14.0, "Moon": 300.0},
  "options": { "aspects": ["conjunction","trine","sextile","square","opposition"] }
}

Response example (JSON):
{
  "aspects": [
    {"a":"A_Sun","b":"B_Sun","aspect":"conjunction","angle":0.0,"diff":4.0,"orb_diff":4.0,"orb":8.0,"strength":0.5}
  ],
  "raw_score": 0.5,
  "normalized_score": 12.5
}

Notes:
- normalized_score is 0..100. Use it to display qualitative labels: 0-30 Poor, 30-60 Fair, 60-80 Good, 80-100 Excellent.
- Accepts optional 'options.weights' and 'options.orbs' to override defaults for live tuning.
