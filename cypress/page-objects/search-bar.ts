export class Search{
    
    elements =
        {
            
            packTypeLabel: () => cy.get('[rte="1t9"] > .ng-valid > .p-dropdown > .p-dropdown-label'),
            packSizeTxt: () => cy.get('.filter-input > #packSize'),  
            searchTxt: () => cy.get('.p-inputgroup > .p-inputtext'),
            searchBtn: () => cy.get('.p-inputgroup-addon'),
            wholeslaerLabel: () => cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label'),
            
            
            globalSearchTextInput: () => cy.get('.filter-container > .p-inputtext'),
            globalSearchSearchButton: () => cy.get('.search-button > .p-button-rounded')
        }

    toSearchInTheGlobalSearch(searchquerry: string){
        this.elements.globalSearchTextInput().clear().type(searchquerry);
        this.elements.globalSearchSearchButton().should('be.visible').click();
    }
    
        searchByText(text){
        this.elements.searchTxt().clear().type(text);
        this.elements.searchBtn().click();

    }



    searchByPackSize(packsize){
        this.elements.packSizeTxt().clear().type(packsize)
    }

    getWholesalerLabel(){
        return this.elements.wholeslaerLabel();
    }

    

    


    
}

export const SearchBar = new Search();