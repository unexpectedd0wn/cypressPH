import { elements, shoppingCart } from "../../page-objects/order-page";
import routes, { _call } from "../../page-objects/api-routes";
import { Wholeslaers, headings } from "../../support/enums";
const dayjs = require("dayjs");
import 'cypress-map'
import orderPage from "../../page-objects/order-page";

let pharmacyId = Cypress.env("pharmacyId");

function checkTableHeaders(headingOption) {
    cy.get('table thead tr th')
    .map('innerText')
    .should('deep.equal', headingOption);
}

function checkNetPriceAndDiscountInTheDataGridTable(headingOption, equalOption) {

    cy.wait('@pageLoad').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        checkTableHeaders(headingOption);

        cy.get(response.body.items).each(($item, index) => {

            if ($item.wholesalerId == Wholeslaers.UD.Id) {
                cy.log("UD Item")
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


describe('', () => {

   
    before(() => {
        cy.cleanUpShoppingCart(pharmacyId);
        cy.clearAllCookies();
    });

    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoad');
        cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoad');
        cy.intercept(_call._getPageDataSecondLine + '*').as('pageLoad');
        cy.intercept(_call._getPageDataULM + '*').as('pageLoad');
        
    });

    afterEach(() => {
        
    });
    
    it('If "Show UD Prices and Discounts" = false and "Show Second Line Prices and Discounts" = false 0:0 | All Pages', () => {
        
        cy.updatePharmacyShowUdNetPricesAndShow2ndLine(0,0,pharmacyId)
        
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        cy.visitBrokeredEthical();
        checkNetPriceAndDiscountInTheDataGridTable(headings.brokeredEthical ,'deep');

        cy.visitBrokeredOTC();
        checkNetPriceAndDiscountInTheDataGridTable(headings.brokeredOTC ,'deep');

        cy.visitSecondLine()
        checkTableHeaders(headings.secondLine);
        
        cy.visitULM()
        checkTableHeaders(headings.ulm);

    });
    
    it('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:0 | Pages' , () => {
        
        cy.updatePharmacyShowUdNetPricesAndShow2ndLine(1,0,pharmacyId)
        
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        
        
        cy.visitBrokeredEthical();
       

        checkNetPriceAndDiscountInTheDataGridTable(headings.brokeredEthical ,'not');

        cy.visitBrokeredOTC();
        checkNetPriceAndDiscountInTheDataGridTable(headings.brokeredOTC ,'not');

        cy.visitSecondLine()
        checkTableHeaders(headings.secondLine);
        
        cy.visitULM()
        checkTableHeaders(headings.ulm);
    });
    
    it.only('If "Show UD Prices and Discounts" = true and "Show Second Line Prices and Discounts" = false 1:1 | Pages', () => {
        
        cy.updatePharmacyShowUdNetPricesAndShow2ndLine(1,1,pharmacyId)
        
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        
        
        cy.visitBrokeredEthical();
       

        checkNetPriceAndDiscountInTheDataGridTable(headings.brokeredEthical ,'not');

        cy.visitBrokeredOTC();
        checkNetPriceAndDiscountInTheDataGridTable(headings.brokeredOTC ,'not');

        cy.visitSecondLine()
        checkTableHeaders(headings.brokeredEthical);
        
        cy.visitULM()
        checkTableHeaders(headings.ulm);
    
    });
    
    it('"Show UD Prices and Discounts" and "Show Second Line Prices and Discounts" | Shopping Cart', () => {
        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoad');
        cy.intercept(_call._getPageDataBrokeredOTC + '*').as('pageLoad');
        
        cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = 1, Show2ndLine = 1 where Id = 411`);
        
        cy.fixture("main").then(data => {
            cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        
        
        cy.visitBrokeredEthical();
       

        cy.wait('@pageLoad').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                        cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
            cy.get(response.body.items).each(($item, index) => {
                        
                if ($item.wholesalerId == Wholeslaers.UD.Id) {
                    cy.log("UD Item")
                    cy.log(index) 
                    cy.get(`table tbody tr`)
                    .eq(index)
                    .find(`td`)
                    
                    .then(($tr) => {
                        return{
                            NetPrice: $tr[9].innerText,
                            Discount: $tr[10].innerText
                        }
                    })
                    .should('not.equal',
                    {
                        NetPrice: '',
                        Discount: ''
                    }

                    )
                    
                } else {
                    cy.log("Skip not a UD Item")
                }
            })
        })

        cy.visitBrokeredOTC();
        cy.wait('@pageLoad').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                        cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
            
            cy.get(response.body.items).each(($item, index) => {
                        
               if ($item.wholesalerId == Wholeslaers.UD.Id) {
                    cy.log("UD Item")
                    cy.get(`table tbody tr`).eq(index).find(`td`)
                        .then(($tr) => {
                            return{
                                NetPrice: $tr[9].innerText,
                                Discount: $tr[10].innerText
                            }
                        })
                        .should('not.equal',
                        {
                            NetPrice: '',
                            Discount: ''
                        }
                    )
                } else {
                    cy.log("Skip not a UD Item")
                }
            })

        })

        cy.visitSecondLine()
        const headingssl = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment']
                        cy.get('table thead tr th').map('innerText').should('deep.equal', headingssl);
        
        cy.VisitULM()
        const headings = ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type']
                        cy.get('table thead tr th').map('innerText').should('deep.equal', headings);
    
    });
});


