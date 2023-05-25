class searchBar{
    
    searchBarEl =
        {
            
            packTypeLabel: () => cy.get('[rte="1t9"] > .ng-valid > .p-dropdown > .p-dropdown-label'),
            packSizeTxt: () => cy.get('.filter-input > #packSize'),                   
        }

    


    
}

module.exports = new searchBar();