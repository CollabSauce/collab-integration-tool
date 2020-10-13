const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const SentryCli = require('@sentry/cli');

const RELEASE = shell.exec('git rev-parse --short HEAD').replace(/(\r\n|\n|\r)/gm, ''); // Strip away the \n of the `release`.
const BASE_BUILD_COMMAND = `REACT_APP_SENTRY_RELEASE=${RELEASE} REACT_APP_ENV=${process.env.REACT_APP_ENV} react-scripts build`;

function removeSourceMapsForDirectory(startPath, filter, expectedMatches) {
  if (!fs.existsSync(startPath)) {
    console.log(chalk.red(`no dir ${startPath}`));
    return;
  }

  const files = fs.readdirSync(startPath);
  let matchedFilenames = [];
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    if (filter.test(filename)) {
      matchedFilenames.push(filename);
    }
  }

  if (matchedFilenames.length !== expectedMatches) {
    console.log(
      chalk.red(`ERROR: expected exactly ${expectedMatches} filenames for ${filter} but got ${matchedFilenames.length}`)
    );
    console.log(chalk.red(`BUILD IS WRONG. DO NOT DEPLOY`));
  }

  // Remove all the `.map` the sourcemaps file so it's not accessible in the browser
  for (let i = 0; i < matchedFilenames.length; i++) {
    shell.rm(matchedFilenames[i]);
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
  uploadBuildToSentry();
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
  removeSourceMaps();
}

function removeSourceMaps() {
  console.log(chalk.cyan('removing sourcemaps'));
  const jsDirectory = 'build/static/js';
  const jsMapFilesRegex = /build\/static\/js\/.*\.js.map$/;
  const cssDirectory = 'build/static/css';
  const cssMapFilesRegex = /build\/static\/css\/.*\.css.map$/;

  removeSourceMapsForDirectory(jsDirectory, jsMapFilesRegex, 3);
  removeSourceMapsForDirectory(cssDirectory, cssMapFilesRegex, 2);

  const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.REACT_APP_ENV}`);
  console.log(chalk.green(`${process.env.REACT_APP_ENV} succesfully built. Ready for deploy with ${deployCommand}`));
}

runBuildCommand();
