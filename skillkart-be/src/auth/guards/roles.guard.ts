import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    console.log('RolesGuard - Required roles:', requiredRoles);
    console.log('RolesGuard - User role:', user?.role);
    console.log('RolesGuard - User object:', user);
    
    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('RolesGuard - Has required role:', hasRole);
    
    return hasRole;
  }
} 