import 'cypress-map'
import { Wholesalers, headings } from "../../support/enums";
import { APIRequests } from '../../page-objects/api-routes';

const pharmacyId = Cypress.env("pharmacyId");
const wholeslaerId = Wholesalers.UD.Id;

function checkTableHeaders(headingOption) {
    cy.get('table thead tr th')
    .map('innerText')
    .should('deep.equal', headingOption);
}

function toCheckPricesDiscountsInTheTable(headingOption, equalOption) {

    cy.wait('@pageLoad').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        checkTableHeaders(headingOption);

        cy.get(response.body.items).each(($item: any, index) => {

            if ($item.wholesalerId == wholeslaerId) {
                cy.log("UD Item found")
                cy.get(`table tbody tr`).eq(index).find(`td`)
                    .then(($tr) => {
                        return {
                            NetPrice: $tr[9].innerText,
                            Discount: $tr[10].innerText
                        }
                    })
                    .should(`${equalOption}.equal`, {
                        NetPrice: '',
                        Discount: ''
                    })
            } else {
                cy.log("Skip not a UD Item")
            }
        })
    })
}

describe('Show UD Prices and Discounts and Show Second Line Prices and Discounts', () => {
    
    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.clearAllCookies();
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept(APIRequests.request._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(APIRequests.request._getPageDataBrokeredEthical + '*').as('pageLoad');
        cy.intercept(APIRequests.request._getPageDataBrokeredOTC + '*').as('pageLoad');
        cy.intercept(APIRequests.request._getPageDataSecondLine + '*').as('pageLoad');
        cy.intercept(APIRequests.request._getPageDataULM + '*').as('pageLoad');
    });

    afterEach(() => {
        cy.signOut();
    });

    after(() => {
        cy.toUpdatePharmacyPricesDiscounts(1,1,pharmacyId)
    });
    
    it('If "Show UD Prices and Discounts" = false and "Show Second Line Prices and Discounts" = false 0:0 | All Pages', () => {
        
        cy.toUpdatePharmacyPricesDiscounts(0,0,pharmacyId)
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        cy.visitPage("Brokered Ethical");
        toCheckPricesDiscountsInTheTable(headings.brokeredEthical ,'deep');

        cy.visitPage("Brokered OTC");
        toCheckPricesDiscountsInTheTable(headings.brokeredOTC ,'deep');

        cy.visitPage("Second Line");
        checkTableHeaders(headings.secondLine);
        
        cy.visitPage("ULM");
        checkTableHeaders(headings.ulm);
    });
    
    it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:0 | Pages' , () => {
        
        cy.toUpdatePharmacyPricesDiscounts(1,0,pharmacyId)
        
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        cy.visitPage("Brokered Ethical");
        toCheckPricesDiscountsInTheTable(headings.brokeredEthical ,'not');

        cy.visitPage("Brokered OTC");
        toCheckPricesDiscountsInTheTable(headings.brokeredOTC ,'not');

        cy.visitPage("Second Line");
        checkTableHeaders(headings.secondLine);
        
        cy.visitPage("ULM");
        checkTableHeaders(headings.ulm);
    });
    
    it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:1 | Pages', () => {
        
        cy.toUpdatePharmacyPricesDiscounts(1,1,pharmacyId)
        
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        cy.visitPage("Brokered Ethical");
        toCheckPricesDiscountsInTheTable(headings.brokeredEthical ,'not');

        cy.visitPage("Brokered OTC");
        toCheckPricesDiscountsInTheTable(headings.brokeredOTC ,'not');

        cy.visitPage("Second Line");
        checkTableHeaders(headings.brokeredEthical);
        
        cy.visitPage("ULM");
        checkTableHeaders(headings.ulm);
    });
    
    // it('"Show UD Prices and Discounts" and "Show Second Line Prices and Discounts" | Shopping Cart', () => {
        
    // });
});


