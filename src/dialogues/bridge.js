export default [
    {
        speaker: "her",
        expression: "her_scared", 
        text: "Is that... safe? It looks ancient."
    },
    {
        speaker: "you",
        expression: "you_explain",
        text: "It's a suspension bridge. The ropes are thick, see? It's sturdy."
    },
    {
        speaker: "her",
        expression: "her_trust_scared",
        text: "It's swaying. Sri, I don't know if I can do this."
    },
    {
        speaker: "you",
        expression: "you_soft_smile", // or you_smile
        text: "Don't look down. Just look at me. I won't let you fall."
    },
    {
        speaker: "system",
        text: "Hold the button to steady the bridge."
    },
    // --- QUEST TRIGGER ---
    {
        action: "START_QUEST"
    },
    // --- SUCCESS ---
    {
        speaker: "her",
        expression: "her_trust", // Relief
        text: "Okay... okay. I'm moving."
    },
    {
        speaker: "you",
        expression: "you_front",
        text: "That's it. Step by step. You're doing great."
    },
    {
        speaker: "her",
        expression: "her_excited", // Or soft smile
        text: "We made it! My legs are shaking."
    },
    {
        speaker: "you",
        expression: "you_smile",
        text: "Adrenaline. It means you're alive. Ready for the final stop?"
    },
    {
        action: "END_SCENE"
    }
];