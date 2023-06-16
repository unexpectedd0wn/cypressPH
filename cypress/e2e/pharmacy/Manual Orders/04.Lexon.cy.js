const { Wholeslaers } = require("../../../support/enums");
import searchBar from "../../../page-objects/search-bar";
import orderPage from "../../../page-objects/order-page";
import { _call } from "../../../page-objects/api-routes";
import shoppingCart, { elements } from "../../../page-objects/shopping-cart";
let pharmacyId = Cypress.env("pharmacyId");
let wholesalerName = Wholeslaers.LEXON.Name;
describe('Manual Orders', () => {

    function randomItem() { // min and max included 
        const rndInt = Math.floor(Math.random() * 24) + 0;
        return rndInt;
     }

     before(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.cleanUpShoppingCart(pharmacyId);
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        cy.getItemForTest(wholesalerName)

    });

    it.only('Order Lexon Item', () => {
        cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoaded');
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=' + '*').as('search')
        cy.intercept(_call._getShoppingcart + '*').as('shopingCart')
        cy.intercept('/api/stock-product/cart/add').as('itemAdded')
        cy.intercept('/api/pharmacy/sendorder/shoppingcart').as('sendorder')
        cy.intercept('/api/order-history?' + '*').as('orderHistory')
        
        cy.visitBrokeredEthical()
        
        searchBar.searchByText(Cypress.env('item.IPUcode'))
        
        cy.wait('@search').then(({ response }) => {
            expect(response.statusCode).to.equal(200)
            orderPage.setQtyAndAddToShoppingCart()
        })

       cy.wait('@itemAdded').then(({ response }) => {
            expect(response.statusCode).to.equal(200)

            cy.wait('@shopingCart').then(({ response }) => {
                expect(response.statusCode).to.equal(200)
            })
        })

        shoppingCart.openCart()
        shoppingCart.state_UDShoppingCart(wholesalerName,
            '',
            Cypress.env('item.Description'),
            Cypress.env('item.PackSize'), 
            Cypress.env('item.PackType'), 
            (Cypress.env('item.NetPrice')).toFixed(2), 
            Cypress.env('item.Discount')
        )

        
       
        
        elements.cartCardOrderBtn().should('be.disabled')

        let updateQty = Math.round((75 / Cypress.env('item.NetPrice')))
        for (let index = 0; index < updateQty; index++) {
            
            cy.get('pharmax-input > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon')
            .click()
        }

        elements.cartCardOrderBtn().should('not.be.disabled')
        shoppingCart.pressOrderButton();
        

        cy.wait('@sendorder').then(({ response }) => {
            expect(response.statusCode).to.equal(200)

            shoppingCart.successfulOrderToastMessage(wholesalerName)

            cy.wait('@shopingCart').then(({ response }) => {
                expect(response.statusCode).to.equal(200)

                shoppingCart.emptyShoppingCartAppers()
            })
        })

        
        
        cy.sqlServer(`SELECT TOP (1) Id, WholesalerId, Completed, Sended, IsShoppingCartOrder, IsBrokeredOrder, Status, ConnectionType FROM Orders where PharmacistId = ${pharmacyId} order by Id desc`).then(data => {
            
            cy.log(data);
            let orderId = data[0]
            Cypress.env('orderId', data[0]);
            
            cy.sqlServer(`select Qty, Description, Cost, IPUCode, TradePrice, Discount from OrderDetails where OrderId = ${orderId} order by Id desc;`)
            .should('deep.eq', [updateQty + 1, Cypress.env('item.Description'), Cypress.env('item.NetPrice'), Cypress.env('item.IPUcode'), Cypress.env('item.TradePrice'), Cypress.env('item.Discount') ]);       
        });

        cy.visitOrderHistory();
        
        
            cy.wait('@orderHistory').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
        
                
        
                cy.get(response.body.items).each(($item, index) => {
        
                    if ($item.orderRef == Cypress.env('orderId')) {
                        cy.log("Found order!")
                        let updatedPriceValue =(Cypress.env('item.NetPrice') * (updateQty + 1)).toFixed(2);
                        cy.get(`table tbody tr`).eq(index).find(`td`)
                            .then(($tr) => {
                            return {
                                orderRef: $tr[1].innerText,
                                wholeslaer: $tr[2].innerText,
                                numberOfItem: $tr[3].innerText,
                                totalValue: $tr[4].innerText,
                                    
                            }
                        })

                        .should(`deep.equal`, {
                            orderRef: `#${Cypress.env('orderId')}`,
                            wholeslaer: wholesalerName,
                            numberOfItem: '1',
                            totalValue: `€${updatedPriceValue}`,
                        })

                        cy.get(':nth-child(1) > .download-cell >').click({force: true})
                        cy.readFile(`cypress/downloads/Order_${Cypress.env('orderId')}.pdf`, 'utf8')

                    } else {
                    cy.log("Skip orders")
                }
            })
        })
    });
});