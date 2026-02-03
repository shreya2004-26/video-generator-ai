import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Twitter, Youtube } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="border-t border-border bg-background/50 backdrop-blur-lg">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            VidMaxx
                        </Link>
                        <p className="text-sm leading-6 text-muted-foreground max-w-sm">
                            The ultimate AI platform for automated short-video creation and scheduling. Scale your content game today.
                        </p>
                        <div className="flex space-x-6">
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                <span className="sr-only">YouTube</span>
                                <Youtube className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Product</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['Features', 'Integrations', 'Pricing', 'Changelog'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['About Us', 'Careers', 'Blog', 'Contact'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                        <li key={item}>
                                            <Link href="#" className="text-sm leading-6 text-muted-foreground hover:text-primary transition-colors">
                                                {item}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-foreground">Newsletter</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                    Latest updates and AI trends.
                                </p>
                                <form className="mt-4 sm:flex sm:max-w-md">
                                    <div className="flex-1">
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full min-w-0"
                                        />
                                    </div>
                                    <div className="mt-3 sm:ml-3 sm:mt-0">
                                        <Button type="submit">Subscribe</Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-border pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-muted-foreground">
                        &copy; {new Date().getFullYear()} VidMaxx, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
