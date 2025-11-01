export type AppRole = 'ADMIN' | 'DIRECTOR' | 'LEADER' | 'USER' | 'MEMBER' | string;

// Role groups
export const ADMIN_ROLES: AppRole[] = ['ADMIN', 'DIRECTOR'];
export const STAFF_ROLES: AppRole[] = ['LEADER', ...ADMIN_ROLES];

export function normalizeRole(role?: string | null): AppRole | null {
  return role ? (role.toUpperCase() as AppRole) : null;
}

export function hasAnyRole(userRole?: string | null, allowed: AppRole[] = []): boolean {
  const r = normalizeRole(userRole);
  if (!r) return false;
  return allowed.map(normalizeRole).includes(r);
}

export function isAdmin(userRole?: string | null): boolean {
  return hasAnyRole(userRole, ADMIN_ROLES);
}
