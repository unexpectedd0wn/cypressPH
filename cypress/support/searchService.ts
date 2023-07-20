import { SearchBar } from "../page-objects/search-bar";

export function clearFilter() {
    cy.contains("Clear filters")
        .should('be.visible')
        .click();
    cy.wait('@clearFiltersRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
        
        SearchBar.elements.packSizeTxt().should('be.empty');
        SearchBar.elements.packTypeLabel().should('have.text', 'All');
    })
}

export


export function toSearchByPackSizeAndCheckResponse() {
    
    let packSizeArray = ['30', '5ML', '5X3ML'];
    packSizeArray.forEach(selectedPackSize => {
        
        SearchBar.elements.packSizeTxt().type(selectedPackSize).type('{enter}');
        SearchBar.elements.searchBtn().click();

        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            var packSize = selectedPackSize;
            
            if (response.body.items.length == 0) {
                cy.log("The server return 0 result.All is fine")
                cy.get('.p-datatable-footer > .p-d-flex').should('be.visible').and('include.text', 'No records found')
            } else {
                cy.get(response.body.items).each(($item: any) => {
                    expect($item.packSize.toLowerCase()).to.contain(packSize.toLowerCase());
                })
            
            }
        })
    });
} 