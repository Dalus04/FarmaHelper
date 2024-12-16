import { BACKEND_SERVER } from "@/config/api";

export interface CreateNotificationDto {
    idReceta: number;
    idPaciente: number;
    estado: string;
}

export async function createNotification(token: string, createNotificationDto: CreateNotificationDto): Promise<any> {
    const response = await fetch(`${BACKEND_SERVER}/notifications/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(createNotificationDto)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la notificación');
    }

    return response.json();
}