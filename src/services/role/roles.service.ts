import { Role } from '../../domain/roles';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { roles as RolesData } from '../../core/utils/RolesDefinition';

export const uploadRolesServices = async () => {
  const rolesCollection = collection(db, 'roles');
  for (const role of RolesData) {
    await addDoc(rolesCollection, role);
  }
};

export const getRolesServices = async () => {
  const rolesCollection = collection(db, 'roles');
  const querySnapshot = await getDocs(rolesCollection);
  const roles: Role[] = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      permissions: data.permissions,
      inheritsFrom: data.inheritsFrom,
    };
  });
  return roles;
};

export const resolvePermissions = async (roleId: string): Promise<string[]> => {
  const roleRef = collection(db, `roles/${roleId}`);
  const roleSnap = await getDocs(roleRef);

  if (!roleSnap.docs.length) {
    throw new Error(`Rol con ID ${roleId} no encontrado`);
  }

  const roleData = roleSnap.docs[0].data();

  // Recoge los permisos actuales
  let permissions = [...roleData.permissions];

  // Si hereda de otro rol, agrega los permisos heredados
  if (roleData.inheritsFrom) {
    const inheritedPermissions = await resolvePermissions(
      roleData.inheritsFrom
    );
    permissions = [...new Set([...permissions, ...inheritedPermissions])]; // Evita duplicados
  }

  return permissions;
};

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  const userRef = collection(db, `users/${userId}`);
  const userSnap = await getDocs(userRef);

  if (!userSnap.docs.length) {
    throw new Error(`Usuario con ID ${userId} no encontrado`);
  }

  const userData = userSnap.docs[0].data();
  const roles = userData.roles || []; // Referencias a roles

  let allPermissions: string[] = [];

  for (const roleRef of roles) {
    const roleId = roleRef.id;
    const rolePermissions = await resolvePermissions(roleId);
    allPermissions = [...new Set([...allPermissions, ...rolePermissions])]; // Evita duplicados
  }

  return allPermissions;
};

export const checkPermission = async (
  userId: string,
  requiredPermission: string
) => {
  const permissions = await getUserPermissions(userId);

  if (permissions.includes(requiredPermission)) {
    console.log('Permiso concedido:', requiredPermission);
    return true;
  }

  console.log('Permiso denegado:', requiredPermission);
  return false;
};

uploadRolesServices();
