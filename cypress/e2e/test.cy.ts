describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://dev-training-friend.blueberrytest.com/')

    /* ==== Generated with Cypress Studio ==== */
    cy.get('#email').clear('superadmin@bbconsult.co.uk');
    cy.get('#email').type('superadmin@bbconsult.co.uk');
    cy.get('#password').clear('increase762Value');
    cy.get('#password').type('increase762Value');
    cy.get('.p-button-label').click();
    cy.get('.cookie-banner-button > .p-element > .p-button-label').click();
    cy.get('a.ng-tns-c159-13 > .pi').click();
    cy.get('a.ng-tns-c159-20').click();
    cy.get('.add-button').click();
    cy.get('#name').clear('t');
    cy.get('#name').type('testcategory');
    cy.get('.p-button-label').click();
    cy.get('.p-inputtext').clear('t');
    cy.get('.p-inputtext').type('testcategory{enter}');
    cy.get('.vertical-align-middle').click();
    cy.get('.no-options > span').click();
    cy.get('.no-options > span').click();
    cy.get('.no-options > span').click();
    cy.get('.no-options > span').should('have.text', 'No Options Added');
    cy.get('.pi-plus-circle').click();
    cy.get(':nth-child(1) > .col-9 > #name').clear('o');
    cy.get(':nth-child(1) > .col-9 > #name').type('optionname');
    cy.get(':nth-child(2) > .col-9 > #name').clear('1');
    cy.get(':nth-child(2) > .col-9 > #name').type('13');
    cy.get('#pr_id_9-label').click();
    cy.get('#pr_id_9-label').click();
    cy.get('#pr_id_9-label').click();
    cy.get('#pr_id_9-label').should('have.text', 'Create New Master Option');
    cy.get('.col > .p-element').should('be.enabled');
    cy.get('.p-button-label').click();
    /* ==== End Cypress Studio ==== */
  })
})