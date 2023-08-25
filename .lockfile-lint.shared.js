'use strict';

module.exports = {

   path: 'package-lock.json',
   type: 'npm',
   // to many packages are still on the previous-gen sha
   validateIntegrity: false,
   emptyHostname: false,
   allowedHosts: [ 'npm', 'github.com' ],
   allowedSchemes: [
      'https:',
      'git+ssh:',
      'git+https:',
   ],
   validatePackageNames: true,

};
