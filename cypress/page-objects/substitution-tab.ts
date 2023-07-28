export class Substitution {
    
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

    elements = {
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

    /**
    * @example 
    * SubstitutionTab.state_PreferedToNextBest(
                    SubstitutionTab.OOS_OOS_Message(depot.Ballina, depot.Dublin),
                    preferedDescription,
                    nextBestDescription,
                    expectedDelivery.NextDay
                )
    */
    state_PreferredToNextBest(StockNote: string, preferedDescription: string, nextBestDescription:string, ExpectedDelivery: string) {
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
        this.elements.preferedTitle().should('be.visible').and('have.text','Preferred:')
        this.elements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(255, 0, 0)');
        this.elements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        this.elements.preferedNetPrice().should('be.visible');

        this.elements.nextBestTitle().should('have.text','Next Best:');
        this.elements.nextBestDescription().should('be.visible').and('include.text', nextBestDescription);
        this.elements.nextBestNetPrice().should('be.visible');


        this.elements.expectedDeliveryText().should('have.text', ExpectedDelivery);
        this.elements.expectedDeliveryTick().should('be.visible');
        this.elements.orderButton().should('be.visible');
        this.elements.qtyInput().should('be.visible');
        this.elements.deleteIcon().should('be.visible');
    }

    state_PreferredNoOrder(StockNote, preferedDescription) {
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
        this.elements.preferedTitle().should('have.text','Preferred:');
        this.elements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(255, 0, 0)');
        this.elements.preferedNetPrice().should('not.exist');
        this.elements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        
        this.elements.nextBestTitle().should('not.exist');
        this.elements.nextBestDescription().should('not.exist');
        this.elements.nextBestNetPrice().should('not.exist');
        
        this.elements.expectedDeliveryText().should('not.exist');
        this.elements.expectedDeliveryTick().should('not.exist');
        this.elements.orderButton().should('not.exist');
        this.elements.qtyInput().should('not.exist');
                
        this.elements.deleteIcon().should('be.visible');

    }   

    state_PreferredOrder(StockNote, preferedDescription, ExpectedDelivery) {
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
        this.elements.preferedTitle().should('have.text','Preferred:')
        this.elements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
        this.elements.preferedNetPrice().should('be.visible')
        this.elements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        
        this.elements.nextBestTitle().should('not.exist')
        this.elements.nextBestDescription().should('not.exist')
        this.elements.nextBestNetPrice().should('not.exist')
        
        
        this.elements.preferedExpectedDeliveryText().should('have.text', ExpectedDelivery)
        this.elements.preferedExpectedDeliveryTick().should('be.visible')
        
        this.elements.orderButton().should('be.visible')
        this.elements.qtyInput().should('be.visible')
        this.elements.deleteIcon().should('be.visible')
    }


    state_SelectOptionPreferredNextBest(StockNote, preferedDescription, nextBestDescription, preferedExpectedDelivery, nextbestExpectedDelivery) {
        
        this.elements.preferedTitle().should('have.text','Preferred:')
        this.elements.preferedStockNote().should('have.text', StockNote).and('have.css', 'color', 'rgb(104, 159, 56)');
        this.elements.preferedNetPrice().should('be.visible')
        this.elements.preferedDescription().should('be.visible').and('include.text', preferedDescription);
        cy.get('.p-radiobutton-box.p-highlight').should('be.visible')
        cy.get('.next-day-text').should('have.text', preferedExpectedDelivery)
        
        this.elements.nextBestTitle().should('have.text','Next Best:');
        this.elements.nextBestDescription().should('be.visible').and('include.text', nextBestDescription);
        this.elements.nextBestNetPrice().should('be.visible');
        cy.get('.selected-info > .ng-untouched > .p-radiobutton > .p-radiobutton-box').should('be.visible')
        cy.get('.next-best-expected-delivery > span').should('have.text', nextbestExpectedDelivery)
        
        this.elements.orderButton().should('be.visible')
        this.elements.qtyInput().should('be.visible')
        this.elements.deleteIcon().should('be.visible')
    }
}
export const SubstitutionTab = new Substitution();

