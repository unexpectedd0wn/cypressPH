import { getRandomNumber } from "../../../../support/commonService";
import { SearchBar } from "../../../../page-objects/search-bar";
import { sql } from "../../../../support/sqlScripts";

const pharmacyId = Cypress.env("pharmacyId");

function getItemForTest() {
    
    
    cy.wait('@pageLoaded').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        
        togetRandomItem();
        toGetDataFromTheDatabase();

        
        
        function togetRandomItem() {
            
            var numberOfItems = response.body.items.length - 1;

            do {
                var i = getRandomNumber(numberOfItems);
                cy.wrap({
                    id: response.body.items[i].id
                }).as('itemId')

                cy.log("Found perfect item")

            } while (response.body.items[i].caseSize > 1);
        }

        function toGetDataFromTheDatabase() {
            cy.get('@itemId').then((item: any) => {
                cy.sqlServer(`SELECT Id, IPUCode, Description, PackSize, Type, NetPrice, Discount, TradePrice from Stockproducts WHERE Id = ${item.id}`)
                    .then((data: any) => {
                        cy.wrap({
                            id: data[0],
                            ipuCode: data[1],
                            description: data[2],
                            packSize: data[3],
                            packType: data[4],
                            netprice: data[5],
                            discount: data[6],
                            tradeprice: data[7]
                        }).as('item')
                    })
            })
        }
    })
}


function toCheckDataGrid() {
    cy.wait('@search').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        cy.get(response.body.items).each(($item: any, index) => {

            var numberOfItems = response.body.items.length;
            cy.get('#itemsCount > span').should('have.text',`Showing: ${numberOfItems} Items`)

            cy.get('@item').then((item: any) => {

                cy.get(`table tbody tr`).eq(index).find(`td`)
                        .then(($tr) => {
                            return {
                                description: $tr[0].innerText,
                                packsize: $tr[1].innerText,
                                tradeprice: $tr[5].innerText,
                                discount: $tr[9].innerText
                                

                            }
                        })
                        .should(`deep.equal`, {
                            description: item.description,
                            packsize: item.packSize,
                            tradeprice: `€${item.tradeprice.toFixed(2)}`, 
                            discount: `${item.discount.toFixed(2)}%`
                        })
            })
        })
    })
}

describe('', () => {
    
    beforeEach(() => {

        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })

        sql.cleanUpShoppingCart(pharmacyId);
        cy.intercept('/api/stock-product/products*').as('pageLoaded')
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=SearchString&filters%5B0%5D.value=*').as('search')
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
    });

    it('Search by Product Descritption | Brokered Ethical', () => {
        
        cy.visitPage("Brokered Ethical");
        
        getItemForTest();
        
        cy.visit('https://pharmax2-test-windows.blueberrytest.com/app');
        
        

        cy.get('@item').then((item: any) => {

            

            SearchBar.toSearchInTheGlobalSearch(item.description)

            cy.title().should('eq', 'Orders')

            SearchBar.elements.searchTxt().should('have.value', item.description)

            SearchBar.elements.globalSearchTextInput().should('have.text', '')
        })
        toCheckDataGrid();
        

        
        
    });
    it.only('Search by Product Descritption | Brokered OTC', () => {
        cy.visitPage("Brokered OTC");

        
        getItemForTest();
        
        cy.visit('https://pharmax2-test-windows.blueberrytest.com/app');

        cy.get('@item').then((item: any) => {

            SearchBar.toSearchInTheGlobalSearch(item.description)

            cy.title().should('eq', 'Orders') //potentional isse?low

            SearchBar.elements.searchTxt().should('have.value', item.description)

            SearchBar.elements.globalSearchTextInput().should('have.text', '')
        })

        cy.get('#itemsCount-brokered').should('have.text', 'Not showing 1 in Brokered OTC');
        cy.get('.brokeredCount').click();
        cy.get('#order-title').should('have.text', 'Brokered OTC');
        toCheckDataGrid();
    });
    it('Search by Product Descritption | Second Line', () => {
        //go to the ULM
        //Takes Item for the Test 
        //Go to the Home page 
        //To enter querry 
        //check Shoing block 
        //click 
        //check page and result 
    });
    it('Search by Product Descritption | ULM', () => {
        //go to the ULM
        //Takes Item for the Test 
        //Go to the Home page 
        //To enter querry 
        //check Shoing block 
        //click 
        //check page and result 
    });
    
});