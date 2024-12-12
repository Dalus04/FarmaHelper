import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        const {user} = context.switchToHttp().getRequest();
        if (!requiredRoles.includes(user.rol)) {
            throw new ForbiddenException('No tienes permisos para acceder a esta acción');
        }

        return true;
    }
}