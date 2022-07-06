// eslint-disable-next-line import/no-unresolved
import got from 'got';
import Authorizer from '../authorizer';
import Permission from '../model/permission';
import Role from '../model/role';
import Tenant from '../model/tenant';
import User from '../model/user';
import Warrant from '../model/warrant';
import requiredString from '../util/validators';

export default class WarrantAuthorizer extends Authorizer {
  constructor(apiKey) {
    super();

    this.client = got.extend({
      prefixUrl: 'https://api.warrant.dev/v1',
      headers: {
        Authorization: `ApiKey ${apiKey}`,
      },
      responseType: 'json',
      throwHttpErrors: false,
    });
  }

  async configureDefaultRelations() {
    let tenant = await this.getObjectType('tenant');
    if (tenant == null) {
      tenant = await this.createObjectType({
        type: 'tenant',
        relations: {
          owner: {},
          member: {
            type: 'anyOf',
            rules: [
              {
                type: 'userset',
                relation: 'owner',
              },
            ],
          },
        },
      });
    }

    let group = await this.getObjectType('group');
    if (group == null) {
      group = await this.createObjectType({
        type: 'group',
        relations: {
          member: {},
        },
      });
    }

    let user = await this.getObjectType('user');
    if (user == null) {
      user = await this.createObjectType({
        type: 'user',
        relations: {
          parent: {},
        },
      });
    }

    let permission = await this.getObjectType('permission');
    if (permission == null) {
      permission = await this.createObjectType({
        type: 'permission',
        relations: {
          owner: {},
          parent: {},
          member: {
            type: 'anyOf',
            rules: [
              {
                type: 'objectUserset',
                relation: 'parent',
                userset: {
                  type: 'userset',
                  relation: 'member',
                },
              },
            ],
          },
        },
      });
    }

    let role = await this.getObjectType('role');
    if (role == null) {
      role = await this.createObjectType({
        type: 'role',
        relations: {
          owner: {},
          member: {
            type: 'anyOf',
            rules: [
              {
                type: 'objectUserset',
                relation: 'parent',
                userset: {
                  type: 'userset',
                  relation: 'member',
                },
              },
            ],
          },
        },
      });
    }

    let report = await this.getObjectType('report');
    if (report == null) {
      report = await this.createObjectType({
        type: 'report',
        relations: {
          admin: {},
          editor: {
            type: 'anyOf',
            rules: [
              {
                type: 'userset',
                relation: 'admin',
              },
            ],
          },
        },
      });
    }

    let page = await this.getObjectType('page');
    if (page == null) {
      page = await this.createObjectType({
        type: 'page',
        relations: {
          parent: {},
          admin: {
            type: 'anyOf',
            rules: [
              {
                type: 'objectUserset',
                relation: 'parent',
                userset: {
                  type: 'userset',
                  relation: 'admin',
                },
              },
            ],
          },
          editor: {
            type: 'anyOf',
            rules: [
              {
                type: 'userset',
                relation: 'admin',
              },
              {
                type: 'objectUserset',
                relation: 'parent',
                userset: {
                  type: 'userset',
                  relation: 'editor',
                },
              },
            ],
          },
        },
      });
    }
  }

  async createObjectType(objectType) {
    if ((await this.getObjectType(objectType.type)) != null) {
      throw new Error(`objectType ${objectType.type} already exists`);
    }

    const response = await this.client.post('object-types', {
      json: {
        ...objectType,
      },
    });

    if (response.ok) {
      return response.body;
    }

    throw new Error(`Unexpected error creating objectType ${objectType.type} with status ${response.statusCode}: ${response.body.message}`);
  }

  async deleteObjectType(type) {
    requiredString('type', type);

    const response = await this.client.delete(`object-types/${type}`);

    if (!response.ok) {
      throw new Error(`Unexpected error deleting objectType ${type} with status ${response.statusCode}`);
    }
  }

  async getObjectType(type) {
    requiredString('type', type);

    const response = await this.client.get(`object-types/${type}`);

    if (response.ok) {
      return response.body;
    }

    if (response.statusCode === 404) {
      return null;
    }

    throw new Error(`Unexpected error getting objectType ${type} with status ${response.statusCode}`);
  }

  async listObjectTypes() {
    const response = await this.client.get('object-types');

    if (response.ok) {
      return response.body;
    }

    throw new Error(`Unexpected error fetching objectTypes with status ${response.statusCode}`);
  }

  async updateObjectType(objectType) {
    if ((await this.getObjectType(objectType.type)) == null) {
      throw new Error(`objectType ${objectType.type} does not exist`);
    }

    const response = await this.client.put(`object-types/${objectType.type}`, {
      json: {
        ...objectType,
      },
    });

    if (response.ok) {
      return response.body;
    }

    throw new Error(`Unexpected error updating objectType ${objectType.type} with status ${response.statusCode}`);
  }

