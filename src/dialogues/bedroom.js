export default [
    {
      speaker: "her",
      expression: "her_wakeup_confused", //
      text: "…"
    },
    {
      speaker: "her",
      expression: "her_think", // Ensure this maps to a bedroom sprite or fallback
      text: "Why does everything feel so distant?"
    },
    {
      speaker: "her",
      expression: "her_wakeup_confused", // FIXED: Was her_front
      text: "That place… the waterfall…"
    },
    {
      speaker: "her",
      expression: "her_think",
      text: "Was that… a dream?"
    },
    {
      speaker: "her",
      expression: "her_wakeup_confused", // FIXED: Was her_front
      text: "It felt so real."
    },
    {
      speaker: "her",
      expression: "her_sleepy", // Ensure asset exists or falls back
      text: "I can still remember your voice…"
    },
    {
      speaker: "system",
      text: "*Ping!* (New Message)"
    },
    {
      action: "SHOW_NOTIFICATION"
    },
    {
      speaker: "her",
      expression: "her_phone_surprise", //
      text: "Huh? A message?"
    },
    {
      action: "SHOW_PHONE_SCREEN"
    },
    {
      speaker: "her",
      expression: "her_phone_smile", //
      text: "…Maybe it wasn’t just a dream."
    },
    {
        action: "END_GAME"
    }
  ];