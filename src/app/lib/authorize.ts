import type { Request } from 'express';

import accessControls from '../../config/accessControls.js';
import type { RouteGrant } from '../../config/accessControls.js';

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

const toRoutes = (val: RouteGrant | RouteGrant[]): RouteGrant[] => toArray(val);

const validRoutes: { [route: string]: string[] } = {};

for (const role in accessControls) {
  const { grants } = accessControls[role];

  for (const resource in grants) {
    const { routes } = grants[resource];
    if (!routes) continue;

    for (const routeGrant of toRoutes(routes)) {
      if (!validRoutes[routeGrant.route]) {
        validRoutes[routeGrant.route] = [];
      }

      if (routeGrant.methods) {
        validRoutes[routeGrant.route].push(...splitOrArray(routeGrant.methods));
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
        const { actions, routes } = accessControl.grants[resource];

        if (!authorized.actions[resource]) {
          authorized.actions[resource] = [];
        }

        if (actions) {
          authorized.actions[resource].push(...splitOrArray(actions));
        }

        if (routes) {
          for (const routeGrant of toRoutes(routes)) {
            if (!authorized.routes[routeGrant.route]) {
              authorized.routes[routeGrant.route] = [];
            }

            if (routeGrant.methods) {
              authorized.routes[routeGrant.route].push(...splitOrArray(routeGrant.methods));
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
