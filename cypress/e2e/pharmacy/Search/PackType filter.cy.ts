import { APIRequests } from "../../../page-objects/api-routes";
import { SearchBar } from "../../../page-objects/search-bar";
import { OrderPage } from "../../../page-objects/order-page";
import { cutOffTime } from "../../../support/enums";
import { PackTypeDropDown } from "../../../support/enums";

const pharmacyId = Cypress.env("pharmacyId");

function clearFilter() {
    cy.contains("Clear filters")
            .should('be.visible')
            .click();
        cy.wait('@clearFiltersRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            SearchBar.elements.packTypeLabel().should('have.text', 'All');
        })
}

function toSelectPackTypeAndCheckResponse() {
    
    var packTypeArray = [PackTypeDropDown.Brand, PackTypeDropDown.Fridge, PackTypeDropDown.Generic, PackTypeDropDown.Otc, PackTypeDropDown.Ulm]
    packTypeArray.forEach(selectedPackType => {
        
        cy.selectPackType(selectedPackType);
        SearchBar.elements.packTypeLabel().should('have.text', selectedPackType);
        
        var packType = selectedPackType;
        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            

            if (response.body.items.length == 0) {
                cy.log("The server return 0 result.Possible case")

                OrderPage.elements.noRecordsFoundFooter()
                    .should('be.visible')
                    .and('include.text', 'No records found'
                    )
            }
            else {
                cy.get(response.body.items).each(($item: any) => {
                    expect($item.packType.toLowerCase()).to.contain(packType.toLowerCase());
                })
            }
        })
    });
}

describe('PackType filter', () => {
    
    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.updatePharmacy(1,cutOffTime.before, 2, 1, pharmacyId);
    });    
    
    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept(APIRequests.request.filter_pack_type + '*',)
            .as('searchRequest');
        cy.intercept(APIRequests.request.ClearFilter + '*',)
            .as('clearFiltersRequest');
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        cy.signOut()
    });
        
    it('Brokered Ethical | Apply & Clear: PackType', () => {
        
        cy.visitPage("Brokered Ethical");
        toSelectPackTypeAndCheckResponse();
        clearFilter();
    })

    it('Brokered OTC | Apply then Clear: PackType', () => {
        
        cy.visitPage("Brokered OTC");
        toSelectPackTypeAndCheckResponse();
        clearFilter();
    });

    it('Second Line | Apply then Clear: PackType', () => {
        
        cy.visitPage("Second Line");
        toSelectPackTypeAndCheckResponse();
        clearFilter();
    });
    it('ULM | Apply then Clear: PackType', () => {
        
        cy.visitPage("ULM");
        toSelectPackTypeAndCheckResponse();
        clearFilter();
    });
});

