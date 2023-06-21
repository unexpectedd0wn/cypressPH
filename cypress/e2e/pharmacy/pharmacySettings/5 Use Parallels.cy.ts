import { OrderPage } from "../../../page-objects/order-page";
import { APIRequests } from "../../../page-objects/api-routes";
import { Wholesalers } from "../../../support/enums";

const pharmacyId = Cypress.env("pharmacyId");

function toCheckResponseIsUDOnly(unitedDrugOptionName) {
    cy.wait('@pageLoads').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        OrderPage.elements.paginationNumberOfPages().then(($number: any) => {
            let numberOfPages = $number.text()
            cy.log(`Number of the pages is: ${numberOfPages}`);

            cy.get(response.body.items).each(($item: any) => {
                expect($item.wholesaler).to.contain(unitedDrugOptionName);
            })

            OrderPage.clickToGetNextPage()
            for (let i = 1; i < numberOfPages; i++) {
                cy.wait('@pageLoads').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);

                    cy.get(response.body.items).each(($item: any) => {
                        expect($item.wholesaler).to.contain(unitedDrugOptionName);
                    })
                });
                OrderPage.clickToGetNextPage()
            }
        });
    })
}

function checkNoPIitemsOnThePages() {

    let piWholesalers = [Wholesalers.PCO.Name, Wholesalers.IMED.Name, Wholesalers.ONEILLS.Name, Wholesalers.LEXON.Name, Wholesalers.CLINIGEN.Name]

    piWholesalers.forEach(element => {
        cy.selectWholesaler(element)
        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            OrderPage.elements.noRecordsFoundFooter()
            .should('be.visible')
            .and('include.text', 'No records found');
        });
    })
}

describe('Use parallels = false on the pages', () => {

    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.updatePharmacySetUseGreys(0, pharmacyId)

    });

    beforeEach(() => {
        cy.intercept('/api/stock-product/products?skip=' + '*').as('pageLoads');
        cy.intercept(APIRequests.request._filter_wholesaler + '*').as('pageLoaded');
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    after(() => {
        //Retrieve the Pharmacy settings
        cy.updatePharmacySetUseGreys(1, pharmacyId)
    });

    it('Use Parallels = false | Items on the pages | Brokered Ethical', () => {

        cy.visitPage("Brokered Ethical");
        toCheckResponseIsUDOnly(Wholesalers.UD.Name);

    });

    it('Use Parallels = false | Items on the pages | Brokered OTC', () => {

        cy.visitPage("Brokered OTC");
        toCheckResponseIsUDOnly(Wholesalers.UD.Name);

    });

    it('Use Parallels = false | Items on the pages | Second Line', () => {

        cy.visitPage("Second Line");
        toCheckResponseIsUDOnly(Wholesalers.UD.Name);

    });

    it('Use Parallels = false | Items on the pages | ULM', () => {
        //On the ULM page no UD items, but system shows ELEMENTS item, which is originaly UD 
        cy.visitPage("ULM");
        toCheckResponseIsUDOnly(Wholesalers.UD.secondName);

    });

    it.only('Use Parallels = false | Brokered Ethical | Filter apply', () => {

        cy.visitPage("Brokered Ethical");
        checkNoPIitemsOnThePages();

    });

    it('Use Parallels = false | Brokered OTC | Filter apply', () => {

        cy.visitPage("Brokered OTC");
        checkNoPIitemsOnThePages();

    });

    it('Use Parallels = false | Second Line | Filter apply', () => {

        cy.visitPage("Second Line");
        checkNoPIitemsOnThePages();

    });

    it('Use Parallels = false | ULM | Filter apply', () => {

        cy.visitPage("ULM");
        checkNoPIitemsOnThePages();

    });
})
