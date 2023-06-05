let ItemId, ItemGmsCode;
import OrderPages from "../../pages/OrderPages";
import routes from "../../pages/routes";

describe('Case Size', () => {

    beforeEach(() => {
        
        cy.intercept(routes._call._getPageData)
            .as('pageLoaded');
        cy.intercept(routes._call._filter_wholesaler + 1 + '*',)
            .as('pageLoadedWholeslaer');

        cy.fixture("main").then(data => {
            cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.visit(Cypress.env("devURL") + routes._page.BrokeredEthical);
        cy.title()
            .should('eq', 'Orders-Brokered Ethical');

        cy.log("Clear shopping cart")
        cy.CleanUpShoppingCart(Cypress.env("pharmacyId"));

        cy.log("Get the medicine for the testing: ")
        cy.selectUnitedDrug()
        cy.wait('@pageLoadedWholeslaer').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            
                cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label')
            .should('have.text', "United Drug");
            
            ItemId = response.body.items[3].id;
            ItemGmsCode = response.body.items[3].gmsCode;
            cy.log(ItemId);
            cy.log(ItemGmsCode);
            cy.wrap(ItemId).as('itemId');
            cy.wrap(ItemGmsCode).as('itemGmsCode');
        })
        cy.log("Make sure item does not have a Case size ")
        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
        })
    });

    it('Change Qty on the Ordering page', () => {
        let caseSize = 10;
        cy.get('@itemGmsCode').then((gmsCode) => {
            cy.intercept(routes._call._filter_GmsCode + gmsCode + '*',)
                .as('searchRequest');
        })
        cy.visit(Cypress.env("devURL") + routes._page.BrokeredEthical);

        cy.get('@itemGmsCode').then((gmsCode) => {
            
            OrderPages.typeAndClickSearch(gmsCode);
            
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

        OrderPages.getCaseSizeBudge()
            .should('be.visible')
            .and('have.text', ` Case of ${caseSize} `);
        OrderPages.el.valueQty()
            .should('have.css', 'background-color', 'rgb(255, 215, 74)')

        OrderPages.changeQtyUP()
        OrderPages.el.valueQty()
            .should('have.value', `${caseSize}`)
        OrderPages.changeQtyUP()
        OrderPages.el.valueQty()
            .should('have.value', `${caseSize * 2}`)

        cy.get('@itemId').then((Id) => {
            cy.sqlServer(`update StockProducts set CaseSize = 1 where Id = ${Id}`)
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
            .should('not.exist')

        OrderPages.el.valueQty()
            .should('have.css', 'background-color', 'rgb(244, 244, 244)')

        OrderPages.changeQtyUP()
        OrderPages.el.valueQty()
            .should('have.value', '1')
        OrderPages.changeQtyUP()
        OrderPages.el.valueQty()
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


let item {
    itemId: number,
    itemGMScode: number
}