class searchBar{
    
    elements =
        {
            
            packTypeLabel: () => cy.get('[rte="1t9"] > .ng-valid > .p-dropdown > .p-dropdown-label'),
                                 
        }

    //     getSelectedPackType()
    // {
    //     this.elements.packTypeLabel().click();
    // }


    
}

module.exports = new searchBar();