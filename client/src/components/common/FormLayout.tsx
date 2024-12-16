import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from 'react'

interface FormLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    icon?: ReactNode;
}

export function FormLayout({ title, subtitle, children, icon }: FormLayoutProps) {
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className="space-y-1">
                <div className="flex items-center justify-center space-x-2">
                    {icon && icon}
                    <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
                </div>
                {subtitle && (
                    <p className="text-center text-sm text-muted-foreground">
                        {subtitle}
                    </p>
                )}
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}

