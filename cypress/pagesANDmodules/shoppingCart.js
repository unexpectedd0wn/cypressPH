class shoppingCart {
    
    shoppingCartElements = 
        {

            preferedTitle: () => cy.get(`.title[rte='1BE']`),
            preferedStockNote: () => cy.get('.pref-exected-delivery')

        }


        

        


}

module.exports = new shoppingCart();

