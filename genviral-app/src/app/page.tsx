'use client';

import { InstagramIcon, TwitterIcon, YoutubeIcon } from "@/components/Icons";
import { GeneratorForm } from "@/components/GeneratorForm";
import { AnimatedWrapper } from "@/components/AnimatedWrapper";
import { AnimatedButton } from "@/components/AnimatedButton";
import { AnimatedCard } from "@/components/AnimatedCard";
import { EmblaCarousel } from '../components/EmblaCarousel'
import { smoothScrollTo } from "@/utils/smoothScroll";
import '../components/embla.css'
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { HeaderCreditsDisplay } from '@/components/CreditsDisplay';
import { PricingModal } from '@/components/PricingModal';
import Link from 'next/link';

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    smoothScrollTo(targetId);
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card/80 backdrop-blur-sm border-b border-border shadow-sm sticky top-0 z-50">
        <a className="flex items-center justify-center" href="#">
          <span className="text-2xl font-bold text-primary">GenViral</span>
        </a>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            onClick={(e) => handleNavClick(e, 'features')}
          >
            Features
          </a>
          <a
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            onClick={(e) => handleNavClick(e, 'examples')}
          >
            Examples
          </a>
          <a
            className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
            onClick={() => setIsPricingModalOpen(true)}
          >
            Pricing
          </a>

          {user && (
            <>
              <HeaderCreditsDisplay />
              <Link href="/dashboard">
                <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                  Dashboard
                </span>
              </Link>
            </>
          )}

          <AnimatedButton
            variant={user ? "secondary" : "primary"}
            onClick={handleAuthAction}
            disabled={loading}
          >
            {loading ? "Loading..." : user ? "Sign Out" : "Sign In"}
          </AnimatedButton>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <GeneratorForm />

        {/* Social Proof / Examples Section */}
        <section id="examples" className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-br from-secondary/50 via-background to-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="space-y-4 text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                See What AI Can Create
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
                    From social media trends to professional presentations, see the power of AI video generation.
                </p>
            </div>
            <EmblaCarousel />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <AnimatedWrapper>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  A Simple, Intuitive Process
                </h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to be user-friendly and efficient. Follow these simple steps to generate your
                  viral video.
                </p>
              </div>
            </AnimatedWrapper>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3 md:gap-12">
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.1 },
                  },
                }}>
                <AnimatedCard className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">1</div>
                    <h3 className="text-xl font-bold">Enter Your Idea</h3>
                    <p className="text-muted-foreground">Start with a simple topic or sentence.</p>
                  </div>
                </AnimatedCard>
              </AnimatedWrapper>
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 },
                  },
                }}>
                <AnimatedCard className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">2</div>
                    <h3 className="text-xl font-bold">AI Generation</h3>
                    <p className="text-muted-foreground">Our AI writes the script, finds footage, and adds a voiceover.</p>
                  </div>
                </AnimatedCard>
              </AnimatedWrapper>
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.3 },
                  },
                }}>
                <AnimatedCard className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">3</div>
                    <h3 className="text-xl font-bold">Download & Share</h3>
                    <p className="text-muted-foreground">Get your video in minutes and post it everywhere.</p>
                  </div>
                </AnimatedCard>
              </AnimatedWrapper>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-b from-background to-muted/20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <AnimatedWrapper>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Go Viral
                </h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform provides all the tools you need to create engaging, shareable content that
                  resonates with your audience.
                </p>
              </div>
            </AnimatedWrapper>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.7, ease: 'easeInOut' },
                  },
                }}>
                <div className="flex flex-col justify-center space-y-4">
                  <ul className="grid gap-6">
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">AI Script Writing</h3>
                        <p className="text-muted-foreground">
                          Our advanced AI analyzes trending topics and creates compelling scripts tailored to your niche.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">Automatic Video Editing</h3>
                        <p className="text-muted-foreground">
                          No editing skills required. Our AI handles cuts, transitions, and effects automatically.
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="grid gap-1">
                        <h3 className="text-xl font-bold">Voice Generation</h3>
                        <p className="text-muted-foreground">
                          Choose from multiple AI voices or clone your own for consistent branding across all videos.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </AnimatedWrapper>
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.7, ease: 'easeInOut', delay: 0.2 },
                  },
                }}>
                <EmblaCarousel />
              </AnimatedWrapper>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-br from-muted/30 via-background to-secondary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/5 to-transparent"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <AnimatedWrapper>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Social Media
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Optimized for Every Platform
                </h2>
                <p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create videos perfectly sized and formatted for Instagram, TikTok, YouTube, and more.
                </p>
              </div>
            </AnimatedWrapper>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.1 },
                  },
                }}>
                <AnimatedCard className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <InstagramIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Instagram</h3>
                    <p className="text-muted-foreground">Perfect square and story formats for maximum engagement.</p>
                  </div>
                </AnimatedCard>
              </AnimatedWrapper>
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 },
                  },
                }}>
                <AnimatedCard className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500">
                      <TwitterIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">Twitter</h3>
                    <p className="text-muted-foreground">Optimized for Twitter&apos;s video requirements and trending topics.</p>
                  </div>
                </AnimatedCard>
              </AnimatedWrapper>
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.3 },
                  },
                }}>
                <AnimatedCard className="p-6 bg-card rounded-lg border border-border">
                  <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
                      <YoutubeIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">YouTube</h3>
                    <p className="text-muted-foreground">Long-form and short-form content optimized for YouTube&apos;s algorithm.</p>
                  </div>
                </AnimatedCard>
              </AnimatedWrapper>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-gradient-to-t from-secondary via-secondary/80 to-background border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Genviral</h3>
            <p className="text-sm text-muted-foreground">AI-Powered Viral Video Generation</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Links</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Home</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Features</a></li>
              <li><a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Social</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <InstagramIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <YoutubeIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-8 text-center text-xs text-muted-foreground">
          © 2024 Genviral. All rights reserved.
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </div>
  );
}
