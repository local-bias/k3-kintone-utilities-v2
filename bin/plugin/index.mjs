#!/usr/bin/env node
import { program } from 'commander';
import merge from './merge.mjs';

program.name('kplugin').description('kintone plugin development tool');

merge();

program.parse(process.argv);
