const { defineConfig } = require("cypress");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

function setupNodeEvents(on, config) {
  require('cypress-mochawesome-reporter/plugin')(on);
  on('task', {
    excelToJsonConverter(filePath) {
      const result = excelToJson({
        source: fs.readFileSync(filePath)
      });
      return result;
    }
  });
}

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: "cypress/reports/html",
    overwrite: true,      
    html: true,
    json: true
  },
  e2e: {
    video: true,
    setupNodeEvents,
    specPattern: 'cypress/integration/examples/*.js',
  },
});
