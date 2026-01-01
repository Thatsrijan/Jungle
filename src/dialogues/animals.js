export default [
    {
      speaker: "her",
      expression: "her_front",
      text: "Did you see that?"
    },
    {
      speaker: "you",
      expression: "you_front",
      text: "Yeah. They’re watching us."
    },
    {
      speaker: "her",
      expression: "her_soft_smile",
      text: "It doesn’t feel scary… just curious."
    },
    {
      speaker: "her",
      expression: "her_think",
      text: "Do you think they trust us?",
      options: [
        {
          choice: "Only if we stay calm",
          response: [
            {
              speaker: "you",
              expression: "you_explain",
              text: "Fear makes noise. Calm feels safe."
            },
            {
              speaker: "her",
              expression: "her_trust",
              text: "Then I’ll stay calm."
            }
          ]
        },
        {
          choice: "They’re just like us",
          response: [
            {
              speaker: "you",
              expression: "you_smile",
              text: "Trying to understand what’s unfamiliar."
            },
            {
              speaker: "her",
              expression: "her_soft_smile",
              text: "That makes sense."
            }
          ]
        }
      ]
    },
    {
        action: "END_SCENE"
    }
  ];