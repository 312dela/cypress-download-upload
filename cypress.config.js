const { defineConfig } = require("cypress");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const ExcelJs = require('exceljs');

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

  on('task', {
    async writeExcelTest({ searchText, replaceText, change, fileLocation, appendRow }) {
      const workbook = new ExcelJs.Workbook();
      await workbook.xlsx.readFile(fileLocation);
      const worksheet = workbook.getWorksheet('Sheet1');

      if (searchText) {
        const output = await readExcel(worksheet, searchText);
        if (output.row !== -1 && output.column !== -1) {
          const cell = worksheet.getCell(output.row, output.column + change.colChange);
          cell.value = replaceText;
        }
      }

      if (appendRow) {
        const lastRow = worksheet.lastRow;
        const newRowIndex = lastRow.number + 1;
        worksheet.getRow(newRowIndex).values = appendRow;
      }

      return workbook.xlsx.writeFile(fileLocation)
        .then(() => true)
        .catch(() => false);
    }
  })


  //




  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

async function readExcel(worksheet, searchText) {
  let output = { row: -1, column: -1 };
  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = colNumber;
      }


    })

  })
  return output;
}


module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    overwrite: true,
    html: true,
    json: false
  },
  e2e: {
    video: true,
    setupNodeEvents,
    specPattern: 'cypress/e2e/*.js',
  },
});
