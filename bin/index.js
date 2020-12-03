#!/usr/bin/env node

const program = require('commander');
const generateDocs = require('../lib/index').default;
const chalk = require('chalk');
const urlJoin = require('url-join');

let configPath = './comment-to-doc.config.js';

program
  .option('-c, --config <path>', 'Path to configuration file.')
  .option('-i, --info', 'Include more info about generation results.')
  .option('-v, --verbose', 'More info about errors')
  .action(async ({ config, info, verbose }) => {
    configPath = config?.trim() ? config.trim() : configPath;
    console.log('process.cwd()', process.cwd());

    let commentToDocConfig;
    let docsJSON;

    // Check config file
    try {
      commentToDocConfig = require.main.require(
        urlJoin(process.cwd(), configPath)
      );

      if (!commentToDocConfig) {
        console.log(`FAILED: Did not find configuration in "${configPath}"`,)
        return;
      }
      if (!commentToDocConfig?.files) {
        console.log(`FAILED: "files" not specified in configuration file located in "${configPath}"`,)
        return;
      }
    } catch (err) {
      console.log(`FAILED: Didn't find configuration file from "${configPath}"`);
      if (verbose) {
        throw err;
      }
      return;
    }

    try {
      docsJSON = await generateDocs(commentToDocConfig);
      let msg = `DONE: ${docsJSON?.length} document${docsJSON?.length === 1 ? '' : 's'} generated`;

      if (commentToDocConfig?.tags?.length) {
        msg += ` using ${commentToDocConfig?.tags?.length} defined tags.`;
      } else {
        msg += '.';
      }

      console.log(msg);
    } catch (err) {
      console.log(`FAILED: ${err?.message}`);
      if (verbose) {
        throw err;
      }
      return;
    }

    // More info
    if (info) {
      const usedTags = docsJSON.reduce((sum, docJSON) => {
        sum.push(...docJSON.data);
        return sum;
      }, []);
      const usedTagNames = usedTags?.map(tag => tag.tag);

      console.log(
        [
          '  • Generated files:',
          ...docsJSON.map(docJSON => `    ${chalk.gray(docJSON.path)}  =>  ${chalk.green(docJSON.output)}`),
          '',
          `  • Defined tags (${chalk.green('+ used')}, ${chalk.red('- unused')}):`,
          ...commentToDocConfig?.tags?.map(tag => {
            const isUsed = usedTagNames.includes(tag.tag);
            const log = `    ${isUsed ? '+' : '-'} ${tag.tag}`;
            return isUsed ? chalk.green(log) : chalk.red(log);
          }),
        ].join('\n')
      )
    }
  });

program.parse(process.argv);
