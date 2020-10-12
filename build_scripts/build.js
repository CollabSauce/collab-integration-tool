const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const SentryCli = require('@sentry/cli');

const RELEASE = shell.exec('git rev-parse --short HEAD').replace(/(\r\n|\n|\r)/gm, ''); // Strip away the \n of the `release`.
const BASE_BUILD_COMMAND = `REACT_APP_SENTRY_RELEASE=${RELEASE} REACT_APP_ENV=${process.env.REACT_APP_ENV} react-scripts build`;

function removeSourceMapsForDirectory(startPath, filters) {
  for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    if (!fs.existsSync(startPath)) {
      console.log(chalk.red(`no dir ${startPath}`));
      return;
    }

    const files = fs.readdirSync(startPath);
    let matchedFilenames = [];
    for (let i = 0; i < files.length; i++) {
      const filename = path.join(startPath, files[i]);
      const stat = fs.lstatSync(filename);
      if (filter.test(filename)) {
        matchedFilenames.push(filename);
      }
    }

    if (matchedFilenames.length !== 1) {
      console.log(chalk.red(`ERROR: expected exactly 1 filename for ${filter} but got ${matchedFilenames.length}`));
      console.log(chalk.red(`BUILD IS WRONG. DO NOT DEPLOY`));
    }

    // Remove the last lines from the file so it doesn't point to any source maps, and remove the sourcemap files too
    shell.exec(`sed -i '' -e '$ d' ${matchedFilenames[0]}`);
    shell.rm(`${matchedFilenames[0]}.map`);
  }
}

// add to sentry code inspired by: https://medium.com/@vshab/create-react-app-and-sentry-cde1f15cbaa
function runBuildCommand() {
  if (!RELEASE) {
    console.log(chalk.red('could not get release'));
    return;
  }
  console.log(chalk.cyan('Running  build command:'));
  console.log(chalk.cyan(BASE_BUILD_COMMAND));
  shell.exec(BASE_BUILD_COMMAND);
}

async function uploadBuildToSentry() {
  const cli = new SentryCli();
  try {
    console.log(chalk.cyan('Creating sentry release ' + RELEASE));

    await cli.releases.new(RELEASE);
    console.log(chalk.cyan('Uploading source maps'));
    await cli.releases.uploadSourceMaps(RELEASE, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false,
    });
    console.log(chalk.green('Finalizing release'));
    await cli.releases.finalize(RELEASE);
  } catch (e) {
    console.error(chalk.red('Source maps uploading failed:', e));
  }
}

function removeSourceMaps() {
  console.log(chalk.cyan('removing sourcemaps'));
  const jsDirectory = 'build/static/js';
  const jsFilesToFind = [
    /build\/static\/js\/main\.(.*)\.chunk\.js$/,
    /build\/static\/js\/2\.(.*)\.chunk\.js$/,
    /build\/static\/js\/runtime-main\.(.*)\.js$/,
  ];
  const cssDirectory = 'build/static/css';
  const cssFilesToFind = [/build\/static\/css\/main\.(.*)\.chunk\.css$/, /build\/static\/css\/2\.(.*)\.chunk\.css$/];
  removeSourceMapsForDirectory(jsDirectory, jsFilesToFind);
  removeSourceMapsForDirectory(cssDirectory, cssFilesToFind);
}

runBuildCommand();
uploadBuildToSentry();
removeSourceMaps();
