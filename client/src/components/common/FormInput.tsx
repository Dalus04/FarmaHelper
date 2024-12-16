import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function FormInput({ label, id, ...props }: FormInputProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                {...props}
                className="transition duration-200 ease-in-out focus:ring-2 focus:ring-primary"
            />
        </div>
    )
}

