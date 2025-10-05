import { Card } from "@/components/ui/card"
import { BeaCharacter } from "@/components/bea-character"
import Link from "next/link"
import Image from "next/image"

const teamMembers = [
  {
    name: "Thiago Kuperman",
    linkedin: "https://www.linkedin.com/in/thiago-kuperman/",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Thiago-Uuj2BQnJvpnMpetuxHAjH73E1aOJ51.png",
  },
  {
    name: "Manuel Parada",
    linkedin: "https://www.linkedin.com/in/manuel-parada-70a4b4328/",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Manu-5LapM0bhxrXF5imXJGzH3Y5QskMRDW.png",
  },
  {
    name: "Francisco Perez",
    linkedin: "https://www.linkedin.com/in/franprzdev/",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fran-RRVV7YwGamBkcvPuBYLu6hgN2SgV8R.png",
  },
  {
    name: "Nicolas Quinteros",
    linkedin: "https://www.linkedin.com/in/nicoquinteros/",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Nico-sQycSA9A6DnD6uYZs0jfBLutAEOA1c.png",
  },
  {
    name: "Fernanda Acuña",
    linkedin: "https://www.linkedin.com/in/fernanda-acu%C3%B1a-mardones-0ba7b01b7/",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fer-hxr9pbQEkaxXTm99MIc3CSnEd2q7Ms.png",
  },
]

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#b8e0f9] via-[#a6d672] to-[#f8e985] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <BeaCharacter health="healthy" isAnimating className="w-32 mx-auto" />
          </Link>
          <h1 className="font-serif text-5xl font-bold text-[#557b35] text-balance drop-shadow-sm">Sobre Nosotros</h1>
        </div>

        {/* Project Info */}
        <Card className="p-8 bg-[#f5f1e8] border-4 border-[#947355] shadow-2xl">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-3xl font-bold text-[#557b35]">BEEagro</h2>
              <p className="text-lg text-[#947355] leading-relaxed text-pretty max-w-3xl mx-auto">
                Este proyecto nació en el marco de la{" "}
                <a
                  href="https://www.spaceappschallenge.org/2025/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#557b35] hover:underline"
                >
                  NASA Space Apps Challenge 2025
                </a>
                , donde nuestro equipo BEEagro participa en la categoría{" "}
                <span className="font-semibold text-[#557b35]">
                  NASA Farm Navigators: Using NASA Data Exploration in Agriculture
                </span>
                .
              </p>
              <p className="text-[#947355] leading-relaxed text-pretty max-w-3xl mx-auto">
                Nuestro objetivo es utilizar datos satelitales de la NASA para crear una experiencia educativa e
                interactiva que ayude a los agricultores a tomar decisiones sostenibles, equilibrando la productividad
                con la conservación del ecosistema.
              </p>
            </div>
          </div>
        </Card>

        {/* Team Members */}
        <Card className="p-8 bg-[#f5f1e8] border-4 border-[#947355] shadow-2xl">
          <h2 className="font-serif text-3xl font-bold text-[#557b35] text-center mb-8">Nuestro Equipo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {teamMembers.map((member) => (
              <a
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-[#a6d672]/20 transition-all hover:scale-105 group"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#947355] group-hover:border-[#557b35] transition-colors">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <p className="text-center text-sm font-semibold text-[#557b35] group-hover:text-[#947355] transition-colors">
                  {member.name}
                </p>
              </a>
            ))}
          </div>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#a6d672] hover:bg-[#557b35] text-[#557b35] hover:text-white font-bold rounded-lg border-2 border-[#947355] transition-colors"
          >
            Volver al Juego
          </Link>
        </div>
      </div>
    </main>
  )
}
