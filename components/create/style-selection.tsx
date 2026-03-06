"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface StyleSelectionProps {
    formData: any;
    updateFormData: (data: any) => void;
}

const VIDEO_STYLES = [
    {
        id: "realistic",
        name: "Realistic",
        image: "/video-style/realistic.png",
    },
    {
        id: "cinematic",
        name: "Cinematic",
        image: "/video-style/cinematic.png",
    },
    {
        id: "anime",
        name: "Anime",
        image: "/video-style/anime.png",
    },
    {
        id: "3d-render",
        name: "3D Render",
        image: "/video-style/3d-render.png",
    },
    {
        id: "cyberpunk",
        name: "Cyberpunk",
        image: "/video-style/cyberpunk.png",
    },
    {
        id: "gta",
        name: "GTA",
        image: "/video-style/gta.png",
    },
];

export function StyleSelection({ formData, updateFormData }: StyleSelectionProps) {
    const selectedStyle = formData.videoStyle;

    const handleSelectStyle = (styleId: string) => {
        updateFormData({ videoStyle: styleId })
    }

    return (
        <div className="flex flex-col max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Video Style</h2>
                <p className="text-muted-foreground">Select the visual style for your generated videos.</p>
            </div>

            <div className="relative w-full">
                <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory hide-scrollbar style-scrollbar">
                    {VIDEO_STYLES.map((style) => {
                        const isSelected = selectedStyle === style.id;

                        return (
                            <motion.div
                                key={style.id}
                                className="snap-center shrink-0 w-[280px] sm:w-[320px] md:w-[400px]"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className={`cursor-pointer overflow-hidden transition-all duration-200 border-2 h-full ${isSelected ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-primary/50"
                                        }`}
                                    onClick={() => handleSelectStyle(style.id)}
                                >
                                    <div className="relative aspect-video w-full bg-muted">
                                        <Image
                                            src={style.image}
                                            alt={style.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 280px, (max-width: 1200px) 320px, 400px"
                                        />
                                        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-0' : 'opacity-100'}`} />

                                        {isSelected && (
                                            <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-1 animate-in zoom-in duration-200">
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                            </div>
                                        )}

                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                            <h3 className="text-white font-semibold text-lg">{style.name}</h3>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
