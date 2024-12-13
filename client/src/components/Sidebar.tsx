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

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    setActiveSection: (section: string) => void;
}

export function DashboardSidebar({ className, setActiveSection, ...props }: SidebarProps) {
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
                        <SidebarMenuButton onClick={() => setActiveSection('paciente')}>
                            <User className="mr-2 h-4 w-4" />
                            Paciente
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => setActiveSection('medico')}>
                            <Stethoscope className="mr-2 h-4 w-4" />
                            Médico
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => setActiveSection('farmaceutico')}>
                            <Pill className="mr-2 h-4 w-4" />
                            Farmacéutico
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => setActiveSection('admin')}>
                            <Users className="mr-2 h-4 w-4" />
                            Admin
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

