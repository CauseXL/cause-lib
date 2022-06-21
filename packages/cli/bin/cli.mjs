#! /usr/bin/env node
'use strict'
import { cli, getArgs } from '../dist/cli.mjs';

console.log(cli(getArgs))