  async createTenant(tenantId, name) {
    requiredString('tenantId', tenantId);
    requiredString('name', name);

    const tenant = await this.getTenant(tenantId);
    if (tenant != null) {
      return tenant;
    }

    const response = await this.client.post('tenants', {
      json: {
        tenantId,
        name,
      },
    });

    if (response.ok) {
      return new Tenant(tenantId, name);
    }

    throw new Error(`Unexpected error creating tenant with id ${tenantId}, with status ${response.statusCode}`);
  }

  async deleteTenant(tenantId) {
    requiredString('tenantId', tenantId);

    const response = await this.client.delete(`tenants/${tenantId}`);

    if (!response.ok) {
      throw new Error(`Unexpected error deleting tenant with id ${tenantId}, with status ${response.statusCode}`);
    }
  }

  async getTenant(tenantId) {
    requiredString('tenantId', tenantId);

    const response = await this.client.get(`tenants/${tenantId}`);

    if (response.ok) {
      return new Tenant(response.body.tenantId, response.body.name);
    }

    if (response.statusCode === 404) {
      return null;
    }

    throw new Error(`Unexpected error fetching tenant with id ${tenantId}, with status ${response.statusCode}`);
  }

  async listTenants() {
    const response = await this.client.get('tenants');

    if (response.ok) {
      return response.body.map((record) => new Tenant(record.tenantId, record.name));
    }

    throw new Error(`Unexpected error fetching tenants with status ${response.statusCode}`);
  }

  async getUsersByTenant(tenantId) {
    requiredString('tenantId', tenantId);

    const response = await this.client.get(`tenants/${tenantId}/users`);
    if (response.ok) {
      return response.body.map((record) => new User(record.userId, record.email));
    }

    throw new Error(`Unexpected error fetching users for tenant ${tenantId} with status ${response.statusCode}`);
  }

  async createUser(userId, email) {
    requiredString('userId', userId);
    requiredString('email', email);

    const user = await this.getUser(userId);
    if (user != null) {
      return user;
    }

    const response = await this.client.post('users', {
      json: {
        userId,
        email,
      },
    });

    if (response.ok) {
      return new User(userId, email);
    }

    throw new Error(`Unexpected error creating tenant with id ${userId}, with status ${response.statusCode}`);
  }

  async deleteUser(userId) {
    requiredString('userId', userId);

    const response = await this.client.delete(`users/${userId}`);

    if (!response.ok) {
      throw new Error(`Unexpected error deleting user with id ${userId}, with status ${response.statusCode}`);
    }
  }

  async getUser(userId) {
    requiredString('userId', userId);

    const response = await this.client.get(`users/${userId}`);

    if (response.ok) {
      return new User(response.body.userId, response.body.email);
    }

    if (response.statusCode === 404) {
      return null;
    }

    throw new Error(`Unexpected error fetching user with id ${userId}, with status ${response.statusCode}`);
  }

  async listUsers() {
    const response = await this.client.get('users');

    if (response.ok) {
      return response.body.map((record) => new User(record.userId, record.email));
    }

    throw new Error(`Unexpected error fetching users with status ${response.statusCode}`);
  }

