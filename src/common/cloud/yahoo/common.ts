import { CompatibleFetch, CompatibleFetchResponse } from '../../../lib/fetch';

export class YahooAPIClient {
  public static DOMAIN = 'https://shopping.yahooapis.jp/';

  readonly #debug: boolean;
  readonly #clientId: string;
  protected readonly _fetch: CompatibleFetch;

  protected _retryLimit = 10;
  protected _retryInterval = 3000;

  /** APIを最後に実行した時刻 */
  #lastRequested = 0;

  /**
   * @see {@link https://e.developer.yahoo.co.jp/dashboard Yahoo!デベロッパーネットワーク - アプリケーションの管理}
   */
  constructor(params: {
    clientId: string;
    debug?: boolean;
    fetch: CompatibleFetch;
  }) {
    const { clientId, debug = false } = params;
    this.#clientId = clientId;
    this.#debug = debug;
    this._fetch = params.fetch;
  }

  protected async useAPI<T = any>(
    func: () => Promise<CompatibleFetchResponse<T>>
  ): Promise<T> {
    const now = new Date().getTime();
    if (this.#lastRequested && now - this.#lastRequested < 200) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    let response: CompatibleFetchResponse<T> | null = null;
    let tryCount = 0;
    while (tryCount < this.retryLimit) {
      try {
        response = await func();
        if (this.#debug) console.log('📥 api response', response);
        this.#lastRequested = new Date().getTime();

        if (response.status === 429) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryInterval)
          );
          response = await func();
          this.#lastRequested = new Date().getTime();
          if (this.#debug)
            console.log(
              `⚠ APIレートの上限に達しました。${this.retryInterval}ミリ秒待機して再実行します。`
            );
        } else {
          break;
        }
        tryCount++;
      } catch (error) {
        this.#lastRequested = new Date().getTime();
        console.error('⚠️Yahoo API実行時にエラーが発生しました', error);
        await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
      }
    }

    if (!response) {
      throw new Error('APIの実行に失敗しました');
    }
    return response.json();
  }

  protected get clientId() {
    return this.#clientId;
  }

  protected get debug() {
    return this.#debug;
  }

  public get retryLimit() {
    return this._retryLimit;
  }

  public get retryInterval() {
    return this._retryInterval;
  }

  public set retryLimit(value: number) {
    this._retryLimit = value;
  }

  public set retryInterval(value: number) {
    this._retryInterval = value;
  }
}
