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
    title: "La Plantación de Limones",
    description: "Usa datos satelitales de NASA para tomar la mejor decisión sobre cuándo y cómo plantar limoneros",
    objectives: [
      "Analizar las condiciones ambientales actuales",
      "Evaluar la humedad del suelo y precipitaciones",
      "Elegir el método de plantación más adecuado",
    ],
    introDialogue: [
      {
        text: "¡Hola, agricultor! Soy API, tu abeja asistente conectada a los satélites de NASA. Estamos en primavera temprana aquí en Tucumán, Argentina, y es momento de plantar limoneros. Pero antes de meter las manos en la tierra, déjame mostrarte lo que los satélites nos dicen...",
        emotion: "happy",
        speaker: "bea",
      },
      {
        text: "Según los datos de NASA: la humedad del suelo está en 35%, tuvimos 50mm de lluvia el mes pasado, y las temperaturas oscilan entre 12°C y 22°C. Los limoneros necesitan suelo bien drenado pero con humedad constante. ¿Qué estrategia seguimos?",
        emotion: "neutral",
        speaker: "bea",
      },
    ],
    choices: [
      {
        id: "choice-plant-immediately",
        label: "Plantar Inmediatamente",
        description: "Plantar sin preparación adicional del suelo. Rápido pero arriesgado con 35% de humedad.",
        cost: 3000,
        effects: {
          money: -3000,
          productivity: -10,
          biodiversity: -5,
          beaHealth: -15,
          plotNdvi: { plotId: "plot-1", change: -0.05 },
        },
        feedback: {
          text: "¡Oh no! Sin preparación adecuada, los limoneros están sufriendo. El suelo seco (35% humedad) no es suficiente para que las raíces se establezcan bien. Muchos plantines se marchitaron. Los datos satelitales nos advertían sobre esto...",
          emotion: "sad",
          speaker: "bea",
        },
      },
      {
        id: "choice-wait-rain",
        label: "Esperar un Mes por Lluvia",
        description:
          "Esperar a que llueva naturalmente antes de plantar. Conservador pero puede perder la ventana óptima.",
        cost: 0,
        effects: {
          money: -1000,
          productivity: 5,
          biodiversity: 0,
          beaHealth: -5,
        },
        feedback: {
          text: "Hmm, esperamos un mes pero la lluvia fue irregular. Perdimos parte de la ventana óptima de plantación primaveral. Los limoneros crecerán, pero no aprovechamos al máximo la estación. A veces la paciencia excesiva también tiene su costo.",
          emotion: "worried",
          speaker: "bea",
        },
      },
      {
        id: "choice-intensive-irrigation",
        label: "Riego Intensivo 2 Días",
        description: "Inundar el terreno durante 2 días antes de plantar. Efectivo pero desperdicia agua y energía.",
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
          text: "Los limoneros están creciendo bien, pero... ¡usamos mucha agua! El riego intensivo funcionó, pero no fue eficiente. Además, el exceso de agua lavó algunos nutrientes del suelo. Hay una forma más inteligente de hacer esto.",
          emotion: "neutral",
          speaker: "bea",
        },
      },
      {
        id: "choice-drip-irrigation",
        label: "Sistema de Riego por Goteo",
        description:
          "Instalar riego por goteo y plantar en los próximos días. Inversión inicial mayor pero óptimo a largo plazo.",
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
          text: "¡Excelente decisión! El riego por goteo mantiene la humedad constante y óptima para los limoneros. Los datos satelitales muestran que el NDVI está mejorando consistentemente. Esta es la agricultura de precisión: usar tecnología y datos para tomar decisiones inteligentes. ¡Los limoneros te lo agradecerán con una cosecha abundante!",
          emotion: "happy",
          speaker: "bea",
        },
      },
    ],
    completionDialogue: [
      {
        text: "Recuerda: los satélites de NASA nos dan información valiosa sobre temperatura, humedad y salud de las plantas. Usar estos datos convierte la agricultura en ciencia, no en adivinanza. ¡Sigamos aprendiendo juntos!",
        emotion: "happy",
        speaker: "bea",
      },
    ],
    completed: false,
  },
  "mission-2": {
    id: "mission-2",
    title: "La Primera Siembra",
    description: "Toma tu primera decisión de cultivo y labranza",
    objectives: ["Elegir un tipo de cultivo", "Seleccionar método de labranza", "Observar los resultados"],
    introDialogue: [
      {
        text: "Ahora viene tu primera gran decisión. Tenemos dos opciones para este lote: soja, que es rentable pero agota el suelo, o una rotación con legumbres que lo enriquece. Y sobre la labranza... ¿aramos profundo y rápido, o usamos siembra directa que protege los microorganismos del suelo? Recuerda: cada elección tiene un eco. Yo sentiré ese eco en mis alas. ¿Qué camino elegimos juntos?",
        emotion: "neutral",
        speaker: "bea",
      },
    ],
    choices: [
      {
        id: "choice-intensive",
        label: "Soja + Labranza Convencional",
        description: "Máxima rentabilidad inmediata, pero agota el suelo y afecta la biodiversidad",
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
        label: "Rotación de Cultivos + Siembra Directa",
        description: "Rentabilidad moderada, enriquece el suelo y mejora el ecosistema",
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
        text: "Interesante elección... Veremos cómo responde la tierra en las próximas semanas. Recuerda, la agricultura sostenible es un camino de paciencia y observación. Ahora, tengo una propuesta especial para ti.",
        emotion: "neutral",
        speaker: "bea",
      },
    ],
    completed: false,
  },
  "mission-3": {
    id: "mission-3",
    title: "El Jardín de Bea",
    description: "Crea un refugio de biodiversidad plantando flores silvestres",
    objectives: ["Plantar flores silvestres nativas", "Crear una franja de biodiversidad", "Desbloquear polinización"],
    introDialogue: [
      {
        text: "¡Tengo una idea maravillosa! ¿Ves ese borde del campo? Podríamos plantar flores silvestres nativas: caléndulas, lavanda, girasoles pequeños. No solo me darán néctar a mí y a mis hermanas, sino que atraerán insectos beneficiosos que protegerán tus cultivos de las plagas. Es como crear un ejército de guardianes naturales. ¿Invertimos un poco en este refugio de vida? Te prometo que la tierra te lo devolverá multiplicado.",
        emotion: "happy",
        speaker: "bea",
      },
    ],
    choices: [
      {
        id: "choice-wildflowers",
        label: "Plantar Jardín de Flores Silvestres",
        description: "Invierte en biodiversidad para mejorar la polinización y control natural de plagas",
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
        label: "Posponer por Ahora",
        description: "Mantener el presupuesto actual sin cambios",
        cost: 0,
        effects: {
          beaHealth: -5,
        },
      },
    ],
    completionDialogue: [
      {
        text: "¡Gracias por confiar en la naturaleza! Este jardín será un oasis de vida. Pronto verás cómo las abejas, mariposas y otros insectos beneficiosos transforman tu granja. La biodiversidad es la mejor inversión que un agricultor puede hacer.",
        emotion: "happy",
        speaker: "bea",
      },
    ],
    completed: false,
  },
}
