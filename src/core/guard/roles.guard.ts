import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/constants/role";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(ctx: ExecutionContext):boolean {
        const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass()
        ]);
        if (!required || required.length === 0) return true; // 역할 지정 없으면 통과
        
        const req = ctx.switchToHttp().getRequest();
        const user = req.user as {role?: Role} | undefined;
        if (!user) throw new ForbiddenException('no user in request');

        // Admin은 모든 권한 허용
        if (user.role === Role.Admin) return true;

        if(!required.includes(user.role as Role)) {
            throw new ForbiddenException('insufficient role');
        }
        return true;
    }
}