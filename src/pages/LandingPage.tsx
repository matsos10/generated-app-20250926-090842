import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, Bot, Clapperboard, Sparkles } from 'lucide-react';
const features = [
  { icon: <Bot className="h-6 w-6 text-indigo-400" />, title: "AI-Powered Scripting", description: "Transform your ideas into compelling video scripts with our intelligent writing assistant." },
  { icon: <Sparkles className="h-6 w-6 text-amber-400" />, title: "Automated Visuals", description: "Automatically source high-quality, relevant background videos from a vast stock library." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>, title: "Realistic Voiceovers", description: "Choose from a wide range of natural-sounding AI voices to narrate your content." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 0 1 8-8V4a8 8 0 0 1 8 8Z"/><path d="M4 12a8 8 0 0 0 8 8v0a8 8 0 0 0 8-8Z"/><path d="M12 4v16"/></svg>, title: "Dynamic Captions", description: "Engage your audience with perfectly timed, animated captions that are automatically generated." },
];
const pricingTiers = [
  { name: "Free", price: "$0", features: ["1 Video per month", "Basic AI Voice", "Watermarked Videos"], cta: "Start for Free" },
  { name: "Pro", price: "$29", popular: true, features: ["20 Videos per month", "Premium AI Voices", "No Watermark", "1080p Resolution"], cta: "Get Started" },
  { name: "Team", price: "$79", features: ["Unlimited Videos", "All Pro features", "Team Collaboration", "Priority Support"], cta: "Contact Sales" },
];
const faqs = [
  { q: "How does the AI find background videos?", a: "Our AI analyzes your script's keywords and context to search a massive library of royalty-free stock footage, selecting the most relevant clips for each scene." },
  { q: "Can I use my own voice?", a: "Currently, we offer a wide selection of high-quality AI voices. Voice cloning and uploading custom audio are features on our roadmap." },
  { q: "What is the video resolution?", a: "Free plan videos are in 720p. Paid plans offer crisp 1080p resolution, perfect for all social media platforms." },
  { q: "How long can my videos be?", a: "ClipCraft AI is optimized for short-form content, typically up to 90 seconds, which is ideal for platforms like TikTok, Instagram Reels, and YouTube Shorts." },
];
export function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 animate-background-pan -z-10" />
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-balance leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Create Viral Short Videos with AI in Minutes
            </h1>
            <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto text-pretty">
              Stop spending hours editing. Just write a script, and let our AI handle the voiceover, visuals, captions, and music.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg px-8 py-6">
                <Link to="/signup">Start Creating for Free</Link>
              </Button>
            </div>
          </div>
        </section>
        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-zinc-950">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">The Future of Content Creation</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">ClipCraft AI automates the tedious parts of video production so you can focus on your message.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
                  <div className="shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-zinc-400 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-28">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Pricing That Scales With You</h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">Start for free, and upgrade when you're ready to go pro.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {pricingTiers.map((tier) => (
                <Card key={tier.name} className={`bg-zinc-900 border-zinc-800 flex flex-col h-full ${tier.popular ? 'border-indigo-500/50 ring-2 ring-indigo-500/50' : ''}`}>
                  {tier.popular && <div className="text-center py-1 bg-indigo-600 text-white text-sm font-semibold rounded-t-lg">Most Popular</div>}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-semibold">{tier.name}</CardTitle>
                    <p className="text-4xl font-bold">{tier.price}<span className="text-lg font-medium text-zinc-400">/mo</span></p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-3">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          <span className="text-zinc-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className={`w-full ${tier.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-zinc-800 hover:bg-zinc-700'} text-white`}>
                      <Link to="/signup">{tier.cta}</Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-28 bg-zinc-950">
          <div className="container max-w-3xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-zinc-800">
                  <AccordionTrigger className="text-lg font-medium text-left hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-zinc-400 text-base">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="py-8 border-t border-zinc-800">
        <div className="container max-w-7xl mx-auto text-center text-sm text-zinc-500 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} ClipCraft AI. All rights reserved.</span>
          <span>Built with ❤️ at Cloudflare</span>
        </div>
      </footer>
    </div>
  );
}