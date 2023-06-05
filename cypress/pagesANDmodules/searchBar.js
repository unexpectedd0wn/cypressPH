class searchBar{
    
    searchBarEl =
        {
            
            packTypeLabel: () => cy.get('[rte="1t9"] > .ng-valid > .p-dropdown > .p-dropdown-label'),
            packSizeTxt: () => cy.get('.filter-input > #packSize'),  
            searchTxt: () => cy.get('.p-inputgroup > .p-inputtext'),
            searchBtn: () => cy.get('.p-inputgroup-addon'),                 
        }

    


    
}

module.exports = new searchBar();