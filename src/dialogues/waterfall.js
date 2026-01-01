export default [
  {
    speaker: "her",
    expression: "her_front",
    text: "It’s so peaceful here…"
  },
  {
    speaker: "you",
    expression: "you_front",
    text: "I wanted to stop somewhere special."
  },
  // --- START GIVING FLOWERS ---
  {
    action: "GIVE_FLOWERS"
  },
  {
    speaker: "you",
    expression: "you_give_flower", 
    text: "This is for you."
  },
  {
    speaker: "her",
    expression: "her_recieve_flower", 
    text: "Flowers? …You didn’t have to."
  },
  // --- STOP GIVING FLOWERS (FIX) ---
  {
    action: "RESET_POSE"
  },
  {
    speaker: "her",
    expression: "her_trust",
    text: "But I’m really glad you did."
  },
  {
    speaker: "you",
    expression: "you_smile",
    text: "Stand there. Let me capture this moment."
  },
  // --- START REAL CAMERA ---
  {
    action: "START_CAMERA" 
  },
  {
    speaker: "her",
    expression: "her_soft_smile",
    text: "Wait— like this?"
  },
  {
    speaker: "you",
    expression: "you_front",
    text: "Perfect."
  },
  // ... rest of dialogue ...
  {
      action: "SLEEP_MODE"
  },
  {
      speaker: "you",
      text: "We should rest here."
  },
  {
      action: "END_SCENE"
  }
];