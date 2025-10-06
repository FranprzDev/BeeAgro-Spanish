import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#557b35] text-white py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
        <p className="text-sm text-[#fff] ">
          © 2025 BEEagro - Project created for{" "}
          <a
            href="https://www.spaceappschallenge.org/2025/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-[#fff]  hover:text-[#a6d672] transition-colors"
          >
            NASA Space Apps Challenge 2025
          </a>
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <Link href="/about-us" className="text-[#fff] hover:text-[#a6d672] transition-colors underline">
            About Us
          </Link>
        </div>
      </div>
    </footer>
  )
}
