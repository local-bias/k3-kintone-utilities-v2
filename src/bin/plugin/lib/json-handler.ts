import { mkdirSync, existsSync, readJsonSync, writeJsonSync } from 'fs-extra';
import { join } from 'path';

export class JsonHandler<T extends Record<string, unknown> = any> {
  readonly #dirPath: string;
  readonly #fileName: string;

  public constructor(props: {
    dirPath: string;
    fileName: string;
    initData?: T;
  }) {
    const { dirPath, fileName, initData = {} } = props;
    this.#dirPath = dirPath;
    this.#fileName = fileName;

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    if (!existsSync(this.filePath)) {
      writeJsonSync(this.filePath, initData, { spaces: '\t' });
    }
  }

  public save(dataOrCallback: T | ((data: T) => T)): void {
    const data =
      typeof dataOrCallback === 'function'
        ? dataOrCallback(this.content)
        : dataOrCallback;
    writeJsonSync(this.filePath, data, { spaces: '\t' });
  }

  /**
   * @returns The full path to the JSON file.
   * @example
   * const file = new JsonHandler({ dirPath: 'data', fileName: 'data.json' });
   * console.log(file.filePath); //=> 'data/data.json'
   */
  public get filePath(): string {
    return join(this.#dirPath, this.#fileName);
  }

  /**
   * @returns The content of the JSON file.
   * @example
   * const file = new JsonHandler({ dirPath: 'data', fileName: 'data.json' });
   * console.log(file.content); //=> {}
   *
   * file.save({ key: 'value' });
   * console.log(file.content); //=> { key: 'value' }
   *
   * file.save((data) => ({ ...data, anotherKey: 'anotherValue' }));
   * console.log(file.content); //=> { key: 'value', anotherKey: 'anotherValue' }
   **/
  public get content(): T {
    return readJsonSync(this.filePath);
  }
}
