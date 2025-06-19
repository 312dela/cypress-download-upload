const { defineConfig } = require("cypress");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

function setupNodeEvents(on, config) {
  // implement node event listeners here
  require('cypress-mochawesome-reporter/plugin')(on);
  on('task', {
    excelToJsonConverter(filePath) {
      const result = excelToJson({
        source: fs.readFileSync(filePath) // fs.readFileSync return a Buffer
      });
      return result
    }
  })


}
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    video: true,
    setupNodeEvents,
    specPattern: 'cypress/integration/examples/*.js'
  },
});
