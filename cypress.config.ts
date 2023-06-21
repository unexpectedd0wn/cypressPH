const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');


declare var require: any


module.exports = defineConfig({
  requestTimeout: 10000,
  experimentalStudio: true,
  e2e: {
    setupNodeEvents(on, config) {
      const tasks = sqlServer.loadDBPlugin(config.env.db);
      on('task', tasks);
      on('task', { queryDb: query => { return queryTestDb(query) }, });
      on('task', { queryDb: query => { return queryTestDb(query, config) }, });

      return config
    },
    testIsolation: true,
  },
  viewportWidth: 1280,
    viewportHeight: 1024,
    defaultCommandTimeout: 10000,
    // pageLoadTimeout: 100000,
    video: false,
    // retries: {
    //   // Configure retry attempts for `cypress run`
    //   // Default is 0
    //   runMode: 2,
    //   // Configure retry attempts for `cypress open`
    //   // Default is 0
    //   openMode: 1
    // },
  env: {
    pharmacyId: 411,
    devURL: "https://************.com",
    db: {
      userName: "************",
      password: "************",
      server: "************",
      options: {
        database: "************",
        encrypt: true,
        rowCollectionOnRequestCompletion: true,
        //port: '1433',
        //timeout:70000
        // Default Port
      },
    },

  },
},
);