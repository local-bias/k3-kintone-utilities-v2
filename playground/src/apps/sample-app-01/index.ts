import { YahooShoppingClient } from '@konomi-app/kintone';

export const { search } = new YahooShoppingClient({
  clientId: '',
  debug: true,
});

(() => {
  console.log('Hello from sample-app-01');
})();
