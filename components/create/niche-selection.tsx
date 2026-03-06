"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ghost, Sparkles, History, Moon, HelpCircle, Trophy } from "lucide-react"

const AVAILABLE_NICHES = [
    {
        id: "scary-stories",
        title: "Scary Stories",
        description: "Chilling tales and urban legends to keep viewers on the edge of their seats.",
        icon: Ghost,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10"
    },
    {
        id: "motivational",
        title: "Motivational",
        description: "Inspiring quotes and stories to boost productivity and mindset.",
        icon: Sparkles,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10"
    },
    {
        id: "historical-facts",
        title: "Historical Facts",
        description: "Fascinating events and lesser-known historical trivia.",
        icon: History,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10"
    },
    {
        id: "bedtime-stories",
        title: "Bedtime Stories",
        description: "Calm and soothing narratives designed to help viewers relax.",
        icon: Moon,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10"
    },
    {
        id: "trivia",
        title: "Trivia & Quizzes",
        description: "Engaging interactive questions across various random topics.",
        icon: HelpCircle,
        color: "text-green-500",
        bgColor: "bg-green-500/10"
    },
    {
        id: "sports-highlights",
        title: "Sports Highlights",
        description: "Epic moments, records, and analysis from the world of sports.",
        icon: Trophy,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10"
    }
]

interface NicheSelectionProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function NicheSelection({ formData, updateFormData }: NicheSelectionProps) {
    const selectedNiche = formData.niche || null;
    const activeTab = formData.nicheType || "available";

    return (
        <div className="flex flex-col max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Choose your Niche</h2>
                <p className="text-muted-foreground">Select a category for your AI generated short videos.</p>
            </div>

            <Tabs defaultValue="available" value={activeTab} onValueChange={(t) => updateFormData({ nicheType: t })} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="available">Available Niche</TabsTrigger>
                    <TabsTrigger value="custom">Custom Niche</TabsTrigger>
                </TabsList>
                <TabsContent value="available" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                        {AVAILABLE_NICHES.map((niche) => {
                            const Icon = niche.icon
                            const isSelected = selectedNiche === niche.id
                            return (
                                <motion.div
                                    key={niche.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-200 h-full ${isSelected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "hover:border-foreground/20"
                                            }`}
                                        onClick={() => updateFormData({ niche: niche.id, nicheType: activeTab })}
                                    >
                                        <CardContent className="p-6 flex flex-col gap-4 h-full">
                                            <div className={`p-3 rounded-xl w-12 h-12 flex items-center justify-center ${niche.bgColor}`}>
                                                <Icon className={`w-6 h-6 ${niche.color}`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg mb-1">{niche.title}</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {niche.description}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </TabsContent>
                <TabsContent value="custom">
                    <Card>
                        <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[400px]">
                            <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                            <p>Custom niche input form will go here.</p>
                            <p className="text-sm mt-2">Describe exactly what kind of videos you want the AI to generate.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
