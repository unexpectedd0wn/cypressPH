
import { _call } from "../../pagesANDmodules/routes";

import { orderPageEl } from "../../pagesANDmodules/OrderPages";
import { searchBarEl } from "../../pagesANDmodules/searchBar";

import { Wholeslaers } from "../../../support/enums";

describe('The test cases for the check that the system correct works with the OOS items', () => {
    
    before(() => {
        cy.CleanUpShoppingCart(Cypress.env("pharmacyId"));
    });

    beforeEach(() => {
        
        cy.fixture("main").then(data => {
            cy.LoginAndCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });
    it('Load the page -> Move UD item to the OOS -> Then Add item to the shopping cart', () => {
        cy.on('uncaught:exception', (err, runnable) => {

            return false

        })

        

        cy.intercept(_call._searchWithText + '*').as('searchRequestwiththeText');
        cy.intercept(_call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(_call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('searchRequest');
        cy.intercept(_call._addItemShoppingCart).as('addNewItem');

        cy.VisitBrokeredEthical();

        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholeslaer(Wholeslaers.UD.Name);
            
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                cy.get(response.body.items).each(($item) => {
                    expect($item.wholesaler).to.equal(Wholeslaers.UD.Name);
                })

                let i = randomItem();
                
                let itemId = response.body.items[i].id;
                let itemDescription = response.body.items[i].description;
                cy.wrap(itemId).as('itemId');
                cy.wrap(itemDescription).as('itemDescription');
                cy.log(itemId);
                cy.log(itemDescription);

            })

            cy.get('@itemDescription').then((value) => {
                searchBarEl.searchTxt().type(value);
                searchBarEl.searchBtn().click();
            })

            cy.wait('@searchRequestwiththeText').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                cy.get('@itemDescription').then((description) => {
                    cy.get(response.body.items).each(($item) => {
                        expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                    })
                })
            })
            
            cy.get('@itemId').then((id) => {
                cy.log("Update Item to move it to OOS state")
                cy.UpdateStockProductStock(0, 0, 0, id)
            })
            
            orderPageEl.UpQty().click()
            orderPageEl.valueQty().should('have.value', '1');
            orderPageEl.addItemCircle().click();
            
            cy.wait('@addNewItem').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.wait('@getShoppingCartItems').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    
                    cy.get('.summary-card').should('be.visible')
                    cy.get('.special-tab-title > span').should('be.visible').and('include.text', 'Out of Stock')
                    cy.get('.summary-items-span > span').should('be.visible').and('include.text', '1 item')
                    cy.get('.red-badge').should('be.visible')
                    cy.get('[rte="1xt"]').should('be.visible').and('include.text', '0 items')

                    cy.get('#slide-button > .fa-stack > .fa-circle-thin').click()

                        //title
                        cy.get('.selectedWholesaler-span').should('be.visible').and('include.text', 'Out of Stock')

                        cy.get('@itemDescription').then((itemdescription) => {
                            cy.get('.preferred-description').should('be.visible').and('include.text', itemdescription)

                        })


                    cy.get('#product-cart-card > .p-d-flex > .fa').should('be.visible')
                    cy.get('#product-cart-card > .p-d-flex').should('be.visible').and('include.text', 'Out Of Stock')
                    cy.get('.p-button-rounded > .p-button-icon').should('be.visible')



                })
            })
            
            cy.get('@itemId').then((id) => {
                cy.log("set back InStock Item to not ruine the test DB")
                cy.UpdateStockProductStock(1, 1, 1, id)
            })

        })

    });    
    
    it('Add UD item to the shopping cart -> Move to the OOS -> Reload page ', () => {
        cy.on('uncaught:exception', (err, runnable) => {

                    return false
        
                })
        
                
        
                cy.intercept(_call._searchWithText + '*').as('searchRequestwiththeText');
                cy.intercept(_call._getShoppingcart).as('getShoppingCartItems');
                cy.intercept(_call._filter_wholesaler + Wholeslaers.UD.Id + '*',).as('searchRequest');
                cy.intercept(_call._addItemShoppingCart).as('addNewItem');
        
                cy.VisitBrokeredEthical();
        
                cy.wait('@getShoppingCartItems').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    
                    cy.selectWholeslaer(Wholeslaers.UD.Name);
                    
                    cy.wait('@searchRequest').then(({ response }) => {
                        expect(response.statusCode).to.equal(200);
        
                        cy.get(response.body.items).each(($item) => {
                            expect($item.wholesaler).to.equal(Wholeslaers.UD.Name);
                        })
        
                        let i = randomItem();
                        
                        let itemId = response.body.items[i].id;
                        let itemDescription = response.body.items[i].description;
                        cy.wrap(itemId).as('itemId');
                        cy.wrap(itemDescription).as('itemDescription');
                        cy.log(itemId);
                        cy.log(itemDescription);
        
                    })
        
                    cy.get('@itemDescription').then((value) => {
                        searchBarEl.searchTxt().type(value);
                        searchBarEl.searchBtn().click();
                    })
        
                    cy.wait('@searchRequestwiththeText').then(({ response }) => {
                        expect(response.statusCode).to.equal(200);
        
                        cy.get('@itemDescription').then((description) => {
                            cy.get(response.body.items).each(($item) => {
                                expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                            })
                        })
                    })

                    orderPageEl.UpQty().click()
                    orderPageEl.valueQty().should('have.value', '1');
                    orderPageEl.addItemCircle().click();
                    cy.wait('@addNewItem').then(({ response }) => {
                        expect(response.statusCode).to.equal(200);
                        //here need to check the UD tem TAB
                        
                    })
                    
                    cy.get('@itemId').then((id) => {
                        cy.log("Update Item to move it to OOS state")
                        cy.UpdateStockProductStock(0, 0, 0, id)
                    })
                    
                    
                    
                    cy.reload()

                    cy.wait('@getShoppingCartItems').then(({ response }) => {
                        expect(response.statusCode).to.equal(200);
                        
                        cy.get('.summary-card').should('be.visible')
                        cy.get('.special-tab-title > span').should('be.visible').and('include.text', 'Out of Stock')
                        cy.get('.summary-items-span > span').should('be.visible').and('include.text', '1 item')
                        cy.get('.red-badge').should('be.visible')
                        cy.get('[rte="1xt"]').should('be.visible').and('include.text', '0 items')
    
                        cy.get('#slide-button > .fa-stack > .fa-circle-thin').click()
    
                            //title
                            cy.get('.selectedWholesaler-span').should('be.visible').and('include.text', 'Out of Stock')
    
                            cy.get('@itemDescription').then((itemdescription) => {
                                cy.get('.preferred-description').should('be.visible').and('include.text', itemdescription)
    
                            })
    
    
                        cy.get('#product-cart-card > .p-d-flex > .fa').should('be.visible')
                        cy.get('#product-cart-card > .p-d-flex').should('be.visible').and('include.text', 'Out Of Stock')
                        cy.get('.p-button-rounded > .p-button-icon').should('be.visible')
    
    
    
                    })
                    
                    cy.get('@itemId').then((id) => {
                        cy.log("set back InStock Item to not ruine the test DB")
                        cy.UpdateStockProductStock(1, 1, 1, id)
                    })
        
                })
    });
    
    // it('Load the page -> Move ULM item to the OOS -> Then Add item to the shopping cart', () => {
        
    // });
    it.only('Load the page -> Move PI item to the OOS -> Then Add item to the shopping cart', () => {
        cy.on('uncaught:exception', (err, runnable) => {

            return false

        })

        

        cy.intercept(_call._searchWithText + '*').as('searchRequestwiththeText');
        cy.intercept(_call._getShoppingcart).as('getShoppingCartItems');
        cy.intercept(_call._filter_wholesaler + Wholeslaers.PCO.Id + '*',).as('searchRequest');
        cy.intercept(_call._addItemShoppingCart).as('addNewItem');

        cy.VisitBrokeredEthical();

        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholeslaer(Wholeslaers.PCO.Name);
            
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                cy.get(response.body.items).each(($item) => {
                    expect($item.wholesaler).to.equal(Wholeslaers.PCO.Name);
                })

                let i = randomItem();
                
                let itemId = response.body.items[i].id;
                let itemDescription = response.body.items[i].description;
                cy.wrap(itemId).as('itemId');
                cy.wrap(itemDescription).as('itemDescription');
                cy.log(itemId);
                cy.log(itemDescription);

            })

            cy.get('@itemDescription').then((value) => {
                searchBarEl.searchTxt().type(value);
                searchBarEl.searchBtn().click();
            })

            cy.wait('@searchRequestwiththeText').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                cy.get('@itemDescription').then((description) => {
                    cy.get(response.body.items).each(($item) => {
                        expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                    })
                })
            })
            
            cy.get('@itemId').then((id) => {
                cy.log("Update Item to move it to OOS state")
                cy.UpdatePIStockProductStock(0, id)
            })
            
            orderPageEl.UpQty().click()
            orderPageEl.valueQty().should('have.value', '1');
            orderPageEl.addItemCircle().click();
            
            cy.wait('@addNewItem').then(({ response }) => {
                expect(response.statusCode).to.equal(200);
                
                cy.wait('@getShoppingCartItems').then(({ response }) => {
                    expect(response.statusCode).to.equal(200);
                    
                    ///карточка торчащая
                    cy.get('.summary-card').should('be.visible')
                    //название карточки OOS TAB
                    cy.get('[rte="1Be"] > span').should('be.visible').and('include.text', 'Out of Stock')
                    //кол во в корзине
                    cy.get('.summary-items-span > span').should('be.visible').and('include.text', '1 item')
                    //красный восклицательный 
                    cy.get('.ng-star-inserted > .p-badge').should('be.visible')
                    //кол-во в корзине 
                    cy.get('[rte="1xt"]').should('be.visible').and('include.text', '1 items')
                    
                    
                    
                    //открываем корзину
                    cy.get('#slide-button > .fa-stack > .fa-circle-thin').click()




                     //title
                    cy.get('.selectedWholesaler-span').should('be.visible').and('include.text', Wholeslaers.PCO.Name)

                    cy.get('@itemDescription').then((itemdescription) => {
                        cy.get('#description-span').should('be.visible').and('include.text', itemdescription)

                    })


                    cy.get('#product-cart-card > .p-d-flex > .fa').should('be.visible')
                    cy.get('#product-cart-card > .p-d-flex').should('be.visible').and('include.text', 'Out Of Stock')
                    cy.get('.p-button-rounded > .p-button-icon').should('be.visible')



                })
            })
            
            cy.get('@itemId').then((id) => {
                cy.log("set back InStock Item to not ruine the test DB")
                cy.UpdateStockProductStock(1, 1, 1, id)
            })

        })  
    });

    // it('Exclude No GMS = true', () => {
        
    // });
    // it('Add PI item to the shopping cart -> Move to the OOS', () => {
        
    // });
});


function randomItem() { // min and max included 
     const rndInt = Math.floor(Math.random() * 24) + 0;
     return rndInt;
  }