import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { MoreHorizontal, Pencil, Trash2, UserMinus } from 'lucide-react'
import { fetchUsers, UserDto, deleteUser, updateUser, UpdateUserDto } from '@/api/user'
import { updateDoctor, unassignDoctor, fetchRegisteredDoctors } from '@/api/doctor'
import { updatePatient } from '@/api/patient'
import { unassignPharmacist, fetchRegisteredPharmacists } from '@/api/pharmacist'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Modal } from '../common/Modal'
import { FormInput } from '../common/FormInput'
import { handleApiError } from '@/utils/apiErrorHadler'

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
    const [registeredDoctorIds, setRegisteredDoctorIds] = useState<number[]>([])
    const [registeredPharmacistIds, setRegisteredPharmacistIds] = useState<number[]>([])
    const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false)
    const [userToUnassign, setUserToUnassign] = useState<UserDto | null>(null)

    useEffect(() => {
        loadUsers()
    }, [])

    useEffect(() => {
        filterUsers()
    }, [users, selectedRole, searchTerm])

    const loadUsers = async () => {
        try {
            const [fetchedUsers, doctorIds, pharmacistIds] = await Promise.all([
                fetchUsers(token),
                fetchRegisteredDoctors(token),
                fetchRegisteredPharmacists(token)
            ])
            setUsers(fetchedUsers)
            setRegisteredDoctorIds(doctorIds)
            setRegisteredPharmacistIds(pharmacistIds)
        } catch (error) {
            handleApiError(error, "Error al cargar usuarios")
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
        setCurrentPage(1)
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
                handleApiError(error, "Error al eliminar usuario")
            }
        }
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userToEdit) {
            try {
                const updatedUser = await updateUser(token, userToEdit.id, {
                    nombre: editForm.nombre,
                    apellido: editForm.apellido,
                    email: editForm.email,
                    telefono: editForm.telefono,
                });

                if (userToEdit.rol === 'medico' && editForm.especialidad) {
                    await updateDoctor(token, userToEdit.idEspecifico!, {
                        especialidad: editForm.especialidad,
                    });
                }

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
                handleApiError(error, "Error al actualizar usuario")
            }
        }
    }

    const handleUnassign = (user: UserDto) => {
        setUserToUnassign(user)
        setIsUnassignDialogOpen(true)
    }

    const confirmUnassign = async () => {
        if (userToUnassign) {
            try {
                if (userToUnassign.rol === 'medico' && userToUnassign.idEspecifico) {
                    await unassignDoctor(token, userToUnassign.idEspecifico)
                    setRegisteredDoctorIds(registeredDoctorIds.filter(id => id !== userToUnassign.id))
                } else if (userToUnassign.rol === 'farmaceutico' && userToUnassign.idEspecifico) {
                    await unassignPharmacist(token, userToUnassign.idEspecifico)
                    setRegisteredPharmacistIds(registeredPharmacistIds.filter(id => id !== userToUnassign.id))
                }

                setUsers(users.map(u =>
                    u.id === userToUnassign.id
                        ? { ...u, idEspecifico: undefined, especialidad: undefined }
                        : u
                ))

                toast({
                    title: "Éxito",
                    description: `${userToUnassign.rol === 'medico' ? 'Médico' : 'Farmacéutico'} desasignado exitosamente.`,
                })
            } catch (error) {
                handleApiError(error, "Error al desasignar usuario")
            }
        }
        setIsUnassignDialogOpen(false)
        setUserToUnassign(null)
    }

    return (
        <div className="space-y-4 sm:space-y-6 bg-white p-2 sm:p-4 rounded-lg">
            <h2 className="text-2xl font-bold">Usuarios Registrados</h2>
            <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
                <Select onValueChange={(value) => setSelectedRole(value as Role)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
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
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto flex-grow"
                />
            </div>
            <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="w-full text-sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">ID</TableHead>
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
                                        <TableCell className="font-medium">{user.id}</TableCell>
                                        <TableCell>{user.dni}</TableCell>
                                        <TableCell>{user.nombre}</TableCell>
                                        <TableCell>{user.apellido}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.rol}</TableCell>
                                        <TableCell>{user.idEspecifico || '-'}</TableCell>
                                        <TableCell>{user.especialidad || '-'}</TableCell>
                                        <TableCell>
                                            {user.fechaNacimiento ? user.fechaNacimiento.split('T')[0] : '-'}
                                        </TableCell>
                                        <TableCell>{user.telefono || '-'}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menú</span>
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
                                                    {((user.rol === 'medico' && registeredDoctorIds.includes(user.id)) ||
                                                        (user.rol === 'farmaceutico' && registeredPharmacistIds.includes(user.id))) && (
                                                            <DropdownMenuItem onClick={() => handleUnassign(user)}>
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
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                onPageChange={setCurrentPage}
            />
            <Modal
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="¿Estás seguro de que quieres eliminar este usuario?"
                description="Esta acción no se puede deshacer. Esto eliminará permanentemente la cuenta del usuario y eliminará sus datos de nuestros servidores."
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
                    </>
                }
            >
                <p>El usuario {userToDelete?.nombre} {userToDelete?.apellido} será eliminado permanentemente.</p>
            </Modal>
            <Modal
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                title="Editar Usuario"
                description="Actualiza la información del usuario aquí. Haz clic en guardar cuando hayas terminado."
                footer={
                    <Button type="submit" form="edit-user-form">Guardar cambios</Button>
                }
            >
                <form id="edit-user-form" onSubmit={handleEditSubmit} className="space-y-4">
                    <FormInput
                        label="Nombre"
                        id="nombre"
                        value={editForm.nombre}
                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                    />
                    <FormInput
                        label="Apellido"
                        id="apellido"
                        value={editForm.apellido}
                        onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                    />
                    <FormInput
                        label="Email"
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                    <FormInput
                        label="Teléfono"
                        id="telefono"
                        value={editForm.telefono}
                        onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                    />
                    {userToEdit?.rol === 'medico' && (
                        <FormInput
                            label="Especialidad"
                            id="especialidad"
                            value={editForm.especialidad}
                            onChange={(e) => setEditForm({ ...editForm, especialidad: e.target.value })}
                        />
                    )}
                    {userToEdit?.rol === 'paciente' && (
                        <FormInput
                            label="Fecha de Nacimiento"
                            id="fechaNacimiento"
                            type="date"
                            value={editForm.fechaNacimiento ? editForm.fechaNacimiento.split('T')[0] : ''}
                            onChange={(e) => setEditForm({ ...editForm, fechaNacimiento: e.target.value })}
                        />
                    )}
                </form>
            </Modal>
            <Modal
                isOpen={isUnassignDialogOpen}
                onClose={() => setIsUnassignDialogOpen(false)}
                title={`¿Estás seguro de que quieres desasignar a este ${userToUnassign?.rol === 'medico' ? 'médico' : 'farmacéutico'}?`}
                description="Esta acción eliminará la asignación específica del usuario."
                footer={
                    <>
                        <Button variant="outline" onClick={() => setIsUnassignDialogOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={confirmUnassign}>Desasignar</Button>
                    </>
                }
            >
                <p>El usuario {userToUnassign?.nombre} {userToUnassign?.apellido} será desasignado.</p>
            </Modal>
        </div>
    )
}

