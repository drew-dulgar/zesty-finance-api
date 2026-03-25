import type { Request } from 'express';

type AuthorizeActions = 'create' | 'read' | 'update' | 'delete' | string;
type AuthorizeMethods = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DESTROY';

type AuthorizeAccessControlGrantActions = '*' | AuthorizeActions | AuthorizeActions[];
type AuthorizeAccessControlGrantMethods = '*' | AuthorizeMethods | AuthorizeMethods[];

type Aliases = {
  [key: string]: {
    actions?: AuthorizeAccessControlGrantActions;
    methods?: AuthorizeAccessControlGrantMethods;
  }
}

const aliases: Aliases = {
  manage: {
    actions: ['create', 'read', 'update', 'delete'],
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DESTROY']
  }
};

type RouteGrant = {
  route: string;
  methods?: AuthorizeAccessControlGrantMethods;
};

type Grant = {
  actions?: AuthorizeAccessControlGrantActions;
  routes?: RouteGrant | RouteGrant[];
};

type AuthorizeAccessControls = {
  [key: '*' | string]: {
    selector: (params: Request) => boolean;
    grants: {
      [resource: string]: Grant;
    }
  }
}

const accessControls: AuthorizeAccessControls = {
  '*': {
    selector: () => true,
    grants: {
      account: {
        routes: { route: '/account', methods: 'GET' }
      }
    }
  },
  'not-authenticated': {
    selector: ({ authenticated }) => !authenticated,
    grants: {
      auth: {
        routes: { route: '/auth/*' }
      }
    }
  },
  authenticated: {
    selector: ({ authenticated }) => authenticated,
    grants: {
      account: {
        actions: ['update', 'delete'],
        routes: [
          { route: '/account', methods: ['PUT', 'PATCH', 'DESTROY'] },
          { route: '/account/username', methods: ['PATCH'] }
        ]
      }
    }
  },
  admin: {
    selector: ({ account }) => (account?.roles || []).some(r => r.label === 'admin'),
    grants: {
      '*': {
        actions: '*',
        routes: { route: '*', methods: '*' }
      }
    }
  }
};

export default accessControls;
export type { Grant, RouteGrant, AuthorizeAccessControls };
