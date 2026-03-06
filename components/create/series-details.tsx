"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Youtube, Instagram, Mail, Clock, Calendar } from "lucide-react"

// TikTok icon isn't standard in lucide-react often, let's use a generic Video icon or a custom SVG
const TikTokIcon = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
)

const PLATFORMS = [
    { id: "tiktok", name: "TikTok", icon: TikTokIcon, color: "hover:bg-black hover:text-white" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "hover:bg-red-500 hover:text-white" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "hover:bg-pink-600 hover:text-white" },
    { id: "email", name: "Email", icon: Mail, color: "hover:bg-blue-500 hover:text-white" },
]

const DURATIONS = [
    { id: "30-50", label: "30-50 seconds" },
    { id: "60-70", label: "60-70 seconds" }
]

interface SeriesDetailsProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function SeriesDetails({ formData, updateFormData }: SeriesDetailsProps) {
    const selectedPlatforms: string[] = formData.platforms || []

    const togglePlatform = (platformId: string) => {
        if (selectedPlatforms.includes(platformId)) {
            updateFormData({ platforms: selectedPlatforms.filter(id => id !== platformId) })
        } else {
            updateFormData({ platforms: [...selectedPlatforms, platformId] })
        }
    }

    return (
        <div className="flex flex-col max-w-2xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-3xl font-bold tracking-tight">Series Details</h2>
                <p className="text-muted-foreground">Finalize the settings for your automated video series.</p>
            </div>

            <div className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">

                {/* Series Name */}
                <div className="space-y-3">
                    <Label htmlFor="series-name" className="text-base font-semibold">Series Name</Label>
                    <Input
                        id="series-name"
                        placeholder="e.g. Daily Motivation Shorts"
                        value={formData.seriesName || ""}
                        onChange={(e) => updateFormData({ seriesName: e.target.value })}
                        className="text-lg py-6"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* Video Duration */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Video Duration</Label>
                        <select
                            className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.videoDuration || ""}
                            onChange={(e) => updateFormData({ videoDuration: e.target.value })}
                        >
                            <option value="" disabled>Select duration...</option>
                            {DURATIONS.map(dur => (
                                <option key={dur.id} value={dur.id}>{dur.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time to Publish */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold">Time to Publish</Label>
                        <div className="relative">
                            <Input
                                type="time"
                                value={formData.publishTime || ""}
                                onChange={(e) => updateFormData({ publishTime: e.target.value })}
                                className="h-12 w-full text-base"
                            />
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Platforms */}
                <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold">Publish Platforms</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PLATFORMS.map((platform) => {
                            const Icon = platform.icon;
                            const isSelected = selectedPlatforms.includes(platform.id);

                            return (
                                <motion.div key={platform.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <button
                                        onClick={() => togglePlatform(platform.id)}
                                        className={`w-full flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : `border-border bg-background text-muted-foreground ${platform.color}`
                                            }`}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <span className="text-sm font-medium">{platform.name}</span>
                                    </button>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div className="bg-muted text-muted-foreground p-4 rounded-lg flex items-start gap-3 mt-4 text-sm mt-8 border">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p>
                        <strong className="text-foreground">Note:</strong> Video will generate 3-6 hours before video publish time automatically based on your schedule.
                    </p>
                </div>

            </div>
        </div>
    )
}
