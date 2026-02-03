import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";

export function LandingHero() {
    return (
        <section className="relative overflow-hidden py-20 pb-32 sm:py-32 lg:pb-32 xl:pb-36">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            <span>New: Auto-scheduler 2.0 is live</span>
                        </span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-100">
                        Create Viral Short Videos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                            with AI in Seconds
                        </span>
                    </h1>

                    <p className="mt-6 text-lg leading-8 text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-200 max-w-2xl mx-auto">
                        VidMaxx automatically generates, edits, and schedules your short-form content for YouTube Shorts, Instagram Reels, and TikTok.
                    </p>

                    <div className="mt-10 flex items-center justify-center gap-x-6 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-300">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2">
                            Start Creating <ArrowRight className="h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="h-12 px-8 text-lg gap-2">
                            <PlayCircle className="h-5 w-5" /> Watch Demo
                        </Button>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50" />
            </div>
        </section>
    );
}
