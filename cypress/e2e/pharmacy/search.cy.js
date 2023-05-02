import { after } from "mocha";
import searchBar from "../../pages/searchBar";
import intercept from "../../pages/interceptRequests";

describe('Brokered Ethical| Search & Filter bar', () => {
    
    beforeEach(() => {
        cy.fixture("main").then(data => {
            cy.login(data.pharmacyUserEmail, data.pharmacyUserPassword);
            cy.visit(Cypress.env("devURL") + "/app/orders/brokeredEthical?filterBy=brokeredEthical");
            cy.title().should('eq','Orders-Brokered Ethical');
        });
    });

    after(() => {
      cy.clearAllCookies();
      cy.clearAllSessionStorage();
    })
    
    it.only('Filter "PackType"| Apply then Clear', () => {
        let packtype = getPackType();

        cy.intercept(interceptRequests.request.pack_type + packtype + '*',)
            .as('searchRequest');
        cy.intercept(interceptRequests.request.ClearFilter + '*',)
            .as('clearFiltersRequest');

        cy.selectPackType(packtype);
        cy.log('check selected value')
        searchBar.elements.packTypeLabel().should('have.text', packtype);

        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.get(response.body.items).each(($item) => {
                expect($item.packType.toLowerCase()).to.contain(packtype.toLowerCase());
            })
        })

        cy.contains("Clear filters").should('be.visible').click();
        cy.log('check selected value is All')
        searchBar.elements.packTypeLabel().should('have.text', 'All');
        cy.wait('@clearFiltersRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
    })

    it.only('Filter "PackSize"| Apply then Clear', () => {

        let packsize = getPackSize();
        cy.intercept(interceptRequests.request.pack_size + packsize + '*',).as('searchRequest');
        cy.intercept(interceptRequests.request.ClearFilter + '*',).as('clearFiltersRequest');
        cy.get('#packSize').type(packsize);
        cy.get('.p-inputgroup-addon').click();
        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.get(response.body.items).each(($item) => {
                expect($item.packSize.toLowerCase()).to.contain(packsize.toLowerCase());
            })
        })

        cy.contains("Clear filters").should('be.visible').click();
        cy.get('#packSize').should('be.empty');
        cy.wait('@clearFiltersRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
    })

    it('Filter "Wholesaler"| Apply then Clear', () => {

        let value = getWholesaler();
        let wId = getWholesaledId();
        cy.intercept(intercept.requestWith.wholesaler + wId + '*',).as('searchRequest');
        cy.intercept(intercept.requestWith.ClearFilter + '*',).as('clearFiltersRequest');


        
        cy.selectWholeslaer(value)
        cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', value);

        cy.wait('@searchRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
            cy.get(response.body.items).each(($item) => {
                expect($item.wholesalerId).to.equal(wId);
            })
        })

        cy.contains("Clear filters").should('be.visible').click();

        cy.get('[rte="1tc"] > .ng-valid > .p-dropdown > .p-dropdown-label').should('have.text', 'All');
        cy.wait('@clearFiltersRequest').then(({ response }) => {
            expect(response.statusCode).to.equal(200);
        })
    })
    
        it.only('Filter "Expected Delivery"| Apply then Clear', () => {
      
        let value = "Same Day Delivery";
        cy.visit(Cypress.env("DEV") + "app/orders/brokeredEthical?filterBy=brokeredEthical");
        cy.title().should('eq','Orders-Brokered Ethical');
        // cy.get('#clear-button').should('have.class','p-ink p-ink-active');
        cy.intercept('/api/stock-product/products?*').as('searchRequest');

        cy.get("p-dropdown")
        .then(selects => {
            const select = selects[2];
            cy.wrap(select)
                .click()
                .get("p-dropdownitem")
                .get(".ng-tns-c56-14")
                .get(".ng-star-inserted")
                .contains(new RegExp("^" + value + "$", "g"))
                .then(item => {
                    cy.wrap(item).click({force: true});
                });
        });
        
        
        cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label').should('have.text', value);
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        cy.contains("Clear filters").should('be.visible').click();
        
        cy.get('[rte="1ti"] > .p-inputwrapper-filled > .p-dropdown > .p-dropdown-label').should('have.text', 'In-Stock');
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);
        
        
      })
      it.only('Search by Description | Apply and Clear', () => {
        
        let value = 'abilify';
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=SearchString&filters%5B0%5D.value='+ value +'*',
        ).as('searchRequest');
        
        cy.get('.p-inputgroup > .p-inputtext').type(value);
        cy.get('.p-inputgroup-addon').click();
          cy.wait('@searchRequest').then(({response}) => {
          expect(response.statusCode).to.equal(200);
          
          cy.get(response.body.items).each(($item) => {
            expect($item.description.toLowerCase()).to.contain(value.toLowerCase());
          })
        })

        cy.contains("Clear filters").should('be.visible').click();
        cy.get('.p-inputgroup > .p-inputtext').should('be.empty');
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        cy.get('.p-inputgroup > .p-inputtext').type("ACCU");
        cy.get('.p-inputgroup-addon').click();
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        cy.contains("Clear filters").should('be.visible').click();
        cy.get('.p-inputgroup > .p-inputtext').should('be.empty');
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        
      })
      it.only('Search by GMSCode | ', () => {
        //api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters[0].propertyName=SearchString&filters[0].value=abilify&filters[0].$type=string&filters[0].matchMode=0
        
        // let gmscode = getGMScode();
        cy.visit(Cypress.env("DEV") + "app/orders/brokeredEthical?filterBy=brokeredEthical");
        cy.title().should('eq','Orders-Brokered Ethical');
        
        //https://pharmax2-test-windows.blueberrytest.com/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters[0].propertyName=expectedDelivery&filters[0].value=0&filters[0].$type=number&filters[0].matchMode=0&filters[1].propertyName=brokeredEthical&filters[1].value=true&filters[1].$type=boolean
        ///api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=brokeredEthical&filters%5B1%5D.value=true&filters%5B1%5D.$type=boolean
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters*',
        ).as('getData');
        cy.wait('@getData').then(({response}) => {
          expect(response.statusCode).to.equal(200);
          
          function()
          {
            cy.get(response.body.items[0]).then(($item) => {
              var gmsCodefrompage = get($item.gmsCode);
              return gmsCodefrompage;
              
            })
          }
          
          
          
          
        })
        cy.log(gmsCodefrompage);
        
        
        
        
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=GMSCode&filters%5B0%5D.value='+ gmscode +'*',
        ).as('searchRequest');
        
        cy.get('.p-inputgroup > .p-inputtext').type(gmscode);
        cy.get('.p-inputgroup-addon').click();
          cy.wait('@searchRequest').then(({response}) => {
          expect(response.statusCode).to.equal(200);
          
          cy.get(response.body.items).each(($item) => {
            expect($item.gmsCode).to.contain(gmscode);
          })
        })

        cy.contains("Clear filters").should('be.visible').click();
        cy.get('.p-inputgroup > .p-inputtext').should('be.empty');
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        cy.get('.p-inputgroup > .p-inputtext').type("ACCU");
        cy.get('.p-inputgroup-addon').click();
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        cy.contains("Clear filters").should('be.visible').click();
        cy.get('.p-inputgroup > .p-inputtext').should('be.empty');
        cy.wait('@searchRequest').its('response.statusCode').should('eq', 200);

        
      })

    function getWholesaler(params) {
        var wholeslaersList = ['United Drug','IMED','PCO','Lexon'];
        var wholeslaer = wholeslaersList[Math.floor( Math.random() * wholeslaersList.length )];
           return wholeslaer;
    }
    function getPackType(params) {
        var packtypesList = ['BRAND','EU PACK','FRIDGE','GENERIC', 'OTC','ULM'];
        var packType = packtypesList[Math.floor( Math.random() * packtypesList.length )];
           return packType;
    }
    function getPackSize(params) {
        var packsizeList = ['30','5ML','5X3ML', '28CAPS'];
        var packSize = packsizeList[Math.floor( Math.random() * packsizeList.length )];
           return packSize;
    }
    function getGMScode(params) {
      var packsizeList = ['12550','12551','11887'];
      var packSize = packsizeList[Math.floor( Math.random() * packsizeList.length )];
         return packSize;
    }
    function getWholesaledId() {

      switch (value) {
        case "United Drug":
          return 1;
          break;
        case "PCO":
          return 2;
          break;
        case "Lexon":
          return 6;
          break;
        case "IMED":
          return 4;
          break;
        case "Clinigen":
          return 7;
          break;
        case "O’Neills":
          return 5;
          break;
        default:
          return 0;
          break;
      }
    }




      
      

      
     
