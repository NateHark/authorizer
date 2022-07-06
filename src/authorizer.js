export default class Authorizer {
  constructor() {
    if (this.constructor === Authorizer) {
      throw new Error('Authorizer cannot be instantiated');
    }
  }

  // eslint-disable-next-line class-methods-use-this
  configureDefaultRelations() {
    throw new Error("Method 'configureDefaultRelations()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createObjectType(objectType) {
    throw new Error("Method 'createObjectType()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  deleteObjectType(type) {
    throw new Error("Method 'deleteObjectType()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getObjectType(type) {
    throw new Error("Method 'getObjectType()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  listObjectTypes() {
    throw new Error("Method 'listObjectTypes()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  updateObjectType(objectType) {
    throw new Error("Method 'updateObjectType()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createTenant(tenantId, name) {
    throw new Error("Method 'createTenant()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  deleteTenant(tenantId) {
    throw new Error("Method 'deleteTenant()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getTenant(tenantId) {
    throw new Error("Method 'getTenant()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  listTenants() {
    throw new Error("Method 'listTenants()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getUsersByTenant(tenantId) {
    throw new Error("Method 'getUsersByTenant()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createUser(userId, email) {
    throw new Error("Method 'createUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  deleteUser(userId) {
    throw new Error("Method 'deleteUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getUser(userId) {
    throw new Error("Method 'getUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this
  listUsers() {
    throw new Error("Method 'listUsers()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  addUserToTenant(userId, tenantId) {
    throw new Error("Method 'addUserToTentant()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getTenantsForUser(userId) {
    throw new Error("Method 'getTenantsByUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createRole(roleId) {
    throw new Error("Method 'createRole()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  deleteRole(roleId) {
    throw new Error("Method 'deleteRole()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getRole(roleId) {
    throw new Error("Method 'getRole()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  listRoles() {
    throw new Error("Method 'listRoles()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createPermission(permissionId) {
    throw new Error("Method 'createPermission()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  deletePermission(permissionId) {
    throw new Error("Method 'deletePermission()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  getPermission(permissionId) {
    throw new Error("Method 'getPermission()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  listPermissions() {
    throw new Error("Method 'listPermission()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  addPermissionToRole(permissionId, roleId) {
    throw new Error("Method 'addPermissionToRole()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  addRoleToUser(roleId, userId) {
    throw new Error("Method 'addRoleToUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  addUserToGroup(userId, groupId) {
    throw new Error("Method 'addUserToGroup()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  isGroupMember(userId, groupId) {
    throw new Error("Method 'isGroupMember()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  userHasRole(userId, roleId) {
    throw new Error("Method 'userHasRole()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  addRoleToGroup(roleId, groupId) {
    throw new Error("Method 'addRoleToGroup()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  groupHasRole(userId, groupId) {
    throw new Error("Method 'groupHasRole()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  shareObjectToGroup(objectType, objectId, groupId, relation) {
    throw new Error("Method 'shareObjectToGroup()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  shareObjectToUser(objectType, objectId, userId, relation) {
    throw new Error("Method 'shareObjectToUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  authorizeGroup(objectType, objectId, groupId, relation) {
    throw new Error("Method 'authorizeGroup()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  authorizeUser(objectType, objectId, userId, relation) {
    throw new Error("Method 'authorizeUser()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  associateObjectWithParent(parentObjectType, parentObjectId, childObjectType, childObjectId) {
    throw new Error("Method 'associateObjectWithParent()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  listWarrants() {
    throw new Error("Method 'listWarrants()' must be implemented");
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  deleteWarrant(warrant) {
    throw new Error("Method 'deleteWarrant()' must be implemented");
  }
}
