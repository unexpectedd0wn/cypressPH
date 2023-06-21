import { APIRequests } from "../../../page-objects/api-routes";
import { Wholesalers } from "../../../support/enums";
import { cutOffTime } from "../../../support/enums";

const pharmacyId = Cypress.env("pharmacyId");

function clearFilter() {
    cy.contains("Clear filters").should('be.visible').click();

    cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', 'All');
    cy.wait('@clearFiltersRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
    })
}

function toSelectWholeslaerAndCheckResponse(option) {

    function getList(isNotULM) {

        return (isNotULM ? [Wholesalers.UD.Name, Wholesalers.PCO.Name, Wholesalers.IMED.Name, Wholesalers.ONEILLS.Name, Wholesalers.LEXON.Name, Wholesalers.CLINIGEN.Name] : [Wholesalers.PCO.Name, Wholesalers.IMED.Name, Wholesalers.ONEILLS.Name, Wholesalers.LEXON.Name, Wholesalers.CLINIGEN.Name, Wholesalers.UD.secondName])
    }
    var wholesalerArray = getList(option);

    wholesalerArray.forEach(wholesalerSelected => {

        cy.selectWholesaler(wholesalerSelected)
        cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
            .should('have.text', wholesalerSelected);

        var wholesaler = wholesalerSelected;
        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            if (response.body.items.length == 0) {
                cy.log("The server return 0 result.All is fine")
                cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
            } else {
                cy.get(response.body.items).each(($item: any) => {
                    expect($item.wholesaler.toLowerCase()).to.equal(wholesaler.toLowerCase());
                })
            }
        })
    });
}
describe('', () => {

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.updatePharmacy(1, cutOffTime.before, 2, 1, pharmacyId);
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept(APIRequests.request._filter_wholesaler + '*',).as('searchRequest');
        cy.intercept(APIRequests.request.ClearFilter + '*',).as('clearFiltersRequest');
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    afterEach(() => {
        cy.signOut();
    });
    it('Brokered Ethical | Apply then Clear', () => {

        cy.visitPage("Brokered Ethical");
        toSelectWholeslaerAndCheckResponse(true)
        clearFilter()
    })
    it('Brokered OTC | Apply then Clear', () => {

        cy.visitPage("Brokered OTC");
        toSelectWholeslaerAndCheckResponse(true)
        clearFilter()
    })
    it('Second Line | Apply then Clear', () => {

        cy.visitPage("Second Line");
        toSelectWholeslaerAndCheckResponse(true)
        clearFilter()
    })
    it('ULM | Apply then Clear', () => {

        cy.visitPage("ULM");
        toSelectWholeslaerAndCheckResponse(false)
        clearFilter()
    })

});