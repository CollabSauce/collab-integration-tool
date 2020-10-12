const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const SentryCli = require('@sentry/cli');

const RELEASE = shell.exec('git rev-parse --short HEAD').replace(/(\r\n|\n|\r)/gm, ''); // Strip away the \n of the `release`.
const BASE_BUILD_COMMAND = `REACT_APP_SENTRY_RELEASE=${RELEASE} REACT_APP_ENV=${process.env.REACT_APP_ENV} react-scripts build`;

function findHashFromFileName(startPath, filter, onHashesFound) {
  if (!fs.existsSync(startPath)) {
    console.log(chalk.red(`no dir ${startPath}`));
    return;
  }

  const files = fs.readdirSync(startPath);
  let hashes = [];
  for (let i = 0; i < files.length; i++) {
    const filename = path.join(startPath, files[i]);
    const stat = fs.lstatSync(filename);
    if (filter.test(filename)) {
      const hash = filename.match(filter)[1];
      hashes.push(hash);
    }
  }

  if (hashes.length !== 1) {
    console.log(chalk.red(`ERROR: expected exactly 1 hash for ${filter} but got ${hashes.length}`));
    console.log(chalk.red(`BUILD IS WRONG. DO NOT DEPLOY`));
  }
  onHashesFound(hashes[0]);
}

function getOutputHashes(onGotHashes) {
  const directory = 'build/static/js';
  let appHash = '';
  let chunkHash = '';
  let runtimeMainHash = '';
  findHashFromFileName(directory, /build\/static\/js\/main\.(.*)\.chunk\.js$/, function (hashapp) {
    appHash = hashapp;
    findHashFromFileName(directory, /build\/static\/js\/2\.(.*)\.chunk\.js$/, function (hashchunk) {
      chunkHash = hashchunk;
      findHashFromFileName(directory, /build\/static\/js\/runtime-main\.(.*)\.js$/, function (hashRuntimemain) {
        runtimeMainHash = hashRuntimemain;
        onGotHashes(appHash, chunkHash, runtimeMainHash);
      });
    });
  });
}

// add to sentry code inspired by: https://medium.com/@vshab/create-react-app-and-sentry-cde1f15cbaa
function runInitialBuildCommand(callback) {
  if (!RELEASE) {
    console.log(chalk.red('could not get release'));
    return;
  }
  console.log(chalk.cyan('Running initial build command:'));
  console.log(chalk.cyan(BASE_BUILD_COMMAND));
  shell.exec(BASE_BUILD_COMMAND, function (error, stdout, stderr) {
    getOutputHashes(callback);
  });
}

async function uploadBuildToSentry(appHash, chunkHash, runtimeMainHash) {
  console.log(chalk.bgCyan.whiteBright(appHash));
  console.log(chalk.bgCyan.whiteBright(chunkHash));
  console.log(chalk.bgCyan.whiteBright(runtimeMainHash));

  if (!RELEASE) {
    console.log(chalk.red('release is not set'));
    return;
  }
  const cli = new SentryCli();
  try {
    console.log(chalk.cyan('Creating sentry release ' + RELEASE));

    await cli.releases.new(release);
    console.log(chalk.cyan('Uploading source maps'));
    await cli.releases.uploadSourceMaps(release, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false,
    });
    console.log(chalk.green('Finalizing release'));
    await cli.releases.finalize(release);

    const newBuildCommand = `GENERATE_SOURCEMAP=false ${BASE_BUILD_COMMAND}`;
    console.log(chalk.cyan('Running build command without sourcemaps:'));
    console.log(chalk.cyan(newBuildCommand));
    shell.exec(newBuildCommand, function (error, stdout, stderr) {
      getOutputHashes((hashapp, hashchunk, hashRuntimemain) => {
        console.log(chalk.bgCyan.whiteBright(hashapp));
        console.log(chalk.bgCyan.whiteBright(hashchunk));
        console.log(chalk.bgCyan.whiteBright(hashRuntimemain));

        if (hashapp === appHash && hashchunk === chunkHash && hashRuntimemain === runtimeMainHash) {
          const deployCommand = chalk.green.bold.underline(`yarn deploy-${process.env.REACT_APP_ENV}`);
          console.log(
            chalk.green(`${process.env.REACT_APP_ENV} succesfully built. Ready for deploy with ${deployCommand}`)
          );
        } else {
          console.log(
            chalk.red(
              `${process.env.REACT_APP_ENV} is wrong. hashes before and after sourcemaps aren't right. DO NOT DEPLOY`
            )
          );
        }
      });
    });
  } catch (e) {
    console.error(chalk.red('Source maps uploading failed:', e));
  }
}

runInitialBuildCommand(uploadBuildToSentry);
