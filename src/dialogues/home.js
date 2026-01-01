// src/dialogues/home.js
// Home scene dialogues with options (HER chooses, YOU auto replies)

export default[
  {
    speaker: "you",
    text: "Hey."
  },
  {
    speaker: "her",
    text: "You’re smiling like you’re hiding something."
  },
  {
    speaker: "you",
    text: "Am I not allowed to smile now?"
  },
  {
    speaker: "her",
    text: "You are. But this one feels… planned."
  },

  // ---- OPTIONS (HER CHOOSES) ----
  {
    speaker: "her",
    text: "So tell me. What’s going on?",
    options: [
      {
        text: "You're imagining things.",
        reply: "Maybe I am. But I like how observant you are."
      },
      {
        text: "I wanted to do something different today.",
        reply: "Different sounds interesting. And slightly dangerous."
      },
      {
        text: "I wanted this moment to feel special.",
        reply: "Then you’re already doing a good job."
      }
    ]
  },

  // ---- CONTINUES AFTER OPTION ----
  {
    speaker: "you",
    text: "Come here for a second."
  },
  {
    speaker: "her",
    text: "That tone again… should I be nervous?"
  },
  {
    speaker: "you",
    text: "Only if you don’t trust me."
  },
  {
    speaker: "her",
    text: "That’s unfair. You know I do."
  },
  {
    speaker: "you",
    text: "Then close your eyes."
  },
  {
    speaker: "her",
    text: "Wait—why?"
  },
  {
    speaker: "you",
    text: "Because the next part works better that way."
  },
  {
    speaker: "her",
    text: "…okay. But if you scare me, I’m blaming you."
  },

  // ---- SCENE CHANGE ----
  {
    action: "BLINDFOLD"
  }
];