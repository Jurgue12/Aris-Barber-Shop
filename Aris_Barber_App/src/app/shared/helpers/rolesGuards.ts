import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/authServices';

export const RoleGuard = (rolesPermitidos: number[]): CanActivateFn => {

  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const token = auth.getToken();
    const rol = auth.usuarioActual().rol;

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    if (!rolesPermitidos.includes(rol)) {
      router.navigate(['/home']);
      return false;
    }

    return true;
  };
};
