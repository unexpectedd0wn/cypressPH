import intercept from "../../pages/routes";
import { _call } from "../../pages/routes";
import { orderPageEl } from "../../pages/OrderPages";
import { searchBarEl } from "../../pages/searchBar";

describe('The test cases for the check that the system correct works with the OOS items', () => {
    
    before(() => {
        cy.CleanUpShoppingCart(Cypress.env("pharmacyId"));
    });

    beforeEach(() => {
        
        cy.fixture("main").then(data => {
            cy.LoginAndCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });
    it.only('Load the page -> Move UD item to the OOS -> Then Add item to the shopping cart', () => {
        cy.on('uncaught:exception', (err, runnable) => {

            return false

        })

        let wholeslaer = "United Drug";

        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=SearchString&filters%5B0%5D.value=' + '*',
        ).as('searchRequestwiththeText');
        cy.intercept('/api/pharmacy/shoppingcart*').as('getShoppingCartItems');
        cy.intercept(_call._filter_wholesaler + 1 + '*',).as('searchRequest');
        cy.intercept('/api/stock-product/cart/add*').as('addNewItem')

        cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
        cy.title().should('eq', 'Orders-Brokered Ethical');


        cy.wait('@getShoppingCartItems').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            
            cy.selectWholeslaer(wholeslaer);
            
            cy.wait('@searchRequest').then(({ response }) => {
                expect(response.statusCode).to.equal(200);

                cy.get(response.body.items).each(($item) => {
                    expect($item.wholesaler).to.equal(wholeslaer);
                })

                let i = randomItem();
                cy.log(nItem);
                let itemId = response.body.items[i].id;
                let itemDescription = response.body.items[i].description;
                cy.wrap(itemId).as('itemId');
                cy.wrap(itemDescription).as('itemDescription');

            })

            cy.get('@itemDescription').then((value) => {
                cy.get('.p-inputgroup > .p-inputtext').type(value);
                cy.get('.p-inputgroup-addon').click();

            })

            cy.wait('@searchRequestwiththeText').then(({ response }) => {
                expect(response.statusCode).to.equal(200);



                // cy.get('@itemDescription').then((description) => {
                //     cy.get(response.body.items).each(($item) => {
                //         expect($item.description.toLowerCase()).to.contain(description.toLowerCase());
                //     })

                // })

            })
            cy.get('@itemid').then((id) => {

                cy.UpdateStockProductStock(0, 0, 0, id)
            })
            //up
            cy.get('.whiteRow > .qty-column > .p-d-flex > .qty > .p-inputnumber > .p-inputnumber-button-group > .p-inputnumber-button-up > .p-button-icon').click()
            //add
            cy.get('.pi-plus-circle').click();

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

                    cy.get('@itemdescription').then((itemdescription) => {
                        cy.get('.preferred-description').should('be.visible').and('include.text', itemdescription)

                    })


                    cy.get('#product-cart-card > .p-d-flex > .fa').should('be.visible')
                    cy.get('#product-cart-card > .p-d-flex').should('be.visible').and('include.text', 'Out Of Stock')
                    cy.get('.p-button-rounded > .p-button-icon').should('be.visible')



                })
            })
            cy.get('@itemid').then((id) => {

                cy.UpdateStockProductStock(1, 1, 1, id)
            })

        })

    });    
        
    

        
        
        

        


    
    
    // it('Load the page -> Move ULM item to the OOS -> Then Add item to the shopping cart', () => {
        
    // });
    // it('Load the page -> Move PI item to the OOS -> Then Add item to the shopping cart', () => {
        
    // });
    // it('Add UD item to the shopping cart -> Move to the OOS', () => {
        
    // });
    // it('Exclude No GMS = true', () => {
        
    // });
    // it('Add PI item to the shopping cart -> Move to the OOS', () => {
        
    // });
});


function randomItem() { // min and max included 
     const rndInt = Math.floor(Math.random() * 24) + 0;
     return rndInt;
  }