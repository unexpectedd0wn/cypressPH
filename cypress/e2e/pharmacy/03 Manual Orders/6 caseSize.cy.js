let ItemId, ItemGmsCode;
import OrderPages, { orderPageEl } from "../../../page-objects/order-page";
import { _call } from "../../../page-objects/api-routes";
import { Wholeslaers } from "../../../support/enums";
import { searchBarEl } from "../../../page-objects/order-page";
import searchBar from "../../../page-objects/search-bar";
import orderPage from "../../../page-objects/order-page";

import { Wholesalers } from "../../../support/enums";
import { APIRequests } from "../../../page-objects/api-routes";
import { getItemForTest, addItemAndCheckCartTab, toPlaceTheOrder, toCheckOrderDetails, toCheckOrderHistory } from "../../../support/manualOrderService";

const pharmacyId = Cypress.env("pharmacyId");
const wholesaler = Wholesalers.UD.Name;

describe('Case Size', () => {


    beforeEach(() => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept('/api/stock-product/products?' + '*').as('pageLoaded');
        cy.intercept(APIRequests.request._filter_wholesaler + '*').as('searchWholesaler')
        cy.intercept(APIRequests.request._getShoppingcart + '*').as('shopingCart')
        cy.intercept(APIRequests.request._addItemShoppingCart).as('itemAdded')
        cy.intercept(APIRequests.request._sendOrder).as('sendorder')
        cy.intercept(APIRequests.request._getDataOrderHistoryPage).as('orderHistory')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=*').as('search')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=IPUCode&filters%5B0%5D.value=' + '*' + '&filters%5B0%5D.$type=string&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=wholesalerId&filters%5B1%5D.value=1&filters%5B1%5D.$type=number&filters%5B1%5D.matchMode=0&filters%5B2%5D.propertyName=' + '*' + '&filters%5B2%5D.value=true&filters%5B2%5D.$type=boolean').as('textSearchLoaded')
        
        
        
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });
    // beforeEach(() => {
        
    //     cy.intercept(_call._getPageData).as('pageLoaded');
    //     cy.intercept(_call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('pageLoadedWholeslaer');
    //     cy.cleanUpShoppingCart(Cypress.env("pharmacyId"));
        
    //     cy.fixture("main").then(data => {
    //         cy.signIn(data.pharmacyUserEmail, data.pharmacyUserPassword);
    //     });

    //     cy.visitBrokeredEthical();
        

    //     cy.log("Get the medicine for the testing: ")
    //     cy.selectWholeslaer(Wholeslaers.UD.Name)
        
    //     cy.wait('@pageLoadedWholeslaer').then(({ response }) => {
    //         expect(response.statusCode).to.equal(200);
            
    //         searchBar.getWholesalerLabel().should('have.text', "United Drug");
            
    //         ItemId = response.body.items[3].id;
    //         ItemGmsCode = response.body.items[3].gmsCode;
    //         cy.log(ItemId);
    //         cy.log(ItemGmsCode);
    //         cy.wrap(ItemId).as('itemId');
    //         cy.wrap(ItemGmsCode).as('itemGmsCode');
    //     })
    //     cy.log("Update Item to not have a CaseSize option")
    //     cy.get('@itemId').then((Id) => {
    //         cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
    //     })
    // });

    it('', () => {
        //Take Item for the test
        //Update Case Size 
        // Then check the page 
        //Add item to the Shopping cart 
        // Make an order 
        //Check Order Hostory 
    });

    it('Order 1 United Drug Item | Brokered Ethical', () => {
        let caseSize = 17;
        cy.visitPage("Brokered Ethical");
        getItemForTest(wholesaler);
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`UPDATE StockProducts SET CaseSize = ${caseSize} where Id = ${item.Id}`)
            
        })
        cy.reload()
        orderPage.getCaseSizeBudge()
            .should('be.visible')
            .and('have.text', ` Case of ${caseSize} `);
        orderPage.getQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')

        // OrderPages.changeQtyUP()
        orderPage.increaseQty()
        orderPage.getQty()
        // orderPageEl.valueQty()
            .should('have.value', `${caseSize}`)
        orderPage.increaseQty()
        orderPage.getQty()
            .should('have.value', `${caseSize * 2}`)

        

        addItemAndCheckCartTab(wholesaler);

        toPlaceTheOrder(wholesaler);
        toCheckOrderDetails(pharmacyId);

        cy.visitPage("Order History");
        toCheckOrderHistory(wholesaler);
    });

    it.only('Change Qty on the Ordering page', () => {
        let caseSize = 10;
        
        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.intercept(_call._filter_GmsCode + gmsCode + '*',)
                .as('searchRequest');
        })
        cy.visitBrokeredEthical();

        cy.get('@itemGmsCode').then((gmsCode) => {
            
            orderPage.typeTextAndClickSearch(gmsCode);
            
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get(response.body.items).each(($item) => {
                    expect($item.gmsCode).to.contain(gmsCode);
                })
            })
        })

        cy.log("Update item to make a cases size");
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`UPDATE StockProducts SET CaseSize = ${caseSize} where Id = ${Id}`)
            
        })

        cy.reload()

        // cy.get('@itemGmsCode').then((gmsCode) => {
        //     cy.wait('@pageLoaded').then(({ response }) => {
        //         expect(response.statusCode).to.equal(200);
                
        //         orderPage.typeTextAndClickSearch(gmsCode);
        //         cy.wait('@searchRequest').then(({ response }) => {
        //             expect(response.statusCode).to.equal(200);
        //             cy.get(response.body.items).each(($item) => {
        //                 expect($item.gmsCode).to.contain(gmsCode);
        //             })
        //         })
                
        //     })

            
        // })


        cy.get('@itemGmsCode').then((gmsCode) => {
            
            orderPage.typeTextAndClickSearch(gmsCode);
            
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get(response.body.items).each(($item) => {
                    expect($item.gmsCode).to.contain(gmsCode);
                })
            })
        })

        orderPage.getCaseSizeBudge()
            .should('be.visible')
            .and('have.text', ` Case of ${caseSize} `);
        orderPage.getQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')

        // OrderPages.changeQtyUP()
        orderPage.increaseQty()
        orderPage.getQty()
        // orderPageEl.valueQty()
            .should('have.value', `${caseSize}`)
        orderPage.increaseQty()
        orderPage.getQty()
            .should('have.value', `${caseSize * 2}`)

        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
            
        })

        cy.reload()

        cy.get('@itemGmsCode').then((gmsCode) => {
            
            orderPage.typeTextAndClickSearch(gmsCode);
            
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get(response.body.items).each(($item) => {
                    expect($item.gmsCode).to.contain(gmsCode);
                })
            })
        })
        orderPage.getCaseSizeBudge()
            .should('not.exist')
           

            orderPage.getQty()
            .should('have.css', 'background-color', 'rgb(244, 244, 244)')

            orderPage.increaseQty()
        orderPage.getQty()
            .should('have.value', '1')
            orderPage.increaseQty()
        orderPage.getQty()
            .should('have.value', '2')
    });
    it('Change Qty in the Shopping cart', () => {
        let caseSize = 10;
        //Create requests to intercept it 
        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.intercept(routes._call._filter_GmsCode + gmsCode + '*',)
                .as('searchRequest');
        })

        cy.intercept(routes._call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(routes._call._AddItemShoppingCart).as('addNewItem')

        cy.visit(Cypress.env("devURL") + routes._page.BrokeredEthical);

        /*
        Type gmsCode in the search field and make sure, server returned
        all items with the specific gmsCode
        */

        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                OrderPages.typeAndClickSearch(gmsCode)
                
                cy.wait('@searchRequest').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    cy.get(response.body.items).each(($item) => {
                        expect($item.gmsCode).to.contain(gmsCode);
                    })
                })
            })
        })

        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = ${caseSize} where Id = ${Id}`)
            cy.reload()
        })


        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.wait('@pageLoaded').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                OrderPages.typeAndClickSearch(gmsCode);
                
                cy.wait('@searchRequest').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    cy.get(response.body.items).each(($item) => {
                        expect($item.gmsCode).to.contain(gmsCode);
                    })
                })
            })
        })


        OrderPages.el.caseSizeBadge()
            .should('be.visible')
            .and('have.text', ` Case of ${caseSize} `);

        OrderPages.el.valueQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')

        OrderPages.changeQtyUP();
        OrderPages.el.valueQty()
            .should('have.value', `${caseSize}`)

        OrderPages.changeQtyUP();
        OrderPages.el.valueQty()
            .should('have.value', `${caseSize * 2}`)

        OrderPages.changeQtyUP();
        OrderPages.el.valueQty()
            .should('have.value', `${caseSize * 3}`)

        OrderPages.addItemShoppingCart();

        cy.wait('@addNewItem').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.wait('@getShoppingCartItems').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                cy.get('.summary-card').should('be.visible')
                cy.get('[rte="1Be"] > span').should('be.visible').should('have.text', 'United Drug')
                cy.get('[rte="1xt"]').should('have.text', '1 items')
                cy.get('.summary-items-span > span').should('be.visible').should('have.text', ' 1 item ')
                cy.get('.ng-star-inserted > .p-badge').should('be.visible')
                cy.get('#slide-button > .fa-stack > .fa-circle-thin').click()

            })
        })

        OrderPages.shoppingCart.valueQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')
        OrderPages.shoppingCart.UpQty()
            .click()
        OrderPages.shoppingCart.valueQty()
            .should('have.value', `${caseSize * 4}`).and('be.disabled')
    });
});


