"use client"

import * as React from "react"
import { PlaySquare, Video, BookOpen, CreditCard, Settings, ArrowUpCircle, UserCircle, Plus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
    {
        title: "Series",
        url: "/dashboard",
        icon: PlaySquare,
    },
    {
        title: "Videos",
        url: "/dashboard/videos",
        icon: Video,
    },
    {
        title: "Guides",
        url: "/dashboard/guides",
        icon: BookOpen,
    },
    {
        title: "Billing",
        url: "/dashboard/billing",
        icon: CreditCard,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]

const footerItems = [
    {
        title: "Upgrade",
        url: "/dashboard/billing",
        icon: ArrowUpCircle,
    },
    {
        title: "Profile Setting",
        url: "/dashboard/settings",
        icon: UserCircle,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { toggleSidebar, isMobile } = useSidebar()

    return (
        <Sidebar variant="inset" className="border-r">
            <SidebarHeader className="h-auto flex flex-col pt-6 pb-2 px-4 border-b gap-4">
                <Link href="/" className="flex items-center space-x-2">
                    {/* If logo.png is missing, it will display the alt text. */}
                    <Image src="/logo.png" alt="User Logo" width={32} height={32} className="rounded-full" />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        VidMaxx
                    </span>
                </Link>
                <Button className="w-full justify-start font-semibold text-md h-10 shadow-sm" size="sm">
                    <Plus className="mr-2 h-5 w-5" /> Create new series
                </Button>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2 mt-2">
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title}
                                        size="lg" // making menu option bigger
                                        className="text-base"
                                        onClick={() => {
                                            if (isMobile) {
                                                toggleSidebar()
                                            }
                                        }}
                                    >
                                        <Link href={item.url}>
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t pb-4 pt-2">
                <SidebarGroupContent>
                    <SidebarMenu className="gap-1">
                        {footerItems.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.url}
                                    size="lg"
                                    className="text-base text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                        if (isMobile) {
                                            toggleSidebar()
                                        }
                                    }}
                                >
                                    <Link href={item.url}>
                                        <item.icon className="h-5 w-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarFooter>
        </Sidebar>
    )
}
