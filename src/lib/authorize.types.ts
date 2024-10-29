export type AuthorizeResponseType = {
  authenticated: boolean;
  roles: string[];
  routes: {
    [key: string]: string[];
  }
  actions: {
    [key: string]: string[];
  }
};