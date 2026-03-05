import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if the user is authenticated on the server side
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-background text-foreground w-full">
                <DashboardSidebar />
                <SidebarInset className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
                    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden sm:inline-block">
                                {user.firstName || user.username || "Creator"}
                            </span>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto pb-10">
                        <div className="container mx-auto p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
