import WarrantAuthorizer from '../../src/warrant/warrantAuthorizer';
import uniqueId from '../../src/util/uniqueId';

const API_KEY = '***REMOVED***';

describe('warrantAuthorizer tests', () => {
  const client = new WarrantAuthorizer(API_KEY);

  beforeAll(async () => {
    const warrants = await client.listWarrants();
    warrants.forEach(async (warrant) => {
      await client.deleteWarrant(warrant);
    });

    const permissions = await client.listPermissions();
    permissions.forEach(async (permission) => {
      await client.deletePermission(permission.permissionId);
    });

    const roles = await client.listRoles();
    roles.forEach(async (role) => {
      await client.deleteRole(role.roleId);
    });

    const objectTypes = await client.listObjectTypes();
    objectTypes.forEach(async (objectType) => {
      await client.deleteObjectType(objectType.type);
    });

    const users = await client.listUsers();
    users.forEach(async (user) => {
      await client.deleteUser(user.userId);
    });

    const tenants = await client.listTenants();
    tenants.forEach(async (tenant) => {
      await client.deleteTenant(tenant.tenantId);
    });
  }, 60000);

  test('createTenant() invalid tenantId', async () => {
    await expect(client.createTenant()).rejects.toThrow();
    await expect(client.createTenant('')).rejects.toThrow();
  });

  test('createTenant() invalid name', async () => {
    await expect(client.createTenant('test')).rejects.toThrow();
    await expect(client.createTenant('test', '')).rejects.toThrow();
  });

  test('deleteTenant() invalid tenantId', async () => {
    await expect(client.deleteTenant()).rejects.toThrow();
    await expect(client.deleteTenant('')).rejects.toThrow();
  });

  test('getTenant() invalid tenantId', async () => {
    await expect(client.getTenant()).rejects.toThrow();
    await expect(client.getTenant('')).rejects.toThrow();
    await expect(client.getTenant('invalid')).resolves.toBeNull();
  });

  test('listTenants()', async () => {
    const tenants = await client.listTenants();
    expect(tenants).toBeInstanceOf(Array);
  });

  test('createUser() invalid userId', async () => {
    await expect(client.createUser()).rejects.toThrow();
    await expect(client.createUser('')).rejects.toThrow();
  });

  test('createUser() invalid email', async () => {
    await expect(client.createUser('test')).rejects.toThrow();
    await expect(client.createUser('test', '')).rejects.toThrow();
  });

  test('deleteUser() invalid userId', async () => {
    await expect(client.deleteUser()).rejects.toThrow();
    await expect(client.deleteUser('')).rejects.toThrow();
  });

  test('getUser() invalid userId', async () => {
    await expect(client.getUser()).rejects.toThrow();
    await expect(client.getUser('')).rejects.toThrow();
    await expect(client.getUser('invalid')).resolves.toBeNull();
  });

  test('addUserToTenant() invalid userId', async () => {
    await expect(client.addUserToTenant()).rejects.toThrow();
    await expect(client.addUserToTenant('')).rejects.toThrow();
  });

  test('addUserToTenant() invalid tenantId', async () => {
    await expect(client.addUserToTenant('test')).rejects.toThrow();
    await expect(client.addUserToTenant('test', '')).rejects.toThrow();
  });

  test('createRole() invalid roleId', async () => {
    await expect(client.createRole()).rejects.toThrow();
    await expect(client.createUser('')).rejects.toThrow();
  });

  test('deleteRole() invalid roleId', async () => {
    await expect(client.deleteRole()).rejects.toThrow();
    await expect(client.deleteRole('')).rejects.toThrow();
  });

  test('getRole() invalid roleId', async () => {
    await expect(client.getRole()).rejects.toThrow();
    await expect(client.getRole('')).rejects.toThrow();
    await expect(client.getRole('invalid')).resolves.toBeNull();
  });

  test('createPermission() invalid permissionId', async () => {
    await expect(client.createPermission()).rejects.toThrow();
    await expect(client.createPermission('')).rejects.toThrow();
  });

  test('deletePermission() invalid permissionId', async () => {
    await expect(client.deletePermission()).rejects.toThrow();
    await expect(client.deletePermission('')).rejects.toThrow();
  });

  test('getPermission() invalid permissionId', async () => {
    await expect(client.getPermission()).rejects.toThrow();
    await expect(client.getPermission('')).rejects.toThrow();
    await expect(client.getPermission('invalid')).resolves.toBeNull();
  });

  test('addPermissionToRole() invalid permissionId', async () => {
    await expect(client.addPermissionToRole()).rejects.toThrow();
    await expect(client.addPermissionToRole('')).rejects.toThrow();
  });

  test('addPermissionToRole() invalid roleId', async () => {
    await expect(client.addPermissionToRole('test')).rejects.toThrow();
    await expect(client.addPermissionToRole('test', '')).rejects.toThrow();
  });

  test('addRoleToUser() invalid roleId', async () => {
    await expect(client.addRoleToUser()).rejects.toThrow();
    await expect(client.addRoleToUser('')).rejects.toThrow();
  });

  test('addRoleToUser() invalid userId', async () => {
    await expect(client.addRoleToUser('test')).rejects.toThrow();
    await expect(client.addRoleToUser('test', '')).rejects.toThrow();
  });

  test('warrantAuthorizer end-to-end test', async () => {
    await client.configureDefaultRelations();

    // create a tenant
    const tenant = await client.createTenant(uniqueId('tenant'), 'Foobar Industries');

    // create an 'admin' user and associate them with the tenant
    const adminUser = await client.createUser(uniqueId('user'), 'admin@user.com');
    await client.addUserToTenant(adminUser.userId, tenant.tenantId);
    await expect(client.getUsersByTenant(tenant.tenantId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(adminUser)]));
    await expect(client.getTenantsForUser(adminUser.userId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(tenant)]));

    // create an 'editor' user and associate them with the tenant
    const editorUser = await client.createUser(uniqueId('user'), 'editor@user.com');
    await client.addUserToTenant(editorUser.userId, tenant.tenantId);
    await expect(client.getUsersByTenant(tenant.tenantId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(editorUser)]));
    await expect(client.getTenantsForUser(editorUser.userId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(tenant)]));

    // Create a 'page-access' user and associate them with the tenant
    const pageAccessUser = await client.createUser(uniqueId('user'), 'noaccess@user.com');
    await client.addUserToTenant(pageAccessUser.userId, tenant.tenantId);
    await expect(client.getUsersByTenant(tenant.tenantId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(pageAccessUser)]));
    await expect(client.getTenantsForUser(pageAccessUser.userId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(tenant)]));

    // Create a 'no-access' user and associate them with the tenant
    const noAccessUser = await client.createUser(uniqueId('user'), 'noaccess@user.com');
    await client.addUserToTenant(noAccessUser.userId, tenant.tenantId);
    await expect(client.getUsersByTenant(tenant.tenantId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(noAccessUser)]));
    await expect(client.getTenantsForUser(noAccessUser.userId)).resolves.toEqual(expect.arrayContaining([expect.objectContaining(tenant)]));

    // create permissions
    const viewReportPermission = await client.createPermission('view-report');
    const editReportPermission = await client.createPermission('edit-report');
    const deleteReportPermission = await client.createPermission('delete-report');
    const shareReportPermission = await client.createPermission('share-report');

    // Create a "report-admin" role and assign permissions
    const reportAdminRole = await client.createRole('report-admin');
    await client.addPermissionToRole(viewReportPermission.permissionId, reportAdminRole.roleId);
    await client.addPermissionToRole(editReportPermission.permissionId, reportAdminRole.roleId);
    await client.addPermissionToRole(deleteReportPermission.permissionId, reportAdminRole.roleId);
    await client.addPermissionToRole(shareReportPermission.permissionId, reportAdminRole.roleId);

    // Create a "report-editor" role and assign permissions
    const reportEditorRole = await client.createRole('report-editor');
    await client.addPermissionToRole(viewReportPermission.permissionId, reportEditorRole.roleId);
    await client.addPermissionToRole(editReportPermission.permissionId, reportEditorRole.roleId);

    // Create a "report-admins" group and add the report-admin user
    await client.addUserToGroup(adminUser.userId, 'report-admins');

    // Verify that adminUser is a member of the 'report-admins' group and editorUser and noAccessUser are not
    await expect(client.isGroupMember(adminUser.userId, 'report-admins')).resolves.toBe(true);
    await expect(client.isGroupMember(editorUser.userId, 'report-admins')).resolves.toBe(false);
    await expect(client.isGroupMember(noAccessUser.userId, 'report-admins')).resolves.toBe(false);

    // Create a 'report-admin' role to the 'report-admin' group
    await client.addRoleToGroup(reportAdminRole.roleId, 'report-admins');

    // Create a "report-editors" group and add editorUser
    await client.addUserToGroup(editorUser.userId, 'report-editors');

    // Create a 'no-access' group and add noAccessUser
    await client.addUserToGroup(noAccessUser.userId, 'no-access');

    // Verify that editorUser is a member of the 'report-editors' group and adminUser and noAccessUser are not
    await expect(client.isGroupMember(adminUser.userId, 'report-editors')).resolves.toBe(false);
    await expect(client.isGroupMember(editorUser.userId, 'report-editors')).resolves.toBe(true);
    await expect(client.isGroupMember(noAccessUser.userId, 'report-editors')).resolves.toBe(false);

    // Add the 'report-editor' role to the 'report-editors' group
    await client.addRoleToGroup(reportEditorRole.roleId, 'report-editors');

    const reportId = uniqueId('report');

    // Share a report to the admin group
    await client.shareObjectToGroup('report', reportId, 'report-admins', 'admin');

    // Share a report to the editors group
    await client.shareObjectToGroup('report', reportId, 'report-editors', 'editor');

    // Verify admin group access to report
    await expect(client.authorizeGroup('report', reportId, 'report-admins', 'admin')).resolves.toBe(true);
    await expect(client.authorizeGroup('report', reportId, 'report-editors', 'admin')).resolves.toBe(false);
    await expect(client.authorizeGroup('report', reportId, 'no-access', 'admin')).resolves.toBe(false);

    // Verify user in admin group has access to report
    await expect(client.authorizeUser('report', reportId, adminUser.userId, 'admin')).resolves.toBe(true);
    await expect(client.authorizeUser('report', reportId, editorUser.userId, 'admin')).resolves.toBe(false);
    await expect(client.authorizeUser('report', reportId, noAccessUser.userId, 'admin')).resolves.toBe(false);

    // Verify editor group access to report
    await expect(client.authorizeGroup('report', reportId, 'report-admins', 'editor')).resolves.toBe(true);
    await expect(client.authorizeGroup('report', reportId, 'report-editors', 'editor')).resolves.toBe(true);
    await expect(client.authorizeGroup('report', reportId, 'no-access', 'editor')).resolves.toBe(false);

    // Verify user in editor group has access to report
    await expect(client.authorizeUser('report', reportId, adminUser.userId, 'editor')).resolves.toBe(true);
    await expect(client.authorizeUser('report', reportId, editorUser.userId, 'editor')).resolves.toBe(true);
    await expect(client.authorizeUser('report', reportId, noAccessUser.userId, 'editor')).resolves.toBe(false);

    // Add a page to the report
    const pageId = uniqueId('page');
    await client.associateObjectWithParent('report', reportId, 'page', pageId);

    // Verify group access to the page
    await expect(client.authorizeGroup('page', pageId, 'report-admins', 'admin')).resolves.toBe(true);
    await expect(client.authorizeGroup('page', pageId, 'report-admins', 'editor')).resolves.toBe(true);
    await expect(client.authorizeGroup('page', pageId, 'report-editors', 'admin')).resolves.toBe(false);
    await expect(client.authorizeGroup('page', pageId, 'report-editors', 'editor')).resolves.toBe(true);

    // Verify user access to the page
    await expect(client.authorizeUser('page', pageId, adminUser.userId, 'admin')).resolves.toBe(true);
    await expect(client.authorizeUser('page', pageId, adminUser.userId, 'editor')).resolves.toBe(true);
    await expect(client.authorizeUser('page', pageId, editorUser.userId, 'admin')).resolves.toBe(false);
    await expect(client.authorizeUser('page', pageId, editorUser.userId, 'editor')).resolves.toBe(true);
    await expect(client.authorizeUser('page', pageId, noAccessUser.userId, 'admin')).resolves.toBe(false);
    await expect(client.authorizeUser('page', pageId, noAccessUser.userId, 'editor')).resolves.toBe(false);
    await expect(client.authorizeUser('page', pageId, pageAccessUser.userId, 'editor')).resolves.toBe(false);

    // Share the page explicitly to page-access user
    await client.shareObjectToUser('page', pageId, pageAccessUser.userId, 'editor');
    await expect(client.authorizeUser('page', pageId, pageAccessUser.userId, 'editor')).resolves.toBe(true);
  }, 120000);
});
