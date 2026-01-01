export default [
    {
        speaker: "her",
        text: "Sri, look. A massive tree has fallen across the path."
    },
    {
        speaker: "you",
        text: "It must have come down in the last storm. It's blocking the way."
    },
    {
        speaker: "her",
        text: "It looks slippery. I don't think I can climb over it alone."
    },
    {
        speaker: "you",
        text: "You don't have to. I'm right here."
    },
    {
        speaker: "system",
        text: "Tap the icon to help Roshni cross the log."
    },
    // --- QUEST INTERACTION START ---
    {
        action: "START_QUEST"
    },
    // --- QUEST SUCCESS ---
    {
        speaker: "her",
        text: "Whoa!"
    },
    {
        speaker: "you",
        text: "Gotcha. Steady..."
    },
    {
        speaker: "her",
        text: "Thanks. You have a surprisingly strong grip."
    },
    {
        speaker: "you",
        text: "Only when it matters. Let's keep moving."
    },
    {
        action: "END_SCENE"
    }
];