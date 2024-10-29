import type { AccountSelectable } from '../app/zesty-finance-db.types.js';

enum AuthorizeActions {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete'
};

enum AuthorizeMethods {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DESTROY = 'DESTROY'
};

type AuthorizeAccessControls = {
  [key: '*' | string]: {
    selector: (params: AccountSelectable) => boolean;
    grants: {
      [key: string]: {
        actions?: AuthorizeAccessControlGrantActions;
        route: string;
        methods: AuthorizeAccessControlGrantMethods;
      }
    }
  }
}

type AuthorizeAccessControlGrantActions = '*' | keyof typeof AuthorizeActions | Array<keyof typeof AuthorizeActions>;
type AuthorizeAccessControlGrantMethods = '*' | keyof typeof AuthorizeMethods | Array<keyof typeof AuthorizeMethods>;

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
    selector: ({ id }) => !id,
    grants: {
      login: {
        route: '/account/auth',
        methods: 'POST'
      },
      register: {
        route: '/account/register',
        methods: 'POST'
      }
    }
  },
  authenticated: {
    selector: ({ id }) => Boolean(id),
    grants: {
      logout: {
        route: '/account/auth',
        methods: 'DESTROY'
      },
      account: {
        actions: aliases.manage.actions || [],
        route: '/account',
        methods: aliases.manage.methods || []
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


