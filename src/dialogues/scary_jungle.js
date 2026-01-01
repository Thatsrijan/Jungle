export default [
    {
      speaker: "her",
      expression: "her_scared",
      text: "This place feels different…"
    },
    {
      speaker: "you",
      expression: "you_listen", // Will fallback to front/explain
      text: "I’m right here."
    },
    {
      speaker: "her",
      expression: "her_scared",
      text: "I can’t see clearly anymore."
    },
    {
      speaker: "you",
      expression: "you_explain",
      text: "Just listen. Follow my voice."
    },
    {
      speaker: "her",
      expression: "her_trust", // We will map this to her_trust_scared
      text: "Okay… I trust you."
    },
    {
      speaker: "her",
      expression: "her_scared",
      text: "Don’t let go."
    },
    {
        action: "END_SCENE"
    }
  ];