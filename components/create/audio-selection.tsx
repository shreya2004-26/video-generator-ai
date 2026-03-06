"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Music, CheckCircle2 } from "lucide-react"
import { BackgroundMusic } from "@/lib/constants/audio"
import { Label } from "@/components/ui/label"

interface AudioSelectionProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function AudioSelection({ formData, updateFormData }: AudioSelectionProps) {
    const selectedAudios: string[] = formData.backgroundAudio || []

    const [playingAudio, setPlayingAudio] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const toggleAudioSelection = (audioId: string) => {
        const isCurrentlySelected = selectedAudios.includes(audioId)
        let newSelection: string[]

        if (isCurrentlySelected) {
            newSelection = selectedAudios.filter(id => id !== audioId)
        } else {
            newSelection = [...selectedAudios, audioId]
        }

        updateFormData({ backgroundAudio: newSelection })
    }

    const handlePlayPause = (e: React.MouseEvent, audio: any) => {
        e.stopPropagation();

        if (playingAudio === audio.id) {
            audioRef.current?.pause();
            setPlayingAudio(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const newAudio = new Audio(audio.url);
            newAudio.onended = () => setPlayingAudio(null);
            newAudio.play().catch(err => {
                console.error("Audio playback failed", err);
                setPlayingAudio(null);
            });
            audioRef.current = newAudio;
            setPlayingAudio(audio.id);
        }
    }

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        }
    }, [])

    return (
        <div className="flex flex-col max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Background Music</h2>
                <p className="text-muted-foreground">Select one or more background tracks for your videos.</p>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <Label className="text-base font-semibold">Available Tracks</Label>
                    <span className="text-sm text-muted-foreground">
                        {selectedAudios.length} selected
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3 h-[400px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    {BackgroundMusic.map((audio) => {
                        const isSelected = selectedAudios.includes(audio.id);
                        const isPlaying = playingAudio === audio.id;

                        return (
                            <motion.div
                                key={audio.id}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Card
                                    className={`cursor-pointer transition-all duration-200 border-2 ${isSelected ? "border-primary bg-primary/5" : "hover:border-foreground/20"
                                        }`}
                                    onClick={() => toggleAudioSelection(audio.id)}
                                >
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => handlePlayPause(e, audio)}
                                                className={`p-3 rounded-full flex-shrink-0 transition-colors ${isPlaying ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
                                            >
                                                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                            </button>

                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-[15px]">{audio.name}</h3>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                                    <Music className="w-3.5 h-3.5" />
                                                    <span>MP3 Audio</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`transition-opacity duration-200 ${isSelected ? "opacity-100" : "opacity-0"}`}>
                                            <CheckCircle2 className="w-6 h-6 text-primary" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
