"use client"
import { useEffect, useState } from "react"
import "./landing/landing.css"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"

const fontImages = [
  { src: "/fonts/font1.png", alt: "Font Sample 1" },
  { src: "/fonts/font2.png", alt: "Font Sample 2" },
  { src: "/fonts/font3.jpg", alt: "Font Sample 3" },
  { src: "/fonts/font4.png", alt: "Font Sample 4" },
  { src: "/fonts/font5.png", alt: "Font Sample 5" },
  { src: "/fonts/font6.png", alt: "Font Sample 6" },
  { src: "/fonts/font7.png", alt: "Font Sample 7" },
  { src: "/fonts/font8.jpg", alt: "Font Sample 8" },
  { src: "/fonts/font9.png", alt: "Font Sample 9" },
  { src: "/fonts/font10.png", alt: "Font Sample 10" },
  { src: "/fonts/font11.jpg", alt: "Font Sample 11" },
  { src: "/fonts/font12.jpg", alt: "Font Sample 12" },
]

const phrases = [
  "Celebrate the beauty of Malayalam!",
  "Express your thoughts in script.",
  "Let Malayalam flow like ink.",
  "Art meets alphabet.",
]

function AutoScrollingGallery() {
  const duplicatedImages = [...fontImages, ...fontImages] 
  const imageWidth = 192 
  const gap = 24 
  const totalWidth = (imageWidth + gap) * fontImages.length

  return (
    <div className="w-screen overflow-hidden py-4">
      <motion.div
        className="flex gap-6"
        animate={{ x: [0, -totalWidth] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30,
        }}
        style={{ width: `${totalWidth * 2}px` }}
      >
        {duplicatedImages.map((img, index) => (
          <div
            key={index}
            className="w-48 aspect-square shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-white"
          >
            <Image
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [displayedText, setDisplayedText] = useState("")
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex]
    const typingSpeed = isDeleting ? 40 : 80

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayedText(currentPhrase.substring(0, charIndex + 1))
        setCharIndex((prev) => prev + 1)
        if (charIndex === currentPhrase.length) setIsDeleting(true)
      } else {
        setDisplayedText(currentPhrase.substring(0, charIndex - 1))
        setCharIndex((prev) => prev - 1)
        if (charIndex === 0) {
          setIsDeleting(false)
          setPhraseIndex((prev) => (prev + 1) % phrases.length)
        }
      }
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg.jpeg')" }}
    >
      <header className="flex items-start justify-start p-4 absolute top-0 left-0 z-20">
  <div className="max-w-[200px] w-full">
    <Image
      src="/logo-bg.png"
      alt="Aksharam Logo"
      className="w-full h-auto object-contain"
    />
  </div>
</header>

      <main className="container mx-auto px-4 pt-44 pb-2 text-center">

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.h1
            className="text-4xl md:text-6xl font-instrument text-amber-200 font-bold leading-tight min-h-[5rem]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {displayedText}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-amber-200 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Create artistic calligraphy from your words with just a click!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/generate")}
              className="bg-amber-200 text-amber-900 font-semibold text-lg px-8 py-3 rounded-full shadow-md transition-colors duration-300 hover:bg-amber-200 hover:text-amber-800"
            >
              GET STARTED
            </motion.button>
          </motion.div>
        </div>

        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-10">
          <AutoScrollingGallery />
        </div>
      </main>
    </div>
  )
}
