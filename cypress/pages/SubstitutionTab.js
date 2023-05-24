class substitutionTab {
    
    OOS_Message(depot) {
        let message = ` Out of Stock ${depot} `;
        return message;
    }
    
    BackInStock_Message(depot) {
        let message = ` Back In Stock ${depot} `;
        return message;
    }
    
    OOS_OOS_Message(depotMain, depotCutoff) {
        let message = `Out of Stock ${depotMain},  Out of Stock ${depotCutoff} `;
        return message;
    }
    
    OOS_BackInStock_Message(depotMain, depotCutoff) {
        let message = `Out of Stock ${depotMain},  Back In Stock ${depotCutoff} `;
        return message;
    }

    substitutionTabElements = {
        preferedTitle: () => cy.get(`.title[rte='1BE']`),
        preferedStockNote: () => cy.get('.pref-exected-delivery'),
        preferedNetPrice: () => cy.get(`div[class='preferred p-d-flex'] p[class='net-price ng-star-inserted']`),
        preferedDescription: () => cy.get(`div[class='preferred p-d-flex'] p[class='preferred-description']`),
        preferedExpectedDeliveryText: () => cy.get('.preferred-expected-delivery > span'),
        preferedExpectedDeliveryTick: () => cy.get('.preferred-expected-delivery > .fa'),

        expectedDeliveryTick: () => cy.get(`.fa.fa-check`),
        expectedDeliveryText: () => cy.get(`#product-cart-card > div.quantity-column.p-d-flex.p-flex-column.p-ai-end.ng-star-inserted > div.next-best-expected-delivery.ng-star-inserted`),

        orderButton: () => cy.get(`.cart-order-btn.p-button.p-component`),
        qtyInput: () => cy.get(`.p-d-flex.pharmax-input`),
        deleteIcon: () => cy.get(`.p-button-icon.fa.fa-trash-o`),

        nextBestTitle: () => cy.get(`div[class='selected-info p-d-flex ng-star-inserted'] p[class='title']`),
        nextBestDescription: () => cy.get(`div[class='selected-info p-d-flex ng-star-inserted'] p[class='preferred-description']`),
        nextBestNetPrice: () => cy.get(`div[class='selected-info p-d-flex ng-star-inserted'] p[class='net-price ng-star-inserted']`)
    }

    CheckSubstitutionState_PreferedToNextBest(StockNote, preferedDescription, nextBestDescription, ExpectedDelivery) {
        /*
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            |                       |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  | Prefered:  | Prefered.Description  |           | Order btn    |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            | Stock note            |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            | NetPrice (Discount)   |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  | Next Best: | Next Best.Description | Expected  | Qty | Delete |  |
            |  |            |                       | Delivery  |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
            |  |            |                       |           |     |        |  |
            +--+------------+-----------------------+-----------+-----+--------+--+
        */
        this.substitutionTabElements.preferedTitle().should('be.visible').and('have.text','Preferred:')
        this.substitutionTabElements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(255, 0, 0)');
        this.substitutionTabElements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        this.substitutionTabElements.preferedNetPrice().should('be.visible');

        this.substitutionTabElements.nextBestTitle().should('have.text','Next Best:');
        this.substitutionTabElements.nextBestDescription().should('be.visible').and('include.text', nextBestDescription);
        this.substitutionTabElements.nextBestNetPrice().should('be.visible');


        this.substitutionTabElements.expectedDeliveryText().should('have.text', ExpectedDelivery);
        this.substitutionTabElements.expectedDeliveryTick().should('be.visible');
        this.substitutionTabElements.orderButton().should('be.visible');
        this.substitutionTabElements.qtyInput().should('be.visible');
        this.substitutionTabElements.deleteIcon().should('be.visible');
    }

    CheckSubstitutionState_PreferedNoOrder(StockNote, preferedDescription) {
        /*
        +--+-----------+----------------------+--+--+--------+--+
        |  |           |                      |  |  |        |  |
        +--+-----------+----------------------+--+--+--------+--+
        |  | Prefered: | Prefered.Description |  |  | Delete |  |
        +--+-----------+----------------------+--+--+--------+--+
        |  |           | Stock notes          |  |  |        |  |
        +--+-----------+----------------------+--+--+--------+--+
        |  |           |                      |  |  |        |  |
        +--+-----------+----------------------+--+--+--------+--+
        */
        this.substitutionTabElements.preferedTitle().should('have.text','Preferred:');
        this.substitutionTabElements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(255, 0, 0)');
        this.substitutionTabElements.preferedNetPrice().should('not.exist');
        this.substitutionTabElements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        
        this.substitutionTabElements.nextBestTitle().should('not.exist');
        this.substitutionTabElements.nextBestDescription().should('not.exist');
        this.substitutionTabElements.nextBestNetPrice().should('not.exist');
        
        this.substitutionTabElements.expectedDeliveryText().should('not.exist');
        this.substitutionTabElements.expectedDeliveryTick().should('not.exist');
        this.substitutionTabElements.orderButton().should('not.exist');
        this.substitutionTabElements.qtyInput().should('not.exist');
                
        this.substitutionTabElements.deleteIcon().should('be.visible');

    }   

    CheckSubstitutionState_PreferedOrder(StockNote, preferedDescription, ExpectedDelivery) {
        /*
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           |                      |  |          |     |  |     |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  | Prefered: | Prefered.Description |  | Expected |     | Order  |  |
        |  |           |                      |  | Delivery |     |        |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           | Stock notes          |  |          |     |  |     |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           | Net Price (Discount) |  |          | QTY |  | DEL |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        |  |           |                      |  |          |     |  |     |  |
        +--+-----------+----------------------+--+----------+-----+--+-----+--+
        */
        this.substitutionTabElements.preferedTitle().should('have.text','Preferred:')
        this.substitutionTabElements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
        this.substitutionTabElements.preferedNetPrice().should('be.visible')
        this.substitutionTabElements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        
        this.substitutionTabElements.nextBestTitle().should('not.exist')
        this.substitutionTabElements.nextBestDescription().should('not.exist')
        this.substitutionTabElements.nextBestNetPrice().should('not.exist')
        
        
        this.substitutionTabElements.preferedExpectedDeliveryText().should('have.text', ExpectedDelivery)
        this.substitutionTabElements.preferedExpectedDeliveryTick().should('be.visible')
        
        this.substitutionTabElements.orderButton().should('be.visible')
        this.substitutionTabElements.qtyInput().should('be.visible')
        this.substitutionTabElements.deleteIcon().should('be.visible')
    }


    CheckSubstitutionState_SelectPrefereNextBest(StockNote, preferedDescription, nextBestDescription, preferedExpectedDelivery, nextbestExpectedDelivery) {
        
    this.substitutionTabElements.preferedTitle().should('have.text','Preferred:')
        this.substitutionTabElements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
        this.substitutionTabElements.preferedNetPrice().should('be.visible')
        this.substitutionTabElements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        cy.get('.p-radiobutton-box.p-highlight').should('be.visible')
        cy.get('.next-day-text').should('have.text', preferedExpectedDelivery)
        
        this.substitutionTabElements.nextBestTitle().should('have.text','Next Best:');
        this.substitutionTabElements.nextBestDescription().should('be.visible').and('include.text', nextBestDescription);
        this.substitutionTabElements.nextBestNetPrice().should('be.visible');
        cy.get('.selected-info > .ng-untouched > .p-radiobutton > .p-radiobutton-box').should('be.visible')
        cy.get('.next-best-expected-delivery > span').should('have.text', nextbestExpectedDelivery)
        
        
        // this.substitutionTabElements.preferedExpectedDeliveryText().should('have.text', ExpectedDelivery)
        // this.substitutionTabElements.preferedExpectedDeliveryTick().should('be.visible')
        
        this.substitutionTabElements.orderButton().should('be.visible')
        this.substitutionTabElements.qtyInput().should('be.visible')
        this.substitutionTabElements.deleteIcon().should('be.visible')
    }


}

module.exports = new substitutionTab();

