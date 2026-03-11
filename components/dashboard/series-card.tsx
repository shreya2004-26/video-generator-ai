"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Play, Pause, Trash2, Video, Eye, Clock, Activity } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { toast } from "sonner"

interface SeriesCardProps {
    series: any;
    onUpdate: () => void;
}

export function SeriesCard({ series, onUpdate }: SeriesCardProps) {
    const thumbnailUrl = `/video-style/${series.video_style || 'realistic'}.png`

    // Formatting the date
    const createdDate = new Date(series.created_at)
    const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true })

    const [isLoading, setIsLoading] = useState(false)

    const handleUpdateStatus = async (newStatus: string) => {
        if (series.status === newStatus) return;

        try {
            setIsLoading(true)

            const response = await fetch('/api/series', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: series.id,
                    status: newStatus
                })
            })

            if (!response.ok) {
                throw new Error('Failed to update status')
            }

            toast.success(`Series marked as ${newStatus} successfully!`)
            onUpdate()
        } catch (error) {
            console.error(error)
            toast.error("Failed to update series status")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="relative aspect-video w-full bg-muted">
                <Image
                    src={thumbnailUrl}
                    alt={series.series_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className="bg-background/90 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wider">
                        {series.status}
                    </span>
                </div>

                {/* Top Right Edit Button overlay */}
                <div className="absolute top-3 right-3">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-background/80 hover:bg-background/100 backdrop-blur-sm">
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <CardContent className="p-4 flex-grow relative">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-semibold text-lg line-clamp-1">{series.series_name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Created {timeAgo}
                        </p>
                    </div>

                    {/* Popover / Dropdown Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Series
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger disabled={isLoading} className="cursor-pointer">
                                    <Activity className="mr-2 h-4 w-4" />
                                    Change Status
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => handleUpdateStatus('active')}
                                            disabled={series.status === 'active'}
                                        >
                                            <Play className="mr-2 h-4 w-4" />
                                            Active (Resume)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => handleUpdateStatus('paused')}
                                            disabled={series.status === 'paused'}
                                        >
                                            <Pause className="mr-2 h-4 w-4" />
                                            Paused
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() => handleUpdateStatus('pending')}
                                            disabled={series.status === 'pending'}
                                        >
                                            <Clock className="mr-2 h-4 w-4" />
                                            Pending
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" className="w-full text-xs h-9" size="sm">
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        View Past
                    </Button>
                    <Button className="w-full text-xs h-9 font-semibold" size="sm">
                        <Video className="mr-1.5 h-3.5 w-3.5" />
                        Generate Now
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
