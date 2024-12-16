import { BACKEND_SERVER } from "@/config/api";

export interface Medication {
    id: number;
    nombre: string;
    stock: number;
}

export async function fetchMedications(token: string): Promise<Medication[]> {
    const response = await fetch(`${BACKEND_SERVER}/medicines`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los medicamentos');
    }

    return response.json();
}