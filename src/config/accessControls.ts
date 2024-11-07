import type { Request } from 'express';

type AuthorizeActions = 'create' | 'read' | 'update' | 'delete' | string;
type AuthorizeMethods = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DESTROY';

type AuthorizeAccessControlGrantActions = '*' | AuthorizeActions | AuthorizeActions[];
type AuthorizeAccessControlGrantMethods = '*' | AuthorizeMethods | AuthorizeMethods[];

type AuthorizeAccessControls = {
  [key: '*' | string]: {
    selector: (params: Request) => boolean;
    grants: {
      [key: string]: {
        actions?: AuthorizeAccessControlGrantActions;
        route: string;
        methods: AuthorizeAccessControlGrantMethods;
      }
    }
  }
}

type Aliases = {
  [key: string]: {
    actions?: AuthorizeAccessControlGrantActions;
    methods?: AuthorizeAccessControlGrantMethods;
  }
}

const aliases: Aliases = {
  manage: {
    actions: [
      'create',
      'read',
      'update',
      'delete'
    ],
    methods: [
      'POST',
      'GET',
      'PUT',
      'PATCH',
      'DESTROY'
    ]
  }
};

const accessControls: AuthorizeAccessControls = {
  '*': {
    selector: () => true,
    grants: {
      account: {
        actions: 'read',
        route: '/account',
        methods: 'GET'
      }
    }
  },
  'not-authenticated': {
    selector: ({ authenticated }) => !authenticated,
    grants: {
      auth: {
        route: '/account/auth',
        methods: 'POST',
        actions: 'authenticate'
      },
      account: {
        route: '/account',
        methods: 'POST',
        actions: ['create', 'recover-password'],
      }
    }
  },
  authenticated: {
    selector: ({ authenticated }) => authenticated,
    grants: {
      logout: {
        route: '/account/auth',
        methods: 'DESTROY'
      },
      account: {
        route: '/account',
        actions: ['update', 'delete'],
        methods: ['PUT', 'PATCH', 'DESTROY']
      }
    }
  },
  admin: {
    //selector: ({ accountRoles }) => (accountRoles || []).includes('admin'),
    selector: () => false,
    grants: {
      '*': {
        actions: '*',
        route: '*',
        methods: '*'
      }
    }
  }
};

export default accessControls;


