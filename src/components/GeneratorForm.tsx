'use client';

import { useState } from 'react';
import { AnimatedWrapper } from './AnimatedWrapper';
import { AnimatedButton } from './AnimatedButton';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { PricingModal } from './PricingModal';
import { CreditsDisplay } from './CreditsDisplay';

export function GeneratorForm() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [script, setScript] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [error, setError] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  const { user, refreshCredits } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setVideoUrl('');
    setScript('');
    setVideoPrompt('');
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          // Insufficient credits - show pricing modal
          setIsPricingModalOpen(true);
          setError(errorData.error || 'Insufficient credits');
          return;
        }
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const data = await response.json();

      if (data.success) {
        setVideoUrl(data.videoUrl);
        setScript(data.script);
        setVideoPrompt(data.videoPrompt);
        // Refresh credits after successful generation
        await refreshCredits();
      } else {
        throw new Error(data.error || 'Failed to generate video');
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="hero" className="w-full py-20 md:py-32 lg:py-40 xl:py-56 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <AnimatedWrapper>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Generate Viral Videos with a Single Click
                </h1>
              </AnimatedWrapper>
              <AnimatedWrapper
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: 'easeInOut', delay: 0.2 },
                  },
                }}>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  No editing skills required. Let our AI create engaging videos for your social media.
                </p>
              </AnimatedWrapper>
            </div>
            <AnimatedWrapper
              className="w-full max-w-lg"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: 'easeInOut', delay: 0.4 },
                },
              }}>
              <form className="space-y-4" onSubmit={handleSubmit}>
                {user && (
                  <div className="mb-6">
                    <CreditsDisplay showDetails={false} />
                  </div>
                )}

                <textarea
                  placeholder="Enter a topic or a short idea..."
                  className="w-full p-3 rounded-md bg-card text-foreground border border-border focus:ring-2 focus:ring-primary"
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={loading}
                />

                <AnimatedButton
                  type="submit"
                  className="w-full font-bold py-3 px-4"
                  variant="primary"
                  loading={loading}
                  disabled={loading || !topic.trim()}
                >
                  {!user ? 'Sign In to Generate' : loading ? 'Generating...' : 'Generate Video (1 Credit)'}
                </AnimatedButton>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
                    {error}
                    {error.includes('Insufficient credits') && (
                      <div className="mt-2">
                        <AnimatedButton
                          variant="primary"
                          size="sm"
                          onClick={() => setIsPricingModalOpen(true)}
                        >
                          Buy More Credits
                        </AnimatedButton>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </AnimatedWrapper>
          </div>
        </div>
      </section>

      {(videoPrompt || videoUrl) && (
        <section id="video-generation-result" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-12">
              Video Generation Results
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">

              {/* Left Column - Video Prompt */}
              {videoPrompt && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-semibold">Video Generation Prompt</h3>
                  </div>
                  <div className="p-6 bg-background rounded-lg border border-border h-fit">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full">
                        AI Video Prompt
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {videoPrompt}
                    </p>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>This prompt is used to generate the video using AI. The more detailed and specific the prompt, the better the video quality.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column - Generated Video */}
              {videoUrl && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-semibold">Generated Video</h3>
                  </div>
                  <div className="bg-background rounded-lg border border-border p-4">
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      src={videoUrl}
                      className="w-full rounded-lg"
                      poster="/placeholder-video-thumbnail.jpg"
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>🎬 Your AI-generated video is ready! You can download, share, or use it for your content creation.</p>
                      <div className="flex gap-4 mt-2">
                        <a
                          href={videoUrl}
                          download
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <span>📥</span> Download Video
                        </a>
                        <button
                          onClick={() => navigator.clipboard.writeText(window.location.origin + videoUrl)}
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <span>📋</span> Copy Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {script && (
        <section id="script-result" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl mb-8">
              Generated Script
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="p-6 bg-background rounded-lg border border-border">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                  {script}
                </pre>
              </div>
            </div>
          </div>
        </section>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
      />
    </>
  );
}