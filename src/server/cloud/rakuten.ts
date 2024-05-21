import { RakutenIchibaClient as CommonClient } from '../../common/cloud/rakuten';

export class RakutenIchibaClient extends CommonClient {
  public constructor(
    params: Omit<ConstructorParameters<typeof CommonClient>[0], 'fetch'>
  ) {
    super({ ...params, fetch: fetch });
  }
}
