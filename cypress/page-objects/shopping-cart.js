class shoppingCart {



    
    shoppingCartElements = 
        {

            preferedTitle: () => cy.get(`.title[rte='1BE']`),
            preferedStockNote: () => cy.get('.pref-exected-delivery')

        }

        
state_OOSShoppingCart(description){
    //Shopping cart tab is displayed
    cy.get('.summary-card').should('exist').and('be.visible');
                
    //Make sure Item moved to the OOS TAB
    cy.get('.special-tab-title > span').should('have.text', 'Out of Stock');
    cy.get('.summary-items-span').should('have.text', ' 1 item ');
    cy.get('.red-badge').should('be.visible')

    cy.get('.selectedWholesaler-span').should('have.text', ' Out of Stock ').and('be.visible');
    cy.get('.preferred-description').should('have.text', description).and('be.visible');
    cy.get('#product-cart-card > .p-d-flex > .fa').should('be.visible');
    cy.get('.p-d-flex > p').should('be.visible');
    cy.get('.p-button-rounded > .p-button-icon').should('be.visible');
    
}

state_UDShoppingCart(expectedDelivery, description, packsize, packtype){
    
    //leftSummaryCard
    cy.get('.summary-card').should('exist').and('be.visible');
    cy.get('[rte="1Be"] > span').should('have.text', 'United Drug').and('be.visible');
    cy.get('.summary-items-span').should('have.text', ' 1 item ').and('be.visible');
    cy.get('.ng-star-inserted > .p-badge').should('be.visible')
    cy.get('.inStock-span').should('have.text', ` In stock: ${expectedDelivery}`).and('be.visible');
    // cy.get('.inStock-span > .ng-star-inserted > span').should('have.text', `${expectedDelivery}`).and('be.visible');
    
    //title
    cy.get('.selectedWholesaler-span').should('have.text', ' United Drug ').and('be.visible');

    cy.get('#description-span')
    
    .should(($name) => {
        // expect($name).to.contain.text(description)
        expect($name).to.include.text(description.substring(0, 35))
      })
    // .should('be.visible').and('include.text', description);
    cy.get('#packSize-span > span').should('be.visible').and('include.text', packsize);
    cy.get('.packType-span > span').should('be.visible').and('include.text', packtype);
}


        

        


}

module.exports = new shoppingCart();

