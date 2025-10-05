export interface ProvinceData {
  id: string
  name: string
  capital: string
  position: { lat: number; lng: number }
  description: string
  climate: {
    type: string
    description: string
    avgTemp: string
    rainfall: string
    season: string
  }
  soil: {
    texture: string
    fertility: string
    drainage: string
  }
  water: {
    irrigation: string
    sources: string
    rainfall: string
  }
  altitude: {
    elevation: string
    terrain: string
  }
  risks: string[]
  infrastructure: {
    roads: string
    markets: string
    storage: string
  }
  environmental: {
    protectedAreas: string
    regulations: string
    erosion: string
  }
}

export const provincesData: ProvinceData[] = [
  {
    id: "tucuman",
    name: "Tucumán",
    capital: "San Miguel de Tucumán",
    position: { lat: -26.82, lng: -65.22 },
    description:
      "Ubicada en el noroeste argentino, cuenta con un clima subtropical con estación seca, caracterizado por veranos cálidos y húmedos e inviernos suaves. Estas condiciones favorecen el desarrollo de cultivos industriales, frutales y hortícolas, convirtiendo a la provincia en una de las regiones agrícolas más productivas del país.",
    climate: {
      type: "Subtropical con estación seca",
      description: "Veranos cálidos y húmedos, inviernos suaves",
      avgTemp: "19°C anual (verano 26°C, invierno 12°C)",
      rainfall: "900-1200 mm anuales",
      season: "Lluvias concentradas en verano (octubre-marzo)",
    },
    soil: {
      texture: "Franco-arcilloso a franco-arenoso",
      fertility: "Alta fertilidad natural, ricos en materia orgánica",
      drainage: "Bueno a moderado, requiere manejo en zonas bajas",
    },
    water: {
      irrigation: "Sistema de riego disponible en zonas productivas",
      sources: "Ríos Salí-Dulce, embalses y acuíferos subterráneos",
      rainfall: "Suficiente en verano, riego complementario en invierno",
    },
    altitude: {
      elevation: "400-800 metros sobre el nivel del mar",
      terrain: "Valles, llanuras y laderas de montaña",
    },
    risks: [
      "Heladas tardías (mayo-junio) en zonas altas",
      "Granizo en primavera-verano",
      "Sequías ocasionales en invierno",
      "Exceso de humedad en verano",
    ],
    infrastructure: {
      roads: "Excelente conectividad con Ruta Nacional 9 y 38",
      markets: "Acceso a mercados locales, nacionales e internacionales",
      storage: "Infraestructura de almacenamiento y procesamiento desarrollada",
    },
    environmental: {
      protectedAreas: "Parque Nacional Campo de los Alisos, Reserva Provincial La Florida",
      regulations: "Normativas de uso sustentable del suelo y agua",
      erosion: "Riesgo moderado en laderas, requiere prácticas de conservación",
    },
  },
  {
    id: "mendoza",
    name: "Mendoza",
    capital: "Mendoza",
    position: { lat: -32.89, lng: -68.84 },
    description:
      "Provincia vitivinícola por excelencia, con clima árido y sistema de riego artificial. Ideal para cultivos de vid, olivos y frutales de carozo.",
    climate: {
      type: "Árido continental",
      description: "Veranos calurosos y secos, inviernos fríos",
      avgTemp: "17°C anual (verano 25°C, invierno 8°C)",
      rainfall: "200-300 mm anuales",
      season: "Escasas lluvias, concentradas en verano",
    },
    soil: {
      texture: "Arenoso a franco-arenoso",
      fertility: "Media, requiere fertilización",
      drainage: "Excelente drenaje natural",
    },
    water: {
      irrigation: "Sistema de riego por canales esencial",
      sources: "Deshielo andino, ríos Mendoza, Tunuyán, Diamante",
      rainfall: "Insuficiente, riego obligatorio",
    },
    altitude: {
      elevation: "600-1200 metros sobre el nivel del mar",
      terrain: "Piedemonte, valles irrigados",
    },
    risks: ["Heladas primaverales", "Granizo devastador", "Sequías por escasez de nieve", "Vientos zonda intensos"],
    infrastructure: {
      roads: "Red vial desarrollada, Corredor Bioceánico",
      markets: "Exportación internacional consolidada",
      storage: "Bodegas y cámaras frigoríficas modernas",
    },
    environmental: {
      protectedAreas: "Parque Provincial Aconcagua, Reserva Ñacuñán",
      regulations: "Ley de ordenamiento territorial y uso del agua",
      erosion: "Riesgo bajo con riego tecnificado",
    },
  },
  {
    id: "corrientes",
    name: "Corrientes",
    capital: "Corrientes",
    position: { lat: -27.48, lng: -58.82 },
    description:
      "Provincia del noreste con clima subtropical húmedo, ideal para arroz, yerba mate, té y ganadería. Abundancia de recursos hídricos.",
    climate: {
      type: "Subtropical húmedo",
      description: "Veranos muy cálidos y húmedos, inviernos templados",
      avgTemp: "21°C anual (verano 27°C, invierno 15°C)",
      rainfall: "1200-1500 mm anuales",
      season: "Lluvias bien distribuidas todo el año",
    },
    soil: {
      texture: "Arcilloso en zonas bajas, arenoso en lomadas",
      fertility: "Media a alta, ácidos en algunas zonas",
      drainage: "Variable, anegamiento en zonas bajas",
    },
    water: {
      irrigation: "Abundante agua superficial y subterránea",
      sources: "Ríos Paraná, Uruguay, esteros y lagunas",
      rainfall: "Suficiente, riego complementario para arroz",
    },
    altitude: {
      elevation: "50-150 metros sobre el nivel del mar",
      terrain: "Llanuras, esteros, lomadas",
    },
    risks: [
      "Inundaciones periódicas",
      "Exceso de humedad",
      "Heladas leves ocasionales",
      "Tormentas eléctricas intensas",
    ],
    infrastructure: {
      roads: "Rutas Nacionales 12 y 14, puentes internacionales",
      markets: "Acceso a mercados regionales y MERCOSUR",
      storage: "Infraestructura en desarrollo para granos y yerba",
    },
    environmental: {
      protectedAreas: "Parque Nacional Mburucuyá, Esteros del Iberá",
      regulations: "Protección de humedales y biodiversidad",
      erosion: "Riesgo bajo, suelos estables",
    },
  },
]

export function getProvinceById(id: string): ProvinceData | undefined {
  return provincesData.find((p) => p.id === id)
}
