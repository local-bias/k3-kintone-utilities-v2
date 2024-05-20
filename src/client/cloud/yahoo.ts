import { YahooShoppingClient as CommonClient } from '../../common/cloud/yahoo';
import { clientFetch } from '../lib/fetch';

export class YahooShoppingClient extends CommonClient {
  public constructor(
    params: Omit<ConstructorParameters<typeof CommonClient>[0], 'fetch'>
  ) {
    super({ ...params, fetch: clientFetch });
  }
}
