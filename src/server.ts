import { Application } from './application';

export default {
  /**
   * Every request to a worker will start in the `fetch` method.
   * Verify the signature with the request, and dispatch to the router.
   * @param {*} request A Fetch Request object
   * @param {*} env A map of key/value pairs with env vars and secrets from the cloudflare env.
   * @returns
   */
  async fetch(request: Request, env: Env, executionContext: ExecutionContext) {
    return new Application({ env, executionContext }).handleRequest(request);
  }
};
