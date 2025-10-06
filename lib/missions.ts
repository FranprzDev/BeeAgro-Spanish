export type MissionId = "mission-1" | "mission-2" | "mission-3"
export type Emotion = "neutral" | "happy" | "worried" | "sad"

export interface DialogueStep {
  text: string
  emotion: Emotion
  speaker: "bea"
}

export interface MissionChoice {
  id: string
  label: string
  description: string
  cost: number
  effects: {
    money?: number
    productivity?: number
    biodiversity?: number
    beaHealth?: number
    plotNdvi?: { plotId: string; change: number }
    plotHumidity?: { plotId: string; change: number }
  }
  feedback?: DialogueStep
}

export interface Mission {
  id: MissionId
  title: string
  description: string
  introDialogue: DialogueStep[]
  choices?: MissionChoice[]
  completionDialogue?: DialogueStep[]
  objectives: string[]
  completed: boolean
}

export const MISSIONS: Record<MissionId, Mission> = {
  "mission-1": {
    id: "mission-1",
    title: "Lemon Planting",
    description: "Use NASA satellite data to make the best decision about when and how to plant lemon trees",
    objectives: [
      "Analyze current environmental conditions",
      "Evaluate soil moisture and precipitation",
      "Choose the most suitable planting method",
    ],
    introDialogue: [
      {
        text: "Hello, farmer! I'm API, your bee assistant connected to NASA satellites. We're in early spring here in Tucumán, Argentina, and it's time to plant lemon trees. But before getting our hands dirty, let me show you what the satellites are telling us...",
        emotion: "happy",
        speaker: "bea",
      },
      {
        text: "According to NASA data: soil moisture is at 35%, we had 50mm of rain last month, and temperatures range between 12°C and 22°C. Lemon trees need well-drained soil but with constant moisture. What strategy should we follow?",
        emotion: "neutral",
        speaker: "bea",
      },
    ],
    choices: [
      {
        id: "choice-plant-immediately",
        label: "Plant Immediately",
        description: "Plant without additional soil preparation. Fast but risky with 35% moisture.",
        cost: 3000,
        effects: {
          money: -3000,
          productivity: -10,
          biodiversity: -5,
          beaHealth: -15,
          plotNdvi: { plotId: "plot-1", change: -0.05 },
        },
        feedback: {
          text: "Oh no! Without proper preparation, the lemon trees are suffering. The dry soil (35% moisture) isn't enough for the roots to establish well. Many seedlings withered. The satellite data was warning us about this...",
          emotion: "sad",
          speaker: "bea",
        },
      },
      {
        id: "choice-wait-rain",
        label: "Wait a Month for Rain",
        description: "Wait for natural rain before planting. Conservative but may miss the optimal window.",
        cost: 0,
        effects: {
          money: -1000,
          productivity: 5,
          biodiversity: 0,
          beaHealth: -5,
        },
        feedback: {
          text: "Hmm, we waited a month but the rain was irregular. We lost part of the optimal spring planting window. The lemon trees will grow, but we didn't make the most of the season. Sometimes excessive patience also has its cost.",
          emotion: "worried",
          speaker: "bea",
        },
      },
      {
        id: "choice-intensive-irrigation",
        label: "Intensive Irrigation 2 Days",
        description: "Flood the land for 2 days before planting. Effective but wastes water and energy.",
        cost: 5000,
        effects: {
          money: -5000,
          productivity: 10,
          biodiversity: -5,
          beaHealth: 5,
          plotNdvi: { plotId: "plot-1", change: 0.05 },
          plotHumidity: { plotId: "plot-1", change: 20 },
        },
        feedback: {
          text: "The lemon trees are growing well, but... we used a lot of water! Intensive irrigation worked, but it wasn't efficient. Also, excess water washed away some soil nutrients. There's a smarter way to do this.",
          emotion: "neutral",
          speaker: "bea",
        },
      },
      {
        id: "choice-drip-irrigation",
        label: "Drip Irrigation System",
        description:
          "Install drip irrigation and plant in the next few days. Higher initial investment but optimal long-term.",
        cost: 8000,
        effects: {
          money: -8000,
          productivity: 25,
          biodiversity: 10,
          beaHealth: 20,
          plotNdvi: { plotId: "plot-1", change: 0.15 },
          plotHumidity: { plotId: "plot-1", change: 15 },
        },
        feedback: {
          text: "Excellent decision! Drip irrigation maintains constant and optimal moisture for lemon trees. Satellite data shows that NDVI is consistently improving. This is precision agriculture: using technology and data to make smart decisions. The lemon trees will thank you with an abundant harvest!",
          emotion: "happy",
          speaker: "bea",
        },
      },
    ],
    completionDialogue: [
      {
        text: "Remember: NASA satellites give us valuable information about temperature, moisture, and plant health. Using this data turns agriculture into science, not guesswork. Let's keep learning together!",
        emotion: "happy",
        speaker: "bea",
      },
    ],
    completed: false,
  },
  "mission-2": {
    id: "mission-2",
    title: "The First Planting",
    description: "Make your first crop and tillage decision",
    objectives: ["Choose a crop type", "Select tillage method", "Observe the results"],
    introDialogue: [
      {
        text: "Now comes your first big decision. We have two options for this plot: soybeans, which are profitable but deplete the soil, or a rotation with legumes that enriches it. And about tillage... do we plow deep and fast, or use no-till that protects soil microorganisms? Remember: every choice has an echo. I'll feel that echo in my wings. What path do we choose together?",
        emotion: "neutral",
        speaker: "bea",
      },
    ],
    choices: [
      {
        id: "choice-intensive",
        label: "Soy + Conventional Tillage",
        description: "Maximum immediate profitability, but depletes soil and affects biodiversity",
        cost: 5000,
        effects: {
          money: 15000,
          productivity: 20,
          biodiversity: -15,
          beaHealth: -20,
          plotNdvi: { plotId: "plot-1", change: -0.15 },
        },
      },
      {
        id: "choice-sustainable",
        label: "Crop Rotation + No-Till",
        description: "Moderate profitability, enriches soil and improves ecosystem",
        cost: 7000,
        effects: {
          money: 10000,
          productivity: 10,
          biodiversity: 15,
          beaHealth: 15,
          plotNdvi: { plotId: "plot-1", change: 0.1 },
        },
      },
    ],
    completionDialogue: [
      {
        text: "Interesting choice... We'll see how the land responds in the coming weeks. Remember, sustainable agriculture is a path of patience and observation. Now, I have a special proposal for you.",
        emotion: "neutral",
        speaker: "bea",
      },
    ],
    completed: false,
  },
  "mission-3": {
    id: "mission-3",
    title: "Bea's Garden",
    description: "Create a biodiversity refuge by planting wildflowers",
    objectives: ["Plant native wildflowers", "Create a biodiversity strip", "Unlock pollination"],
    introDialogue: [
      {
        text: "I have a wonderful idea! See that edge of the field? We could plant native wildflowers: marigolds, lavender, small sunflowers. Not only will they give nectar to me and my sisters, but they'll attract beneficial insects that will protect your crops from pests. It's like creating an army of natural guardians. Shall we invest a little in this refuge of life? I promise the land will return it multiplied.",
        emotion: "happy",
        speaker: "bea",
      },
    ],
    choices: [
      {
        id: "choice-wildflowers",
        label: "Plant Wildflower Garden",
        description: "Invest in biodiversity to improve pollination and natural pest control",
        cost: 3000,
        effects: {
          money: -3000,
          biodiversity: 25,
          beaHealth: 20,
          productivity: 15,
        },
      },
      {
        id: "choice-skip",
        label: "Postpone for Now",
        description: "Keep current budget without changes",
        cost: 0,
        effects: {
          beaHealth: -5,
        },
      },
    ],
    completionDialogue: [
      {
        text: "Thank you for trusting nature! This garden will be an oasis of life. Soon you'll see how bees, butterflies, and other beneficial insects transform your farm. Biodiversity is the best investment a farmer can make.",
        emotion: "happy",
        speaker: "bea",
      },
    ],
    completed: false,
  },
}
