
import {
  Permission,
  PermissionRole,
  Role,
  User,
} from "@prisma/client";

/**
 * Bentuk req.user setelah JwtStrategy.validate.
 * User beserta role dan daftar permission yang dimiliki role.
 */
export type AuthenticatedUser = User & {
  role: Role & {
    permissionRoles: (PermissionRole & {
      permission: Permission;
    })[];
  };
};
