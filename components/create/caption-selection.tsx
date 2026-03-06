"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface CaptionSelectionProps {
    formData: any;
    updateFormData: (data: any) => void;
}

const CAPTION_STYLES = [
    { id: "pop", name: "Pop" },
    { id: "fade", name: "Fade" },
    { id: "slide", name: "Slide Up" },
    { id: "typewriter", name: "Typewriter" },
    { id: "highlight", name: "Highlight" },
    { id: "bounce", name: "Bounce" },
];

const SAMPLE_TEXT = "Generate viral shorts in seconds";
const WORDS = SAMPLE_TEXT.split(" ");

// Helper to get animation variants based on style ID
const getCaptionVariants = (styleId: string): Variants => {
    switch (styleId) {
        case "pop":
            return {
                initial: { scale: 0, opacity: 0 },
                animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
                exit: { scale: 0, opacity: 0, transition: { duration: 0.2 } }
            };
        case "fade":
            return {
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration: 0.3 } },
                exit: { opacity: 0, transition: { duration: 0.2 } }
            };
        case "slide":
            return {
                initial: { y: 20, opacity: 0 },
                animate: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
                exit: { y: -20, opacity: 0, transition: { duration: 0.2 } }
            };
        case "highlight":
            return {
                initial: { opacity: 0.5, color: "#888" },
                animate: { opacity: 1, color: "#eab308", transition: { duration: 0.2 } },
                exit: { opacity: 0, transition: { duration: 0.2 } }
            };
        case "bounce":
            return {
                initial: { y: 0, opacity: 0 },
                animate: { y: [0, -10, 0], opacity: 1, transition: { duration: 0.4, times: [0, 0.5, 1] } },
                exit: { opacity: 0, transition: { duration: 0.2 } }
            };
        default:
            return {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 }
            };
    }
}

// A component that loops through words over time to simulate a video playing
const AnimatedPreview = ({ styleId }: { styleId: string }) => {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % (WORDS.length + 1)); // +1 to have a brief pause at the end
        }, 600); // Change word every 600ms
        return () => clearInterval(interval);
    }, []);

    // Typewriter effect relies on characters
    if (styleId === "typewriter") {
        const currentText = wordIndex < WORDS.length ? WORDS.slice(0, wordIndex + 1).join(" ") : SAMPLE_TEXT;

        return (
            <div className="flex h-full items-center justify-center p-4 bg-muted/30">
                <span className="text-xl font-bold font-mono text-center">
                    {currentText}
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    >
                        |
                    </motion.span>
                </span>
            </div>
        );
    }

    const currentWord = wordIndex < WORDS.length ? WORDS[wordIndex] : "";
    const variants = getCaptionVariants(styleId);

    return (
        <div className="flex h-full items-center justify-center p-4 bg-muted/30 overflow-hidden relative">
            <AnimatePresence mode="wait">
                {currentWord && (
                    <motion.div
                        key={`${styleId}-${wordIndex}`}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className={`text-2xl font-black text-center ${styleId === 'highlight' ? 'uppercase' : ''}`}
                        style={styleId === "highlight" ? { WebkitTextStroke: "1px black" } : {}}
                    >
                        {currentWord}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export function CaptionSelection({ formData, updateFormData }: CaptionSelectionProps) {
    const selectedStyle = formData.captionStyle;

    const handleSelectStyle = (styleId: string) => {
        updateFormData({ captionStyle: styleId })
    }

    return (
        <div className="flex flex-col max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Caption Style</h2>
                <p className="text-muted-foreground">Choose how your captions will be animated in the video.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-6">
                {CAPTION_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;

                    return (
                        <motion.div
                            key={style.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className={`cursor-pointer overflow-hidden transition-all duration-200 border-2 h-[200px] flex flex-col ${isSelected ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:border-primary/50"
                                    }`}
                                onClick={() => handleSelectStyle(style.id)}
                            >
                                <div className="h-3/4 w-full relative">
                                    <AnimatedPreview styleId={style.id} />
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full p-1 animate-in zoom-in duration-200 z-10">
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                </div>
                                <div className="h-1/4 bg-card border-t flex items-center justify-center">
                                    <h3 className="font-semibold">{style.name}</h3>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
