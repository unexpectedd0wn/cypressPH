class orderPage{
    
    el =
        {
            searchTxt : () => cy.get('.p-inputgroup > .p-inputtext'),
            searchBtn: () => cy.get('.p-inputgroup-addon'),
            caseSizeBadge: () => cy.get('.badge'),
        }


    typeInSearchBox(value)
    {
        
        this.el.searchTxt().type(value)
    }
    clickOnSearchBtn()
    {
        
        this.el.searchBtn().click()
    }
    typeAndClickSearch(value)
    {
        this.el.searchTxt().type(value)
        this.el.searchBtn().click()
    }
    getCaseSizeBudge()
    {
        return cy.get('.badge');
    }
    
}

module.exports = new orderPage();