import { BACKEND_SERVER } from "@/config/api";

export async function fetchRegisteredPharmacists(token: string): Promise<number[]> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/pharmacist`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch registered pharmacists');
        }
        const pharmacists = await response.json();
        return pharmacists.map((pharmacist: any) => pharmacist.usuario.id);
    } catch (error) {
        console.error('Error fetching registered pharmacists:', error);
        throw error;
    }
}

export async function registerPharmacist(token: string, userId: number): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/pharmacist/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId })
        });
        if (!response.ok) {
            throw new Error('Failed to register pharmacist');
        }
    } catch (error) {
        console.error('Error registering pharmacist:', error);
        throw error;
    }
}

export async function unassignPharmacist(token: string, pharmacistId: number): Promise<void> {
    try {
        const response = await fetch(`${BACKEND_SERVER}/pharmacist/${pharmacistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to unassign pharmacist');
        }
    } catch (error) {
        console.error('Error unassigning pharmacist:', error);
        throw error;
    }
}

