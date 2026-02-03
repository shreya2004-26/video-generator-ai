import { Calendar, Clapperboard, Mail, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
    {
        title: "AI Video Generation",
        description: "Turn text prompts into engaging short videos with AI-generated visuals and voiceovers.",
        icon: Wand2,
    },
    {
        title: "Smart Auto-Scheduling",
        description: "Schedule your posts for optimal times on YouTube, TikTok, and Instagram automatically.",
        icon: Calendar,
    },
    {
        title: "Multi-Platform Support",
        description: "Create once, publish everywhere. Seamless integration with all major video platforms.",
        icon: Clapperboard,
    },
    {
        title: "Email Marketing",
        description: "Integrate video content directly into your email campaigns to boost click-through rates.",
        icon: Mail,
    },
];

export function LandingFeatures() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Everything you need to scale
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Powerful tools designed to help you dominate short-form video content.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300">
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
