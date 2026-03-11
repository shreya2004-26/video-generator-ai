"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { NicheSelection } from "@/components/create/niche-selection"
import { LanguageSelection } from "@/components/create/language-selection"
import { StyleSelection } from "@/components/create/style-selection"
import { AudioSelection } from "@/components/create/audio-selection"
import { CaptionSelection } from "@/components/create/caption-selection"
import { SeriesDetails } from "@/components/create/series-details"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const STEPS = [
    { id: 1, title: "Niche" },
    { id: 2, title: "Language" },
    { id: 3, title: "Audio" },
    { id: 4, title: "Style" },
    { id: 5, title: "Caption" },
    { id: 6, title: "Review" },
]

export default function CreateSeriesPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)

    const handleNextStep = async () => {
        if (currentStep === 6) {
            try {
                setIsLoading(true)
                const response = await fetch("/api/series", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                })

                if (!response.ok) {
                    throw new Error("Failed to schedule series")
                }

                toast.success("Series scheduled successfully!")
                router.push("/dashboard")
                router.refresh()
            } catch (error) {
                console.error(error)
                toast.error("Something went wrong. Please try again.")
                setIsLoading(false)
            }
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, 6))
        }
    }

    const handlePrevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const updateFormData = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }))
    }

    const isStepValid = () => {
        if (currentStep === 1) return !!formData.niche
        if (currentStep === 2) return !!formData.language && !!formData.voice
        if (currentStep === 3) return !!formData.backgroundAudio && formData.backgroundAudio.length > 0
        if (currentStep === 4) return !!formData.videoStyle
        if (currentStep === 5) return !!formData.captionStyle
        if (currentStep === 6) return !!formData.seriesName && !!formData.videoDuration && !!formData.publishTime && formData.platforms?.length > 0
        return true
    }

    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full py-6">
            <div className="flex flex-col gap-2 mb-4">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Series</h1>
                <p className="text-muted-foreground">Follow the steps below to craft your automated short video series.</p>
            </div>

            {/* Progress Stepper */}
            <div className="relative mb-8">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                </div>

                <div className="relative flex justify-between">
                    {STEPS.map((step) => {
                        const isCompleted = step.id < currentStep
                        const isCurrent = step.id === currentStep

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: isCompleted || isCurrent ? "var(--primary)" : "var(--muted)",
                                        borderColor: isCompleted || isCurrent ? "var(--primary)" : "var(--muted)",
                                    }}
                                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-background z-10 transition-colors duration-300 ${isCurrent ? "ring-4 ring-primary/20" : ""
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5 text-primary-foreground" />
                                    ) : (
                                        <span
                                            className={`font-semibold ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                                                }`}
                                        >
                                            {step.id}
                                        </span>
                                    )}
                                </motion.div>
                                <span
                                    className={`text-xs font-medium ${isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                                        }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Form Content */}
            <div className="min-h-[500px] w-full pt-4 flex flex-col">
                <div className="flex-grow">
                    {currentStep === 1 && <NicheSelection formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 2 && <LanguageSelection formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 3 && <AudioSelection formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 4 && <StyleSelection formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 5 && <CaptionSelection formData={formData} updateFormData={updateFormData} />}
                    {currentStep === 6 && <SeriesDetails formData={formData} updateFormData={updateFormData} />}
                </div>

                {/* Shared Navigation */}
                <div className="flex justify-between items-center pt-8 mt-auto border-t">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handlePrevStep}
                        disabled={currentStep === 1}
                        className={currentStep === 1 ? "opacity-0 pointer-events-none" : ""}
                    >
                        Back
                    </Button>
                    <Button
                        size="lg"
                        className={currentStep === 6 ? "bg-primary text-primary-foreground font-bold hover:shadow-lg transition-all" : ""}
                        onClick={handleNextStep}
                        disabled={!isStepValid() || isLoading}
                    >
                        {isLoading ? "Scheduling..." : currentStep === 6 ? "Schedule" : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
