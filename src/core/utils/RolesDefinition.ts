import { Role } from '../../domain/roles';

export const roles: Role[] = [
  {
    id: 'pastorGeneral',
    name: 'Pastor General',
    permissions: ['manageAll', 'viewAll'],
    inheritsFrom: null,
  },
  {
    id: 'pastorMinisterial',
    name: 'Pastor Ministerial',
    permissions: ['manageArea', 'viewAll'],
    inheritsFrom: 'pastorGeneral',
  },
  {
    id: 'liderDeCartera',
    name: 'Líder de Cartera',
    permissions: ['manageArea'],
    inheritsFrom: 'pastorMinisterial',
  },
  {
    id: 'administrador',
    name: 'Administrador',
    permissions: ['manageFinances', 'viewAll'],
    inheritsFrom: 'pastorGeneral',
  },
  {
    id: 'servidor',
    name: 'Servidor',
    permissions: ['serve'],
    inheritsFrom: null,
  },
  {
    id: 'miembro',
    name: 'Miembro',
    permissions: ['attend'],
    inheritsFrom: null,
  },
];
