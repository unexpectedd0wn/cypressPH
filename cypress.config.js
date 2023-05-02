const { defineConfig } = require("cypress");
const sqlServer = require('cypress-sql-server');

module.exports = defineConfig({
    requestTimeout: 7000,
    e2e: {
      setupNodeEvents(on, config) {
        const tasks = sqlServer.loadDBPlugin(config.env.db);
        on("task",tasks)
        on('task',{queryDb:query=>{return queryTestDb(query)},});
        on('task', { queryDb: query => { return queryTestDb(query, config) }, }); //For running sql query
      },
      testIsolation: false,
    env: {
      
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
});