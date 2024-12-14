import { Link } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { User, Stethoscope, Pill, Users } from 'lucide-react'

export function DashboardSidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Sidebar className={cn("w-64 border-r", className)} {...props}>
            <SidebarHeader>
                <Button variant="ghost" className="w-full justify-start">
                    <Pill className="mr-2 h-4 w-4" />
                    FarmaHelper
                </Button>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/dashboard/paciente">
                                <User className="mr-2 h-4 w-4" />
                                Paciente
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/dashboard/medico">
                                <Stethoscope className="mr-2 h-4 w-4" />
                                Médico
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/dashboard/farmaceutico">
                                <Pill className="mr-2 h-4 w-4" />
                                Farmacéutico
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/dashboard/admin">
                                <Users className="mr-2 h-4 w-4" />
                                Admin
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

