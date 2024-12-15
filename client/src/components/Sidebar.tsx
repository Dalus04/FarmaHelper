import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarFooter,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { User, Stethoscope, Pill, Users, Home, UserPlus, LogOut, UserRoundCheck, ChevronUp, Edit, Trash2, Bell } from 'lucide-react'
import { EditUserInfoModal } from './user/EditUserInfoModal'

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userName: string;
    userRole: string;
    token: string;
    onLogout: () => void;
    onDeleteAccount: () => void;
    onNotifications: () => void;
}

interface MenuItem {
    to: string;
    icon: React.ElementType;
    label: string;
    subItems?: MenuItem[];
}

export function DashboardSidebar({
    className,
    userName,
    userRole,
    token,
    onLogout,
    onDeleteAccount,
    onNotifications,
    ...props
}: DashboardSidebarProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [currentUserInfo, setCurrentUserInfo] = useState<{
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
    } | null>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const user = JSON.parse(storedUser)
            setCurrentUserInfo({
                nombre: user.nombre,
                apellido: user.apellido,
                email: user.email,
                telefono: user.telefono || '',
            })
        }
    }, [])

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

    const handleEditInfo = () => {
        setIsEditModalOpen(true)
    }

    const handleUpdateSuccess = (updatedUser: typeof currentUserInfo) => {
        setCurrentUserInfo(updatedUser)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            const user = JSON.parse(storedUser)
            const updatedStoredUser = { ...user, ...updatedUser }
            localStorage.setItem('user', JSON.stringify(updatedStoredUser))
        }
    }

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
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center">
                                            <Avatar className="h-8 w-8 mr-2">
                                                <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
                                                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{userName}</span>
                                        </div>
                                        <ChevronUp className="h-4 w-4 ml-2" />
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem onClick={handleEditInfo}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Editar info</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDeleteAccount}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Eliminar Cuenta</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onNotifications}>
                                    <Bell className="mr-2 h-4 w-4" />
                                    <span>Notificaciones</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onLogout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Cerrar sesión</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <EditUserInfoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdateSuccess={handleUpdateSuccess}
                currentUser={currentUserInfo}
            />
        </Sidebar>
    )
}

