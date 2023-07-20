import { APIRequests } from "../../../../page-objects/api-routes";
import { SearchBar } from "../../../../page-objects/search-bar";
import { cutOffTime } from "../../../../support/enums";
const pharmacyId = Cypress.env("pharmacyId");

function clearFilter() {
    cy.contains("Clear filters")
        .should('be.visible')
        .click();
    cy.wait('@clearFiltersRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        cy.get('.filter-input > #packSize').should('be.empty');
    })
}

function toSearchByPackSizeAndCheckResponse() {
    
    let packSizeArray = ['30', '5ML', '5X3ML'];
    packSizeArray.forEach(selectedPackSize => {
        
        SearchBar.elements.packSizeTxt().type(selectedPackSize).type('{enter}');
        SearchBar.elements.searchBtn().click();

        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            var packSize = selectedPackSize;
            
            if (response.body.items.length == 0) {
                cy.log("The server return 0 result.All is fine")
                cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
            } else {
                cy.get(response.body.items).each(($item: any) => {
                    expect($item.packSize.toLowerCase()).to.contain(packSize.toLowerCase());
                })
            
            }
        })
    });
}

describe('PackSize', () => {

    
    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.updatePharmacy(1,cutOffTime.before, 2, 1, pharmacyId);
    });
    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept(APIRequests.request.filter_pack_size + '*',)
            .as('searchRequest');
        cy.intercept(APIRequests.request.ClearFilter + '*',)
            .as('clearFiltersRequest');
            cy.fixture("main").then(data => {
                cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
            });
    });
    
    
    it('Brokered Ethical | Apply then Clear', () => {
    
        cy.visitPage("Brokered Ethical");
        toSearchByPackSizeAndCheckResponse();
        clearFilter();
        
    })
    it('Brokered OTC | Apply then Clear', () => {

        cy.visitPage("Brokered OTC");
        toSearchByPackSizeAndCheckResponse();
        clearFilter();
    })
    it('Second Line | Apply then Clear', () => {

        cy.visitPage("Second Line");
        toSearchByPackSizeAndCheckResponse();
        clearFilter();
    })
    it('ULM | Apply then Clear', () => {

        cy.visitPage("ULM");
        toSearchByPackSizeAndCheckResponse();
        clearFilter();
    })
});