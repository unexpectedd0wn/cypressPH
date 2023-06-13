class loginPage{
    
    elements =
        {
            loginBtn : () => cy.get('#singin-btn'),
            emailTxt : () => cy.get('#email'),
            passwordTxt : () => cy.get('#password'),
        }


    clickOnLogin()
    {
        this.elements.loginBtn().click();
    }
    typeEmail(password)
    {
        this.elements.emailTxt().clear().type(password);
    }
    typePassword(email)
    {
        this.elements.passwordTxt().clear().type(email);
    }
}

module.exports = new loginPage();