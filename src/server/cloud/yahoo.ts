import { YahooShoppingClient as CommonClient } from '../../common/cloud/yahoo';

export class YahooShoppingClient extends CommonClient {
  public constructor(
    params: Omit<ConstructorParameters<typeof CommonClient>[0], 'fetch'>
  ) {
    super({ ...params, fetch: fetch });
  }
}
