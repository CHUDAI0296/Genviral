'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 2000, stopOnInteraction: false })])

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {[...Array(5).keys()].map((n) => (
            <div className="embla__slide relative group" key={n}>
                <div className="slide-content bg-gray-200 h-64 rounded-2xl overflow-hidden">
                    <Image src={`https://picsum.photos/seed/vid${n+1}/600/400`} alt={`Example video ${n+1}`} layout="fill" objectFit="cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                        <Image src="/play.svg" alt="Play" width={64} height={64} />
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}