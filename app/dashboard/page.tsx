"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaySquare, Video, CreditCard, TrendingUp, Loader2 } from "lucide-react";
import { SeriesCard } from "@/components/dashboard/series-card";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
    const [userSeries, setUserSeries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSeries = async () => {
        try {
            const response = await fetch('/api/series');
            if (!response.ok) {
                throw new Error('Failed to fetch series');
            }
            const data = await response.json();
            setUserSeries(data);
        } catch (error) {
            console.error(error);
            toast.error("Could not load your video series.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSeries();
    }, []);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here&apos;s an overview of your AI-generated short videos.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Series</CardTitle>
                        <PlaySquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : userSeries.length}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active projects
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                        <Video className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +5 from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credits Remaining</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">88</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Renews on April 1st
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">12,450</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +19% from last 30 days
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-7">
                    <CardHeader>
                        <CardTitle className="text-foreground">Recent Videos</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Your recently generated short videos ready for publishing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-start justify-center border-t bg-muted/10 p-6 min-h-[400px]">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground h-full py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground/50" />
                                <p>Loading your series...</p>
                            </div>
                        ) : userSeries.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                                {userSeries.map((series) => (
                                    <SeriesCard key={series.id} series={series} onUpdate={fetchSeries} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground h-full py-20">
                                <Video className="h-12 w-12 opacity-50" />
                                <p>No recent videos to show yet. Create a new series to get started!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
