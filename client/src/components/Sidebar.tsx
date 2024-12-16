import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
import { User, Stethoscope, Pill, Users, Home, UserPlus, LogOut, UserRoundCheck, ChevronUp, Edit, Trash2, Bell, X } from 'lucide-react'
import { EditUserInfoModal } from './user/EditUserInfoModal'
import { DeleteAccountModal } from './user/DeleteAccountModal'
import { useToast } from '@/hooks/use-toast'

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userName: string;
    userRole: string;
    token: string;
    onLogout: () => void;
    onNotifications: () => void;
    onClose?: () => void;
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
    onNotifications,
    onClose,
    ...props
}: DashboardSidebarProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [currentUserInfo, setCurrentUserInfo] = useState<{
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
    } | null>(null)
    const { toast } = useToast()
    const navigate = useNavigate()
    const location = useLocation()

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
                {
                    to: "/dashboard/medico",
                    icon: Stethoscope,
                    label: "Médico",
                    subItems: [
                        { to: "/dashboard/medico/envio-recetas", icon: Edit, label: "Envío de recetas" }
                    ]
                },
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
                <Link
                    to={item.to}
                    className={cn(
                        "flex items-center space-x-2 w-full px-2 py-2 rounded-md hover:bg-gray-100",
                        location.pathname === item.to && "bg-gray-100 font-medium"
                    )}
                    onClick={() => {
                        if (onClose) onClose();
                    }}
                >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
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

    const handleDeleteAccount = () => {
        setIsDeleteModalOpen(true)
    }

    const handleDeleteSuccess = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toast({
            title: "Cuenta eliminada",
            description: "Tu cuenta ha sido eliminada exitosamente.",
        })
        navigate('/login')
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
        <Sidebar className={cn("w-full sm:w-64 border-r min-w-[320px] sm:min-w-0", className)} {...props}>
            <SidebarHeader className="flex justify-between items-center p-2 sm:p-4">
                <Button variant="ghost" className="text-lg font-semibold">
                    <Pill className="mr-2 h-5 w-5" />
                    FarmaHelper
                </Button>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                        <X className="h-5 w-5" />
                    </Button>
                )}
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
                                <DropdownMenuItem onClick={handleDeleteAccount}>
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
            <DeleteAccountModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </Sidebar>
    )
}

