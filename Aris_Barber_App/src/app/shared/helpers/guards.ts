import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../shared/services/authServices';
import { Role } from '../Models/Role';


export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();


  if (!token) {
   return  router.parseUrl('/login');
   
  }

  const rolesRuta = route.data['roles'] as Role[] | undefined;

  if (rolesRuta && rolesRuta.length > 0) {
    const rolUsuario = auth.usuarioActual().rol;

    if (!rolesRuta.includes(rolUsuario)) {
      router.navigate(['/home']);
      return false;
    }
  }

  return true;
};
