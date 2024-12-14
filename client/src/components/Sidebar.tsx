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
    SidebarGroup,
} from "@/components/ui/sidebar"
import { User, Stethoscope, Pill, Users, Home, UserPlus } from 'lucide-react'

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userName: string;
}

export function DashboardSidebar({ className, userName, ...props }: DashboardSidebarProps) {
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
                            <Link to="/dashboard">
                                <Home className="mr-2 h-4 w-4" />
                                Inicio
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
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
                        <SidebarGroup>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link to="/dashboard/admin/nuevos-registros">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Nuevos Registros
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarGroup>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

