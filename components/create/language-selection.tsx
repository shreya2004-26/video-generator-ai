"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, User, Mic } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Language, DeepgramVoices, FonadalabVoices } from "@/lib/constants/voices"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

const ALL_VOICES = [...DeepgramVoices, ...FonadalabVoices]

interface LanguageSelectionProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function LanguageSelection({ formData, updateFormData }: LanguageSelectionProps) {
    const selectedLangCode = formData.language || "en-US"
    const selectedVoiceModelName = formData.voice || null

    const currentLanguageObj = Language.find(l => l.modelLangCode === selectedLangCode) || Language[0]

    const availableVoices = ALL_VOICES.filter(v => v.model === currentLanguageObj.modelName)

    const [playingAudio, setPlayingAudio] = useState<string | null>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    // Ensure we reset selected voice if it doesn't match the new language's model
    useEffect(() => {
        if (selectedVoiceModelName) {
            const voice = availableVoices.find(v => v.modelName === selectedVoiceModelName)
            if (!voice) {
                updateFormData({ voice: null })
            }
        }
    }, [selectedLangCode, availableVoices, selectedVoiceModelName, updateFormData])

    const handlePlayPause = (e: React.MouseEvent, voice: any) => {
        e.stopPropagation();
        const src = voice.preview; // voices.ts now includes /voice/ prefix

        if (playingAudio === voice.modelName) {
            audioRef.current?.pause();
            setPlayingAudio(null);
        } else {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            const newAudio = new Audio(src);
            newAudio.onended = () => setPlayingAudio(null);
            newAudio.play().catch(err => {
                console.error("Audio playback failed", err);
                setPlayingAudio(null); // Fallback if audio file doesn't exist
            });
            audioRef.current = newAudio;
            setPlayingAudio(voice.modelName);
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
                <h2 className="text-3xl font-bold tracking-tight">Language & Voice</h2>
                <p className="text-muted-foreground">Select the language and AI voice for your videos.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <Label className="text-base">Select Language</Label>
                    <Select value={selectedLangCode} onValueChange={(val) => updateFormData({ language: val })}>
                        <SelectTrigger className="w-full h-12 text-base">
                            <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                        <SelectContent>
                            {Language.map((lang) => (
                                <SelectItem key={lang.modelLangCode} value={lang.modelLangCode}>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xl">{lang.countryFlag}</span>
                                        {lang.language}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <Label className="text-base">Choose Voice</Label>
                        <Badge variant="outline" className="text-xs">
                            {currentLanguageObj.modelName} model
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[350px] overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                        {availableVoices.map((voice) => {
                            const isSelected = selectedVoiceModelName === voice.modelName;
                            const isPlaying = playingAudio === voice.modelName;

                            return (
                                <motion.div
                                    key={voice.modelName}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={`cursor-pointer transition-all duration-200 h-full ${isSelected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "hover:border-foreground/20"
                                            }`}
                                        onClick={() => updateFormData({ voice: voice.modelName })}
                                    >
                                        <CardContent className="p-4 flex flex-col gap-3 h-full justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-2 rounded-full ${voice.gender === 'female' ? 'bg-pink-500/10 text-pink-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-sm capitalize">{voice.modelName.replace(/-/g, ' ')}</h3>
                                                        <p className="text-xs text-muted-foreground capitalize">{voice.gender} Voice</p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => handlePlayPause(e, voice)}
                                                    className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}
                                                >
                                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                                                <Mic className="w-3.5 h-3.5" />
                                                <span>Model: {voice.model}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}

                        {availableVoices.length === 0 && (
                            <div className="col-span-1 border-2 border-dashed rounded-xl border-border flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                                <Mic className="w-8 h-8 mb-2 opacity-50" />
                                <p>No voices available for this model.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
