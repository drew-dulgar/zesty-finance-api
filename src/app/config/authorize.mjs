const actions = {
  manage: [
    'create',
    'read',
    'update',
    'delete'
  ]
};

const methods = {
  manage: [
    'POST',
    'GET',
    'PUT',
    'PATCH',
    'DESTROY',
  ]
};

const accessControls = {
  '*': {
    selector: () => true,
    grants: {
      account: {
        actions: 'read',
        route: '/account',
        methods: 'GET',
      }
    }
  },
  'not-authenticated': {
    selector: ({ id }) => !Boolean(id),
    grants: {
      login: {
        route: '/account/auth',
        methods: 'POST'
      },
      register: {
        route: '/account/register',
        methods: 'POST',
      }
    }
  },
  authenticated: {
    selector: ({ id }) => Boolean(id),
    grants: {
      logout: {
        route: '/account/auth',
        methods: 'DELETE'
      },
      account: {
        actions: actions.manage,
        route: '/account',
        methods: methods.manage,
      }
    }
  },
  admin: {
    selector: ({ accountRoles }) => (accountRoles || []).includes('admin'),
    grants: {
      '*': {
        actions: '*',
        route: '*',
        methods: '*'
      }
    }
  }
};

const validRoutes = {};

for (const role in accessControls) {
  const accessControl = accessControls[role];

  for (const resource in accessControl.grants) {
    const grant = accessControl.grants[resource];

    if (!validRoutes?.[grant.route]) {
      validRoutes[grant.route] = [];
    }

    if (typeof grant?.methods !== 'undefined') {
      validRoutes[grant.route].push(
        ...Array.isArray(grant.methods) ? grant.methods : grant.methods.split(',')
      );
    }
  }
}

const authorize = (account = {}) => {
  const authorized = {
    authenticated: false,
    roles: [],
    routes: {},
    actions: {}
  };


  for (const role in accessControls) {
    const accessControl = accessControls[role];

    if (accessControl.selector(account)) {
      authorized.roles.push(role);
      
      for (const resource in accessControl.grants) {
        const grant = accessControl.grants[resource];
        
        // Actions
        if (typeof authorized.actions?.[resource] === 'undefined') {
          authorized.actions[resource] = [];
        }

        if (typeof grant.actions !== 'undefined') {
          authorized.actions[resource].push(
            ...Array.isArray(grant.actions) ? grant.actions : grant.actions.split(',')
          )
        }

        // Routes
        if (typeof authorized.routes?.[grant.route] === 'undefined') {
          authorized.routes[grant.route] = [];
        }

        if (typeof grant.methods !== 'undefined') {
          authorized.routes[grant.route].push(
            ...Array.isArray(grant.methods) ? grant.methods : grant.methods.split(',')
          );
        }
      }
    }
  }

  authorized.authenticated = authorized.roles.includes('authenticated');

  return authorized;
}

export default authorize;
export { validRoutes };

