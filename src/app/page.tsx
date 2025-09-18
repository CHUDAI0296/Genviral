'use client';

import { GeneratorForm } from '@/components/GeneratorForm';
import { AnimatedWrapper } from '@/components/AnimatedWrapper';
import { AnimatedCard } from '@/components/AnimatedCard';
import { AnimatedButton } from '@/components/AnimatedButton';
import { AuthProvider } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: "AI-Powered Script Generation",
      description: "Generate engaging video scripts with advanced AI technology",
      icon: "🤖"
    },
    {
      title: "One-Click Video Creation",
      description: "Transform your ideas into professional videos with a single click",
      icon: "🎬"
    },
    {
      title: "Social Media Ready",
      description: "Create videos optimized for all major social media platforms",
      icon: "📱"
    },
    {
      title: "High-Quality Output",
      description: "Generate stunning videos with professional quality",
      icon: "✨"
    }
  ];

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

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        {/* Navigation */}
        <nav className="w-full py-4 px-6 bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">
              Genviral
            </div>
            <div className="flex gap-4">
              <Link href="/pricing">
                <AnimatedButton variant="secondary">Pricing</AnimatedButton>
              </Link>
              <Link href="/dashboard">
                <AnimatedButton variant="primary">Dashboard</AnimatedButton>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section with Generator Form */}
        <GeneratorForm />

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedWrapper>
              <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
                Why Choose Genviral?
              </h2>
            </AnimatedWrapper>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <AnimatedCard
                  key={index}
                  className="p-6 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-20 md:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedWrapper>
              <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
                How It Works
              </h2>
            </AnimatedWrapper>
            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              {[
                {
                  step: "1",
                  title: "Enter Your Topic",
                  description: "Simply type in your video topic or idea"
                },
                {
                  step: "2",
                  title: "AI Magic",
                  description: "Our AI generates script and video content"
                },
                {
                  step: "3",
                  title: "Download & Share",
                  description: "Get your viral video ready for social media"
                }
              ].map((item, index) => (
                <AnimatedCard key={index} className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
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

        {/* CTA Section */}
        <section id="cta" className="w-full py-20 md:py-32 bg-primary">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <AnimatedWrapper>
              <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl mb-6">
                Ready to Go Viral?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already generating viral videos with AI
              </p>
              <Link href="/#hero">
                <AnimatedButton variant="secondary" className="text-lg px-8 py-3">
                  Start Creating Now
                </AnimatedButton>
              </Link>
            </AnimatedWrapper>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-12 bg-background border-t border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Genviral</h3>
                <p className="text-muted-foreground text-sm">
                  Create viral videos with AI-powered technology
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/#features" className="hover:text-foreground">Features</Link></li>
                  <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                  <li><Link href="/#how-it-works" className="hover:text-foreground">How it Works</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                  <li><a href="#" className="hover:text-foreground">Status</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              © 2024 Genviral. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}