//import { toast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast"

export function handleApiError(error: unknown, customMessage?: string) {
    const { toast } = useToast()
    
    console.error('API Error:', error)
    toast({
        title: "Error",
        description: customMessage || (error instanceof Error ? error.message : "Ocurrió un error desconocido"),
        variant: "destructive",
    })
}

