export default [
    {
        speaker: "her",
        expression: "her_scared", // Using existing asset
        text: "Sri, look. A massive tree has fallen across the path."
    },
    {
        speaker: "you",
        expression: "you_explain",
        text: "It must have come down in the last storm. It's blocking the way."
    },
    {
        speaker: "her",
        expression: "her_trust_scared", // Perfect for hesitation
        text: "It looks slippery. I don't think I can climb over it alone."
    },
    {
        speaker: "you",
        expression: "you_smile",
        text: "You don't have to. I'm right here."
    },
    {
        speaker: "system",
        text: "Tap the icon to help Roshni cross the log."
    },
    // --- QUEST TRIGGER ---
    {
        action: "START_QUEST"
    },
    // --- SUCCESS SEQUENCE ---
    {
        speaker: "her",
        expression: "her_excited", // Relief/Success
        text: "Whoa!"
    },
    {
        speaker: "you",
        expression: "you_front",
        text: "Gotcha. Steady..."
    },
    {
        speaker: "her",
        expression: "her_soft_smile",
        text: "Thanks. You have a surprisingly strong grip."
    },
    {
        speaker: "you",
        expression: "you_smile",
        text: "Only when it matters. Let's keep moving."
    },
    {
        action: "END_SCENE"
    }
];