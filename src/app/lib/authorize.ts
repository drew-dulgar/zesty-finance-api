import type { Request } from 'express';

import accessControls from '../../config/accessControls.js';
import type { Grant } from '../../config/accessControls.js';

export type AuthorizedResponseType = {
  roles: string[];
  routes: {
    [key: string]: string[];
  }
  actions: {
    [key: string]: string[];
  }
};

const toArray = <T>(val: T | T[]): T[] => Array.isArray(val) ? val : [val];
const splitOrArray = (val: string | string[]): string[] => Array.isArray(val) ? val : val.split(',');

const toGrants = (val: Grant | Grant[]): Grant[] => toArray(val);

const validRoutes: { [route: string]: string[] } = {};

for (const role in accessControls) {
  const { grants } = accessControls[role];

  for (const resource in grants) {
    for (const grant of toGrants(grants[resource])) {
      if (!grant.route) continue;

      if (!validRoutes[grant.route]) {
        validRoutes[grant.route] = [];
      }

      if (grant.methods) {
        validRoutes[grant.route].push(...splitOrArray(grant.methods));
      }
    }
  }
}

const authorize = (req: Request): AuthorizedResponseType => {
  const authorized: AuthorizedResponseType = {
    roles: [],
    routes: {},
    actions: {}
  };

  for (const role in accessControls) {
    const accessControl = accessControls[role];

    if (accessControl.selector(req)) {
      authorized.roles.push(role);

      for (const resource in accessControl.grants) {
        if (!authorized.actions[resource]) {
          authorized.actions[resource] = [];
        }

        for (const grant of toGrants(accessControl.grants[resource])) {
          if (grant.actions) {
            authorized.actions[resource].push(...splitOrArray(grant.actions));
          }

          if (grant.route) {
            if (!authorized.routes[grant.route]) {
              authorized.routes[grant.route] = [];
            }

            if (grant.methods) {
              authorized.routes[grant.route].push(...splitOrArray(grant.methods));
            }
          }
        }
      }
    }
  }

  return authorized;
};

export default authorize;
export { validRoutes };
