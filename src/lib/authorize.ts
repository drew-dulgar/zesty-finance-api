import type { AccountSelectable } from '../app/zesty-finance-db.types.js';
import type { AuthorizeResponseType } from './authorize.types.js';

import accessControls from '../config/authorize.js';

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


const authorize = (account: AccountSelectable): AuthorizeResponseType => {
  const authorized: AuthorizeResponseType = {
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
};

export default authorize;
export { validRoutes };