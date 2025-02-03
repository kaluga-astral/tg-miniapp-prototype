export {
  PolicyManagerStore as PermissionsPolicyManagerStore,
  type Policy as PermissionsPolicy,
  createPolicyManagerStore as createPermissionsPolicyManagerStore,
  createRule as createPermissionRule,
  type Permission,
  SystemDenialReason as PermissionsSystemDenialReason,
  createAllowedPermission,
  createDenialPermission,
} from '@astral/permissions';
