import { Wholesalers } from "../../../support/enums";
import searchBar from "../../../page-objects/search-bar";
import orderPage from "../../../page-objects/order-page";
import { _call } from "../../../page-objects/api-routes";
import shoppingCart from "../../../page-objects/shopping-cart";

let pharmacyId = Cypress.env("pharmacyId");
let wholesaler = Wholesalers.UD.Name

describe('Manual Orders: United Drug', () => {

    before(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.cleanUpShoppingCart(pharmacyId);
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        cy.getItemForTest(wholesaler)
    });

    it.only('Order 1 United Drug Item | Brokered Ethical', () => {
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
        shoppingCart.state_UDShoppingCart(
            '',
            Cypress.env('item.Description'),
            Cypress.env('item.PackSize'), 
            Cypress.env('item.PackType'), 
            Cypress.env('item.NetPrice'), 
            Cypress.env('item.Discount')
        )

        shoppingCart.pressOrderButton();

        cy.wait('@sendorder').then(({ response }) => {
            expect(response.statusCode).to.equal(200)

            shoppingCart.successfulOrderToastMessage(wholesaler)

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
            .should('deep.eq', [1, Cypress.env('item.Description'), Cypress.env('item.NetPrice'), Cypress.env('item.IPUcode'), Cypress.env('item.TradePrice'), Cypress.env('item.Discount') ]);       
        });

        cy.visitOrderHistory();
        
        
            cy.wait('@orderHistory').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
        
                cy.get(response.body.items).each(($item, index) => {
        
                    if ($item.orderRef == Cypress.env('orderId')) {
                        cy.log("Found order!")
                        cy.get(`table tbody tr`).eq(index).find(`td`)
                            .then(($tr) => {
                            return {
                                orderRef: $tr[1].innerText,
                                wholesaler: $tr[2].innerText,
                                numberOfItem: $tr[3].innerText,
                                totalValue: $tr[4].innerText,
                                    
                            }
                        })
                        .should(`deep.equal`, {
                            orderRef: `#${Cypress.env('orderId')}`,
                            wholesaler: wholesaler,
                            numberOfItem: '1',
                            totalValue: `€${Cypress.env('item.NetPrice')}`,
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