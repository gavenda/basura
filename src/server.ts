import { Application } from './application';
import { Environment } from './environment';

export default {
  /**
   * Every request to a worker will start in the `fetch` method.
   * Verify the signature with the request, and dispatch to the router.
   * @param {*} request A Fetch Request object
   * @param {*} environment A map of key/value pairs with env vars and secrets from the cloudflare env.
   * @returns
   */
  async fetch(request: Request, environment: Environment, executionContext: ExecutionContext) {
    return new Application({ environment }).handleRequest(request);
  }
};
