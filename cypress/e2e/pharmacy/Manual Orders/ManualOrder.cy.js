const { Wholeslaers } = require("../../../support/enums");
import searchBar from "../../../page-objects/search-bar";
import orderPage from "../../../page-objects/order-page";
import { _call } from "../../../page-objects/api-routes";
import shoppingCart from "../../../page-objects/shopping-cart";
let pharmacyId = Cypress.env("pharmacyId");
describe('Manual Orders', () => {

    function randomItem() { // min and max included 
        const rndInt = Math.floor(Math.random() * 24) + 0;
        return rndInt;
     }

     before(() => {
        cy.cleanUpShoppingCart(pharmacyId)
     });
    
    
    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
    });
    
    
    it.only('Order United Drug Item', () => {
        cy.intercept(_call._getPageDataBrokeredEthical + '*').as('pageLoaded');
        cy.intercept(_call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('searchRequest');
        cy.intercept(_call._searchWithText + '*').as('search')
        cy.intercept(_call._getShoppingcart + '*').as('shopingCart')
        cy.intercept('/api/stock-product/cart/add').as('itemAdded')
        cy.intercept('/api/pharmacy/sendorder/shoppingcart').as('sendorder')
        cy.intercept('/api/order-history?' + '*').as('orderHistory')
        // cy.getItemForTest(Wholeslaers.UD.Name, pharmacyId)
        cy.visitBrokeredEthical()
        cy.wait('@pageLoaded').then(({ response }) => {
            expect(response.statusCode).to.equal(200);

            cy.selectWholeslaer(Wholeslaers.UD.Name)
            cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
                .should('have.text', Wholeslaers.UD.Name);

            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                let i = randomItem();

                cy.wrap({
                    id: response.body.items[i].id,
                    ipuCode: response.body.items[i].ipuCode,
                    description: response.body.items[i].description,
                    packSize: response.body.items[i].packSize,
                    packType: response.body.items[i].packType,
                    netPrice: response.body.items[i].netPrice,
                    discount: response.body.items[i].discount,
                }).as('item')
            })
        })

        cy.get('@item').then(item => {
            searchBar.searchByText(item.description)
        })

        cy.wait('@search').then(({ response }) => {
            expect(response.statusCode).to.equal(200)
        })

        orderPage.setQtyAndAddToShoppingCart()

        cy.wait('@itemAdded').then(({ response }) => {
            expect(response.statusCode).to.equal(200)

            cy.wait('@shopingCart').then(({ response }) => {
                expect(response.statusCode).to.equal(200)
            })
        })

        shoppingCart.openCart()

        cy.get('@item').then(item => {

            shoppingCart.state_UDShoppingCart('', item.description, item.packSize, item.packType, item.netPrice, item.discount)
        })

        shoppingCart.pressOrderButton();

        cy.wait('@sendorder').then(({ response }) => {
            expect(response.statusCode).to.equal(200)

            shoppingCart.successfulOrderToastMessage(Wholeslaers.UD.Name)

            cy.wait('@shopingCart').then(({ response }) => {
                expect(response.statusCode).to.equal(200)

                shoppingCart.emptyShoppingCartAppers()
            })
        })

        
        
        cy.sqlServer(`SELECT TOP (1) Id, WholesalerId, Completed, Sended, IsShoppingCartOrder, IsBrokeredOrder, Status, ConnectionType FROM Orders where PharmacistId = ${pharmacyId} order by Id desc`).then(data => {
                    
                    
            cy.log(data);
            
            
            
            let orderId = data[0]
            Cypress.env('orderId', data[0]);
            // cy.log(Cypress.env('orderId'));

            
            
            cy.sqlServer(`select * from OrderDetails where OrderId = ${orderId}`).then(data => {
                    
                    
            cy.log(data);
                
            });
                
        });

        cy.visitOrderHistory();
        
        cy.get('@item').then(item => {
            cy.wait('@orderHistory').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
        
                
        
                cy.get(response.body.items).each(($item, index) => {
        
                    if ($item.orderRef == Cypress.env('orderId')) {
                        cy.log("we found order!")
                        cy.get(`table tbody tr`).eq(index).find(`td`)
                            .then(($tr) => {
                                return {
                                    orderRef: $tr[1].innerText,
                                    wholeslaer: $tr[2].innerText,
                                    numberOfItem: $tr[3].innerText,
                                    totalValue: $tr[4].innerText,
                                    // cy.get('[data-left="1088.70833"]')
                                }
                                
                                
                            })
                            .should(`deep.equal`, {
                                orderRef: `#${Cypress.env('orderId')}`,
                                wholeslaer: Wholeslaers.UD.Name,
                                numberOfItem: '1',
                                totalValue: `€${item.netPrice}`,
                            })
                    } else {
                        cy.log("Skip other orders")
                    }
                })
            })
        })

        
            
            
        

        
        
        
        //1.Get Item from the page 
        //2.Search and Add it to the shopping cart 
        //3.Check attributes 
        //4.Place Order 
        //5/ Catch the toast message 
        //6/Check DB tables 

        // 

        //7 check Order History ! 
    });

    it('Order ELEMENTS Item', () => {
        
    });

    it('Order PCO Item', () => {
        
    });

    it('Order IMED Item', () => {
        
    });

    it('Order ONAILLS Item', () => {
        
    });

    it('Order Clinigen Item', () => {
        
    });

    it('Order PCO Fridge Item', () => {
        
    });

    it('Order ONAILLS ULM Item', () => {
        
    });

    it('Order Substitution Item', () => {
        
    });

    it('Order more than 15 UD items at once', () => {
        
    });
    
    
});