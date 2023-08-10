#! /usr/bin/env node
'use strict';
/* eslint no-console: [ "error", { allow: [ "info", "warn", "error", "table" ] } ] */
const { init } = require('license-checker'),
      process = require('process'),
      util = require('util'),
      initLicenseChecker = util.promisify(init),
      packageDirectory = require('pkg-dir');

const DEFAULT_PERMITTED_LICENSES = [
   'MIT',
   'ISC',
   'Apache-2.0',
   '(MIT OR Apache-2.0)',
   'Public Domain',
   'CC-BY-3.0',
];

(async () => {
   const projectDirectoryPath = await packageDirectory(),
         projectConfigPath = `${projectDirectoryPath}/.license-checker.js`,
         licenseRecord = {};

   let configuredPermittedLicenses = [],
       moduleInfoReport,
       unsupportedLicenses;

   console.info('Project package.json located at path:', projectDirectoryPath);

   try {
      // eslint-disable-next-line global-require
      const config = require(projectConfigPath);

      configuredPermittedLicenses = config.permittedLicenses;

      console.info(`Using configured allow-list at path ${projectConfigPath}`);
      console.info('Allowing additional licenses:', configuredPermittedLicenses.join(', '));
   } catch(e) {
      console.error(e);
      console.info('A config for license checker was not provided or was not found.');
   }

   try {
      moduleInfoReport = await initLicenseChecker({
         start: process.cwd(),
      });
   } catch(e) {
      console.error('Could not initialize license-checker', e);
      process.exitCode = 1;
      return;
   }

   Object
      .keys(moduleInfoReport)
      .forEach((moduleName) => {
         const licenses = moduleInfoReport[moduleName].licenses;

         licenseRecord[moduleName] = {
            module: moduleName,
            license: licenses || 'UNLICENSED',
            ...moduleInfoReport[moduleName],
         };
      });

   console.info(`This project has ${Object.values(licenseRecord).length} licenses.`);

   unsupportedLicenses = Object.values(licenseRecord).filter((record) => {
      return !DEFAULT_PERMITTED_LICENSES.includes(record.license) && !configuredPermittedLicenses.includes(record.license);
   });

   if (unsupportedLicenses.length > 0) {
      console.error(`${unsupportedLicenses.length} unsupported licenses found:`);

      const errors = unsupportedLicenses
         .map((record) => {
            return {
               'Module Name': record.module,
               'Unsupported License': record.license,
            };
         });

      console.table(errors);
      process.exitCode = 1;
   }
})();
