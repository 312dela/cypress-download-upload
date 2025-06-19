/// <reference types="cypress"/>
// check
describe('Download Upload Validation', function () {
    it('Verify Downloaded File', function () {
        const fruitName = 'Banana' 
        cy.visit('https://rahulshettyacademy.com/upload-download-test/index.html')
        cy.get('#downloadButton').click()
        cy.wait(2000)
        const filePath = Cypress.config("fileServerFolder") + "/cypress/downloads/download.xlsx"
        cy.task('excelToJsonConverter', filePath).then(function (result) {
            // cy.log(JSON.stringify(result));
            expect(fruitName).to.equal(result.Sheet1[4].B)            
        })
    })
})