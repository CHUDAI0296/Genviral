'use client';

import { AnimatedWrapper } from '@/components/AnimatedWrapper';
import { AnimatedCard } from '@/components/AnimatedCard';
import Image from 'next/image';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content: "Genviral has revolutionized my content creation process. I can now generate viral videos in minutes!",
    avatar: "https://picsum.photos/100/100?random=1"
  },
  {
    name: "Mike Chen",
    role: "Marketing Manager",
    content: "The AI-generated videos have increased our engagement by 300%. Simply amazing!",
    avatar: "https://picsum.photos/100/100?random=2"
  },
  {
    name: "Emma Davis",
    role: "Social Media Influencer",
    content: "I love how easy it is to create professional-looking videos. Genviral is a game-changer!",
    avatar: "https://picsum.photos/100/100?random=3"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedWrapper>
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
            What Our Users Say
          </h2>
        </AnimatedWrapper>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-none w-80">
                <AnimatedCard className="p-6 h-full">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-4"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                </AnimatedCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}