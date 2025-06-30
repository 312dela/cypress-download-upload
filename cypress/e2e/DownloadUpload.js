/// <reference types="cypress"/>
//
describe('Excel Data Validation', () => {
    let fruit;
    let fruitChanges;
    const fileLocation = Cypress.config('fileServerFolder') + '/cypress/downloads/download.xlsx';

    before(() => {
        cy.fixture('testData').then((data) => {
            fruit = data.searchFruit;
            fruitChanges = data.modifyFruit;
        })
    })

    beforeEach(() => {
        cy.visit('https://rahulshettyacademy.com/upload-download-test/index.html');
        cy.get('#downloadButton').click();
        cy.wait(2000);
    })

    it('Verify Downloaded File Data', () => {
        cy.task('excelToJsonConverter', fileLocation).then((result) => {
            // cy.log(JSON.stringify(result));
            expect(fruit.fruitName1).to.equal(result.Sheet1[4].B);
        })
    })

    it("verify excel update and append", () => {
        const replaceNum = 450;
        const searchTextFruit = "Mango";

        const newFruitRow = [
            7,           // S No (karena sekarang sudah ada sampai 6, maka jadi 7)
            "Jambu",     // Fruit Name
            "Pink",      // Color
            "200",          // Price (kosong)
            "All"           // Season (kosong)
        ];

        cy.task('writeExcelTest', {
            searchText: searchTextFruit,
            replaceText: replaceNum,
            change: { rowChange: 0, colChange: 2 },
            fileLocation,
            appendRow: newFruitRow
        });
        cy.get("#fileinput").selectFile(fileLocation);
        cy.contains(searchTextFruit).parent().parent().find("#cell-4-undefined")
            .should('have.text', replaceNum);
    });



})
