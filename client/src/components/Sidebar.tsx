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
import { User, Stethoscope, Pill, Users, Home, UserPlus, LogOut, UserRoundCheck } from 'lucide-react'

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userName: string;
    userRole: string;
    onLogout: () => void;
}

interface MenuItem {
    to: string;
    icon: React.ElementType;
    label: string;
    subItems?: MenuItem[];
}

export function DashboardSidebar({ className, userName, userRole, onLogout, ...props }: DashboardSidebarProps) {
    const getMenuItems = (role: string): MenuItem[] => {
        const commonItems: MenuItem[] = [
            { to: "/dashboard", icon: Home, label: "Inicio" },
        ];

        const roleSpecificItems: Record<string, MenuItem[]> = {
            admin: [
                {
                    to: "/dashboard/admin", icon: Users, label: "Admin", subItems: [
                        { to: "/dashboard/admin/nuevos-registros", icon: UserPlus, label: "Nuevos Registros" },
                        { to: "/dashboard/admin/usuarios-registrados", icon: UserRoundCheck, label: "Usuarios" }
                    ]
                },
            ],
            paciente: [
                { to: "/dashboard/paciente", icon: User, label: "Paciente" },
            ],
            medico: [
                { to: "/dashboard/medico", icon: Stethoscope, label: "Médico" },
            ],
            farmaceutico: [
                { to: "/dashboard/farmaceutico", icon: Pill, label: "Farmacéutico" },
            ],
        };

        return [...commonItems, ...(roleSpecificItems[role] || [])];
    };

    const menuItems = getMenuItems(userRole);

    const renderMenuItem = (item: MenuItem) => (
        <SidebarMenuItem key={item.to}>
            <SidebarMenuButton asChild>
                <Link to={item.to}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                </Link>
            </SidebarMenuButton>
            {item.subItems && (
                <SidebarGroup>
                    {item.subItems.map(renderMenuItem)}
                </SidebarGroup>
            )}
        </SidebarMenuItem>
    );

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
                    {menuItems.map(renderMenuItem)}
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={onLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar sesión
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    )
}

