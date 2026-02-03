import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
// Note: Mobile menu state would need client component which we can add later if needed.
// For now, simple responsive design.

export function LandingNavbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                                VidMaxx
                            </span>
                        </Link>
                        <div className="hidden md:block md:ml-10">
                            <div className="flex space-x-8">
                                <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    Features
                                </Link>
                                <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    Pricing
                                </Link>
                                <Link href="#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                    About
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                            <Button size="sm">
                                Get Started
                            </Button>
                        </div>
                        <div className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
