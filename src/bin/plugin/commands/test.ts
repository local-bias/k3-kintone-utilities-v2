import { program } from 'commander';
import { __filename as __fn, __dirname as __dn } from '../lib/utils';

export default function command() {
  const sub = program.command('test');

  sub.description('test');

  sub.action(test);
}

function test() {
  console.log('filename', __filename);
  console.log('dirname', __dirname);
  console.log('__fn', __fn);
  console.log('__dn', __dn);
}
