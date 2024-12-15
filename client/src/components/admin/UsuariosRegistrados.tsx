import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { MoreHorizontal, Pencil, Trash2, UserMinus } from 'lucide-react'
import { fetchUsers, UserDto, deleteUser, updateUser, UpdateUserDto, updateDoctor, updatePatient } from '@/api/auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface UsuariosRegistradosProps {
    token: string;
}

type Role = 'todos' | 'medico' | 'farmaceutico' | 'admin' | 'paciente' | string;

interface UpdateDoctorDto {
    especialidad: string;
}

interface UpdatePatientDto {
    fechaNacimiento: string;
}

export function UsuariosRegistrados({ token }: UsuariosRegistradosProps) {
    const [users, setUsers] = useState<UserDto[]>([])
    const [filteredUsers, setFilteredUsers] = useState<UserDto[]>([])
    const [selectedRole, setSelectedRole] = useState<Role>('todos')
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const { toast } = useToast()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<UserDto | null>(null)
    const [userToEdit, setUserToEdit] = useState<UserDto | null>(null)
    const [editForm, setEditForm] = useState<UpdateUserDto & UpdateDoctorDto & UpdatePatientDto>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        especialidad: '',
        fechaNacimiento: '',
    })

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, selectedRole, searchTerm])

    const loadUsers = async () => {
        try {
            const fetchedUsers = await fetchUsers(token)
            setUsers(fetchedUsers)
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
                (user.telefono && user.telefono.toLowerCase().includes(lowercasedSearch)) ||
                (user.especialidad && user.especialidad.toLowerCase().includes(lowercasedSearch)) ||
                (user.fechaNacimiento && user.fechaNacimiento.includes(lowercasedSearch))
            )
        }

        setFilteredUsers(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    }

    const handleEdit = (user: UserDto) => {
        setUserToEdit(user)
        setEditForm({
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            telefono: user.telefono || '',
            especialidad: user.especialidad || '',
            fechaNacimiento: user.fechaNacimiento || '',
        })
        setIsEditDialogOpen(true)
    }

    const handleDelete = (user: UserDto) => {
        setUserToDelete(user)
        setIsDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                await deleteUser(token, userToDelete.id)
                setUsers(users.filter(user => user.id !== userToDelete.id));
                toast({
                    title: "Éxito",
                    description: "Usuario eliminado exitosamente.",
                });
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
                toast({
                    title: "Error",
                    description: "Error al eliminar usuario.",
                    variant: "destructive",
                });
            }
        }
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userToEdit) {
            try {
                // Regular user update
                const updatedUser = await updateUser(token, userToEdit.id, {
                    nombre: editForm.nombre,
                    apellido: editForm.apellido,
                    email: editForm.email,
                    telefono: editForm.telefono,
                });

                // If user is a doctor, update specialty
                if (userToEdit.rol === 'medico' && editForm.especialidad) {
                    await updateDoctor(token, userToEdit.idEspecifico!, {
                        especialidad: editForm.especialidad,
                    });
                }

                // If user is a patient, update birth date
                if (userToEdit.rol === 'paciente' && editForm.fechaNacimiento) {
                    await updatePatient(token, userToEdit.idEspecifico!, {
                        fechaNacimiento: editForm.fechaNacimiento,
                    });
                }

                setUsers(users.map(user => user.id === updatedUser.id ? {
                    ...updatedUser,
                    especialidad: userToEdit.rol === 'medico' ? editForm.especialidad : user.especialidad,
                    fechaNacimiento: userToEdit.rol === 'paciente' ? editForm.fechaNacimiento : user.fechaNacimiento
                } : user));

                toast({
                    title: "Éxito",
                    description: "Usuario actualizado exitosamente.",
                });
                setIsEditDialogOpen(false);
            } catch (error) {
                console.error('Error al actualizar usuario:', error);
                toast({
                    title: "Error",
                    description: "Error al actualizar usuario.",
                    variant: "destructive",
                });
            }
        }
    }

    const handleUnassign = async (userId: number) => {
        try {
            // Implement the API call to unassign the user
            toast({
                title: "Éxito",
                description: "Usuario desasignado exitosamente.",
            });
        } catch (error) {
            console.error('Error al desasignar usuario:', error);
            toast({
                title: "Error",
                description: "Error al desasignar usuario.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Usuarios Registrados</h2>
            <div className="mb-4 flex items-center space-x-4">
                <Select onValueChange={(value) => setSelectedRole(value as Role)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por rol" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="farmaceutico">Farmacéutico</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="paciente">Paciente</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Buscar por DNI, Nombre, Apellido, Email, Rol, Teléfono, Especialidad, Fecha de Nacimiento"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-grow"
                />
            </div>
            <div className="border rounded-lg overflow-hidden mx-auto" style={{ maxWidth: '100%', overflowX: 'auto' }}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID Usuario</TableHead>
                            <TableHead className="w-[100px]">DNI</TableHead>
                            <TableHead className="w-[120px]">Nombre</TableHead>
                            <TableHead className="w-[120px]">Apellido</TableHead>
                            <TableHead className="w-[180px]">Email</TableHead>
                            <TableHead className="w-[100px]">Rol</TableHead>
                            <TableHead className="w-[100px]">ID Específico</TableHead>
                            <TableHead className="w-[120px]">Especialidad</TableHead>
                            <TableHead className="w-[120px]">Fecha Nacimiento</TableHead>
                            <TableHead className="w-[100px]">Teléfono</TableHead>
                            <TableHead className="w-[80px]">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {getPaginatedData().length > 0 ? (
                            getPaginatedData().map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="whitespace-nowrap">{user.id}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.dni}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.nombre}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.apellido}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.email}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.rol}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.idEspecifico || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">{user.especialidad || '-'}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '-'}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">{user.telefono || '-'}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Editar</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(user)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    <span>Eliminar</span>
                                                </DropdownMenuItem>
                                                {(user.rol === 'medico' || user.rol === 'farmaceutico') && (
                                                    <DropdownMenuItem onClick={() => handleUnassign(user.id)}>
                                                        <UserMinus className="mr-2 h-4 w-4" />
                                                        <span>Desasignar</span>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-4">
                                    No hay usuarios registrados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro de que quieres eliminar este usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta
                            del usuario y eliminará sus datos de nuestros servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>
                            Actualiza la información del usuario aquí. Haz clic en guardar cuando hayas terminado.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="nombre" className="text-right">
                                    Nombre
                                </Label>
                                <Input
                                    id="nombre"
                                    value={editForm.nombre}
                                    onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="apellido" className="text-right">
                                    Apellido
                                </Label>
                                <Input
                                    id="apellido"
                                    value={editForm.apellido}
                                    onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="telefono" className="text-right">
                                    Teléfono
                                </Label>
                                <Input
                                    id="telefono"
                                    value={editForm.telefono}
                                    onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            {userToEdit?.rol === 'medico' && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="especialidad" className="text-right">
                                        Especialidad
                                    </Label>
                                    <Input
                                        id="especialidad"
                                        value={editForm.especialidad}
                                        onChange={(e) => setEditForm({ ...editForm, especialidad: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                            )}
                            {userToEdit?.rol === 'paciente' && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="fechaNacimiento" className="text-right">
                                        Fecha de Nacimiento
                                    </Label>
                                    <Input
                                        id="fechaNacimiento"
                                        type="date"
                                        value={editForm.fechaNacimiento ? editForm.fechaNacimiento.split('T')[0] : ''}
                                        onChange={(e) => setEditForm({ ...editForm, fechaNacimiento: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Guardar cambios</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

