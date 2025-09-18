'use client';

import { GeneratorForm } from '@/components/GeneratorForm';
import { AnimatedWrapper } from '@/components/AnimatedWrapper';
import { AnimatedCard } from '@/components/AnimatedCard';
import { AnimatedButton } from '@/components/AnimatedButton';
import { AuthProvider } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 动态导入非关键组件以减少初始包大小
const LazyTestimonials = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
  ssr: false
});

const LazyFooter = dynamic(() => import('@/components/FooterSection'), {
  loading: () => <div className="h-64 bg-gray-50" />,
  ssr: true
});

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
        <LazyTestimonials />

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
        <LazyFooter />
      </div>
    </AuthProvider>
  );
}