  async addUserToTenant(userId, tenantId) {
    requiredString('userId', userId);
    requiredString('tenantId', tenantId);

    const response = await this.client.post(`tenants/${tenantId}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Unexpected error adding user ${userId} to tenant ${tenantId}`);
    }
  }

  async getTenantsForUser(userId) {
    requiredString('userId', userId);

    const response = await this.client.get(`users/${userId}/tenants`);
    if (response.ok) {
      return response.body.map((record) => new Tenant(record.tenantId, record.name));
    }

    throw new Error(`Unexpected error fetching tenants for user ${userId} with status ${response.statusCode}`);
  }

  async createRole(roleId) {
    requiredString('roleId', roleId);

    const role = await this.getRole(roleId);
    if (role != null) {
      return role;
    }

    const response = await this.client.post('roles', {
      json: {
        roleId,
      },
    });
    if (response.ok) {
      return new Role(roleId);
    }

    throw new Error(`Unexpected error adding role ${roleId} with status ${response.statusCode}`);
  }

  async deleteRole(roleId) {
    requiredString('roleId', roleId);

    const response = await this.client.delete(`roles/${roleId}`);
    if (response.ok) {
      return;
    }

    throw new Error(`Unexpected error deleting role ${roleId} with status ${response.statusCode}`);
  }

  async getRole(roleId) {
    requiredString('roleId', roleId);

    const response = await this.client.get(`roles/${roleId}`);
    if (response.ok) {
      return new Role(response.body.roleId);
    }

    if (response.statusCode === 404) {
      return null;
    }

    throw new Error(`Unexpected error fetching role ${roleId} with status ${response.statusCode}`);
  }

  async listRoles() {
    const response = await this.client.get('roles');

    if (response.ok) {
      return response.body.map((role) => new Role(role.roleId));
    }

    throw new Error(`Unexpected error fetching roles with status ${response.statusCode}`);
  }

  async createPermission(permissionId) {
    requiredString('permissionId', permissionId);

    const permission = await this.getPermission(permissionId);
    if (permission != null) {
      return permission;
    }

    const response = await this.client.post('permissions', {
      json: {
        permissionId,
      },
    });
    if (response.ok) {
      return new Permission(permissionId);
    }

    throw new Error(`Unexpected error adding permission ${permissionId} with status ${response.statusCode}`);
  }

  async deletePermission(permissionId) {
    requiredString('permissionId', permissionId);

    const response = await this.client.delete(`permissions/${permissionId}`);
    if (response.ok) {
      return;
    }

    throw new Error(`Unexpected error deleting permission ${permissionId} with status ${response.statusCode}`);
  }

  async getPermission(permissionId) {
    requiredString('permissionId', permissionId);

    const response = await this.client.get(`permissions/${permissionId}`);
    if (response.ok) {
      return new Permission(response.body.permissionId);
    }

    if (response.statusCode === 404) {
      return null;
    }

    throw new Error(`Unexpected error fetching permission ${permissionId} with status ${response.statusCode}`);
  }

  async listPermissions() {
    const response = await this.client.get('permissions');

    if (response.ok) {
      return response.body.map((permission) => new Permission(permission.permissionId));
    }

    throw new Error(`Unexpected error fetching roles with status ${response.statusCode}`);
  }

  async addPermissionToRole(permissionId, roleId) {
    requiredString('roleId', roleId);
    requiredString('permissionId', permissionId);

    const response = await this.client.post(`roles/${roleId}/permissions/${permissionId}`);

    if (!response.ok) {
      throw new Error(`Unexpected error adding permission ${permissionId} to role ${roleId} with status ${response.statusCode}`);
    }
  }

  async addRoleToUser(roleId, userId) {
    requiredString('roleId', roleId);
    requiredString('userId', userId);

    const response = await this.client.post(`users/${userId}/roles/${roleId}`);

    if (!response.ok) {
      throw new Error(`Unexpected error adding role ${roleId} to user ${userId} with status ${response.statusCode}`);
    }
  }

  async addUserToGroup(userId, groupId) {
    requiredString('userId', userId);
    requiredString('groupId', groupId);

    const response = await this.client.post('warrants', {
      json: {
        objectType: 'group',
        objectId: groupId,
        relation: 'member',
        subject: {
          objectType: 'user',
          objectId: userId,
        },
      },
    });

    if (response.ok) {
      return;
    }

    throw new Error(`Unexpected error adding user ${userId} to group ${groupId} with status ${response.statusCode}`);
  }

  async isGroupMember(userId, groupId) {
    requiredString('userId', userId);
    requiredString('groupId', groupId);

    const response = await this.client.post('authorize', {
      json: {
        objectType: 'group',
        objectId: groupId,
        relation: 'member',
        subject: {
          objectType: 'user',
          objectId: userId,
        },
      },
    });

    if (response.ok) {
      return true;
    }

    if (response.statusCode === 401) {
      return false;
    }

    throw new Error(`Unexpected error checking if user ${userId} is member of group ${groupId}`);
  }

  async userHasRole(userId, roleId) {
    requiredString('userId', userId);
    requiredString('roleId', roleId);

    const response = await this.client.post('authorize', {
      json: {
        objectType: 'role',
        objectId: roleId,
        relation: 'member',
        subject: {
          objectType: 'user',
          objectId: userId,
        },
      },
    });

    if (response.ok) {
      return true;
    }

    if (response.statusCode === 401) {
      return false;
    }

    throw new Error(`Unexpected error checking if user ${userId} has role ${roleId}`);
  }

  async addRoleToGroup(roleId, groupId) {
    requiredString('roleId', groupId);
    requiredString('groupId', groupId);

    const response = await this.client.post('warrants', {
      json: {
        objectType: 'role',
        objectId: roleId,
        relation: 'member',
        subject: {
          objectType: 'group',
          objectId: groupId,
        },
      },
    });

    if (response.ok) {
      return;
    }

    throw new Error(`Unexpected error adding role ${roleId} to group ${groupId} with status ${response.statusCode}`);
  }

  async groupHasRole(groupId, roleId) {
    requiredString('groupId', groupId);
    requiredString('roleId', roleId);

    const response = await this.client.post('authorize', {
      json: {
        objectType: 'role',
        objectId: roleId,
        relation: 'member',
        subject: {
          objectType: 'group',
          objectId: groupId,
        },
      },
    });

    if (response.ok) {
      return true;
    }

    if (response.statusCode === 401) {
      return false;
    }

    throw new Error(`Unexpected error checking if group ${groupId} has role ${roleId}`);
  }

  async shareObjectToGroup(objectType, objectId, groupId, relation) {
    requiredString('objectType', objectType);
    requiredString('objectId', objectId);
    requiredString('groupId', groupId);
    requiredString('relation', relation);

    const response = await this.client.post('warrants', {
      json: {
        objectType,
        objectId,
        relation,
        user: {
          objectType: 'group',
          objectId: groupId,
          relation: 'member',
        },
      },
    });

    if (response.ok) {
      return;
    }

    throw new Error(`Unexpected error sharing ${objectType}:${objectId} with group ${groupId} with status ${response.statusCode}`);
  }

  async shareObjectToUser(objectType, objectId, userId, relation) {
    requiredString('objectType', objectType);
    requiredString('objectId', objectId);
    requiredString('userId', userId);
    requiredString('relation', relation);

    const response = await this.client.post('warrants', {
      json: {
        objectType,
        objectId,
        relation,
        subject: {
          objectType: 'user',
          objectId: userId,
        },
      },
    });

    if (response.ok) {
      return;
    }

    throw new Error(`Unexpected error sharing ${objectType}:${objectId} with group ${userId} with status ${response.statusCode}: ${response.body.message}`);
  }

  async authorizeGroup(objectType, objectId, groupId, relation) {
    requiredString('objectType', objectType);
    requiredString('objectId', objectId);
    requiredString('groupId', groupId);
    requiredString('relation', relation);

    const response = await this.client.post('authorize', {
      json: {
        objectType,
        objectId,
        relation,
        subject: {
          objectType: 'group',
          objectId: groupId,
          relation: 'member',
        },
      },
    });

    if (response.ok) {
      return true;
    }

    if (response.statusCode === 401) {
      return false;
    }

    throw new Error(`Unexpected error authorizing ${objectType}:${objectId} for group ${groupId} with status ${response.statusCode}`);
  }

  async authorizeUser(objectType, objectId, userId, relation) {
    requiredString('objectType', objectType);
    requiredString('objectId', objectId);
    requiredString('userId', userId);
    requiredString('relation', relation);

    const response = await this.client.post('authorize', {
      json: {
        objectType,
        objectId,
        relation,
        subject: {
          objectType: 'user',
          objectId: userId,
        },
      },
    });

    if (response.ok) {
      return true;
    }

    if (response.statusCode === 401) {
      return false;
    }

    throw new Error(`Unexpected error authorizing ${objectType}:${objectId} for user ${userId} with status ${response.statusCode}`);
  }

  async associateObjectWithParent(parentObjectType, parentObjectId, childObjectType, childObjectId) {
    requiredString('parentObjectType', parentObjectType);
    requiredString('parentObjectId', parentObjectId);
    requiredString('childObjectType', childObjectType);
    requiredString('childObjectId', childObjectId);

    const response = await this.client.post('warrants', {
      json: {
        objectType: childObjectType,
        objectId: childObjectId,
        relation: 'parent',
        subject: {
          objectType: parentObjectType,
          objectId: parentObjectId,
        },
      },
    });

    if (response.ok) {
      return;
    }

    throw new Error(
      `Unexpected error associating ${parentObjectType}:${parentObjectId} as parent of ${childObjectType}:${childObjectId} with status ${response.statusCode}: ${response.body.message}`
    );
  }

  async listWarrants() {
    const response = await this.client.get('warrants?limit=100');

    if (response.ok) {
      return response.body.map((record) => new Warrant(record.objectType, record.objectId, record.relation, record.subject));
    }

    throw new Error(`Unexpected error fetching warrants with status ${response.statusCode}`);
  }

  async deleteWarrant(warrant) {
    const response = await this.client.delete('warrants', {
      json: {
        objectType: warrant.objectType,
        objectId: warrant.objectId,
        relation: warrant.relation,
        subject: warrant.subject,
      },
    });

    if (response.ok || response.statusCode === 404) {
      return;
    }

    throw new Error(`Unexpected error deleting warrant with status ${response.statusCode}: ${response.body.message}`);
  }
}
