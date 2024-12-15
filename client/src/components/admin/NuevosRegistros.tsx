import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { RegistrarMedico } from './RegistrarMedico'
import { RegistrarFarmaceutico } from './RegistrarFarmaceutico'
import { RegistrarAdministrador } from './RegistrarAdministrador'
import { fetchUsers, fetchRegisteredDoctors, fetchRegisteredPharmacists, registerDoctor, registerPharmacist } from '@/api/auth'
import { UserDto } from '@/types/userDtos'
import { DoctorSpecialtyModal } from './DoctorSpecialtyModal'
import { ConfirmPharmacistModal } from './ConfirmPharmacistModal'

interface NuevosRegistrosProps {
    token: string;
}

type Role = 'todos' | 'medico' | 'farmaceutico' | string;

export function NuevosRegistros({ token }: NuevosRegistrosProps) {
    const [activeTab, setActiveTab] = useState<Role>("medico")
    const [users, setUsers] = useState<UserDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([])
    const [selectedRole, setSelectedRole] = useState<Role>('todos')
    const [searchTerm, setSearchTerm] = useState('')
    const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false)
    const [isPharmacistModalOpen, setIsPharmacistModalOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const { toast } = useToast()

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, selectedRole, searchTerm])

    const loadUsers = async () => {
        try {
            const [fetchedUsers, registeredDoctorIds, registeredPharmacistIds] = await Promise.all([
                fetchUsers(token),
                fetchRegisteredDoctors(token),
                fetchRegisteredPharmacists(token)
            ])

            const unregisteredUsers = fetchedUsers.filter(user =>
                (user.rol === 'farmaceutico' && !registeredPharmacistIds.includes(user.id)) ||
                (user.rol === 'medico' && !registeredDoctorIds.includes(user.id))
            );

            setUsers(unregisteredUsers);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch users.",
                variant: "destructive",
            })
        }
    }

    const filterUsers = () => {
        let filtered = users;

        if (selectedRole !== 'todos') {
            filtered = filtered.filter(user => user.rol === selectedRole)
        }

        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                user.dni.toLowerCase().includes(lowercasedSearch) ||
                user.nombre.toLowerCase().includes(lowercasedSearch) ||
                user.apellido.toLowerCase().includes(lowercasedSearch) ||
                user.email.toLowerCase().includes(lowercasedSearch) ||
                user.rol.toLowerCase().includes(lowercasedSearch) ||
                (user.telefono && user.telefono.toLowerCase().includes(lowercasedSearch))
            )
        }

        setFilteredUsers(filtered)
        setCurrentPage(1) 
    }

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    }

    const handleRegister = async (user: UserDto) => {
        setSelectedUser(user)
        if (user.rol === 'medico') {
            setIsSpecialtyModalOpen(true)
        } else if (user.rol === 'farmaceutico') {
            setIsPharmacistModalOpen(true)
        }
    }

    const handleSpecialtySubmit = async (specialty: string) => {
        if (selectedUser) {
            try {
                await registerDoctor(token, selectedUser.id, specialty)
                toast({
                    title: "Éxito",
                    description: "Médico registrado correctamente.",
                })
                await loadUsers()
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to register doctor.",
                    variant: "destructive",
                })
            }
        }
        setIsSpecialtyModalOpen(false)
        setSelectedUser(null)
    }

    const handlePharmacistConfirm = async () => {
        if (selectedUser) {
            try {
                await registerPharmacist(token, selectedUser.id)
                toast({
                    title: "Éxito",
                    description: "Farmacéutico registrado correctamente.",
                })
                await loadUsers()
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to register pharmacist.",
                    variant: "destructive",
                })
            }
        }
        setIsPharmacistModalOpen(false)
        setSelectedUser(null)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Nuevos Registros</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 w-full">
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Role)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="medico">Médico</TabsTrigger>
                            <TabsTrigger value="farmaceutico">Farmacéutico</TabsTrigger>
                            <TabsTrigger value="admin">Administrador</TabsTrigger>
                        </TabsList>
                        <div className="mt-4 p-4 border rounded-lg bg-white min-h-[400px]">
                            <TabsContent value="medico" className="w-full">
                                <RegistrarMedico token={token} />
                            </TabsContent>
                            <TabsContent value="farmaceutico" className="w-full">
                                <RegistrarFarmaceutico token={token} />
                            </TabsContent>
                            <TabsContent value="admin" className="w-full">
                                <RegistrarAdministrador token={token} />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
                <div className="lg:col-span-7 w-full">
                    <h2 className="text-xl font-semibold mb-4">Usuarios Pendientes</h2>
                    <div className="mb-4 flex items-center space-x-4">
                        <Select onValueChange={(value) => setSelectedRole(value as Role)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="medico">Médico</SelectItem>
                                <SelectItem value="farmaceutico">Farmacéutico</SelectItem>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Buscar por DNI, Nombre, Apellido, Email, Rol, Teléfono"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-grow"
                        />
                    </div>
                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">DNI</TableHead>
                                            <TableHead className="w-[150px]">Nombre</TableHead>
                                            <TableHead className="w-[150px]">Apellido</TableHead>
                                            <TableHead className="w-[200px]">Email</TableHead>
                                            <TableHead className="w-[100px]">Rol</TableHead>
                                            <TableHead className="w-[100px]">Teléfono</TableHead>
                                            <TableHead className="w-[100px]">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {getPaginatedData().length > 0 ? (
                                            getPaginatedData().map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="whitespace-nowrap">{user.dni}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{user.nombre}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{user.apellido}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{user.rol}</TableCell>
                                                    <TableCell className="whitespace-nowrap">{user.telefono || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <Button onClick={() => handleRegister(user)} size="sm">
                                                            Registrar
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-4">
                                                    No hay usuarios pendientes
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                        onPageChange={setCurrentPage}
                        showThreePages={selectedRole === 'medico'}
                    />
                </div>
            </div>
            {selectedUser && (
                <>
                    <DoctorSpecialtyModal
                        isOpen={isSpecialtyModalOpen}
                        onClose={() => setIsSpecialtyModalOpen(false)}
                        onSubmit={handleSpecialtySubmit}
                        userName={`${selectedUser.nombre} ${selectedUser.apellido}`}
                    />
                    <ConfirmPharmacistModal
                        isOpen={isPharmacistModalOpen}
                        onClose={() => setIsPharmacistModalOpen(false)}
                        onConfirm={handlePharmacistConfirm}
                        userName={`${selectedUser.nombre} ${selectedUser.apellido}`}
                    />
                </>
            )}
        </div>
    )
}

