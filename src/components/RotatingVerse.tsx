'use client'

import { useState, useEffect } from 'react'

const VERSES = [
  { text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.', ref: 'Jeremiah 29:11' },
  { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
  { text: 'Trust in the Lord with all your heart, and lean not on your own understanding; in all your ways acknowledge Him, and He shall direct your paths.', ref: 'Proverbs 3:5–6' },
  { text: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.', ref: 'John 3:16' },
  { text: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
  { text: 'Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go.', ref: 'Joshua 1:9' },
  { text: 'And we know that all things work together for good to those who love God, to those who are the called according to His purpose.', ref: 'Romans 8:28' },
  { text: 'For I am persuaded that neither death nor life, nor angels nor principalities nor powers, nor things present nor things to come, shall be able to separate us from the love of God which is in Christ Jesus our Lord.', ref: 'Romans 8:38–39' },
  { text: 'But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.', ref: 'Isaiah 40:31' },
  { text: 'The Lord bless you and keep you; the Lord make His face shine upon you, and be gracious to you; the Lord lift up His countenance upon you, and give you peace.', ref: 'Numbers 6:24–26' },
  { text: 'Come to Me, all you who labor and are heavy laden, and I will give you rest.', ref: 'Matthew 11:28' },
  { text: 'Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God.', ref: 'Philippians 4:6' },
  { text: 'For by grace you have been saved through faith, and that not of yourselves; it is the gift of God.', ref: 'Ephesians 2:8' },
  { text: 'Have I not commanded you? Be strong and of good courage; do not be afraid, nor be dismayed.', ref: 'Joshua 1:9' },
  { text: 'The joy of the Lord is your strength.', ref: 'Nehemiah 8:10' },
  { text: 'Delight yourself also in the Lord, and He shall give you the desires of your heart.', ref: 'Psalm 37:4' },
  { text: 'Create in me a clean heart, O God, and renew a steadfast spirit within me.', ref: 'Psalm 51:10' },
  { text: 'No weapon formed against you shall prosper, and every tongue which rises against you in judgment you shall condemn.', ref: 'Isaiah 54:17' },
  { text: 'For the Lord God is a sun and shield; the Lord will give grace and glory; no good thing will He withhold from those who walk uprightly.', ref: 'Psalm 84:11' },
  { text: 'I will praise You, for I am fearfully and wonderfully made; marvelous are Your works, and that my soul knows very well.', ref: 'Psalm 139:14' },
  { text: 'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.', ref: 'Matthew 7:7' },
  { text: 'But seek first the kingdom of God and His righteousness, and all these things shall be added to you.', ref: 'Matthew 6:33' },
  { text: 'Greater love has no one than this, than to lay down one\'s life for his friends.', ref: 'John 15:13' },
  { text: 'Jesus said to him, "I am the way, the truth, and the life. No one comes to the Father except through Me."', ref: 'John 14:6' },
  { text: 'This is the day the Lord has made; we will rejoice and be glad in it.', ref: 'Psalm 118:24' },
  { text: 'And my God shall supply all your need according to His riches in glory by Christ Jesus.', ref: 'Philippians 4:19' },
  { text: 'Now to Him who is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us.', ref: 'Ephesians 3:20' },
  { text: 'If My people who are called by My name will humble themselves, and pray and seek My face, and turn from their wicked ways, then I will hear from heaven, and will forgive their sin and heal their land.', ref: '2 Chronicles 7:14' },
  { text: 'For God has not given us a spirit of fear, but of power and of love and of a sound mind.', ref: '2 Timothy 1:7' },
  { text: 'The name of the Lord is a strong tower; the righteous run to it and are safe.', ref: 'Proverbs 18:10' },
]

function getVerseIndex(): number {
  // Changes every hour based on the current hour of the day combined with day
  const now = new Date()
  const seed = now.getFullYear() * 100000 + (now.getMonth() + 1) * 10000 + now.getDate() * 100 + now.getHours()
  return seed % VERSES.length
}

export default function RotatingVerse() {
  const [index, setIndex] = useState<number | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Set initial verse
    setIndex(getVerseIndex())

    // Calculate ms until next hour
    const now = new Date()
    const msUntilNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds()

    // Transition to next verse at the top of each hour
    const changeVerse = () => {
      setVisible(false)
      setTimeout(() => {
        setIndex(getVerseIndex())
        setVisible(true)
      }, 800)
    }

    const firstTimeout = setTimeout(() => {
      changeVerse()
      const interval = setInterval(changeVerse, 60 * 60 * 1000)
      return () => clearInterval(interval)
    }, msUntilNextHour)

    return () => clearTimeout(firstTimeout)
  }, [])

  if (index === null) return null

  const verse = VERSES[index]

  return (
    <div className="bg-primary-dark py-12 text-white text-center relative overflow-hidden">
      {/* Decorative blurred glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container-max relative z-10 max-w-3xl mx-auto px-6">
        {/* Large decorative quote mark */}
        <div
          className="transition-all duration-700 ease-in-out"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          <p className="text-5xl text-accent/40 font-heading leading-none mb-2 select-none">&ldquo;</p>
          <p className="text-lg md:text-2xl font-heading italic text-blue-100 leading-relaxed mb-5">
            {verse.text}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-accent/50" />
            <p className="text-accent font-semibold tracking-widest text-sm">— {verse.ref} (NKJV)</p>
            <div className="h-px w-10 bg-accent/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
