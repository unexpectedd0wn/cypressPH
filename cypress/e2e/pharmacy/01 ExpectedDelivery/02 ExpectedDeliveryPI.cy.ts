const dayjs = require("dayjs");
import { APIRequests } from "../../../page-objects/api-routes";
import { Wholesalers } from "../../../support/enums";

function toCheckDataGrid(expectedDel: any) {
    cy.wait('@search').then(({ response }) => {
        expect(response.statusCode).to.equal(200);

        cy.get(response.body.items).each(($item: any, index) => {

            cy.get(`table tbody tr`).eq(index).find(`td`)
                .then(($tr) => {
                    return {
                        expectedDelivery: $tr[4].innerText,
                    }
                })
                .should(`deep.equal`, {
                    expectedDelivery: expectedDel
                })
        })
    })
}


function toGetCutOffTime(wholesalerId) {
    cy.sqlServer(`SELECT CutOff FROM GreyWholesalerCutOffs where WholesalerId = ${wholesalerId}`)
        .then((data) => {
            cy.log(`The result is: ${data}`);

            cy.wrap({
               cutOff: data
            }).as('wholesalerCutOff')
        })

    // cy.get('@wholesalerCutOff').then((time: any) => {

    //     cy.log(`Cutt off time is ${time}`);
    // })
}



function expectedDelivery(time: string ) {
    
    var dayOfWeek = dayjs().day();
    cy.log(`The day of week is: ${dayOfWeek}`)

    
    var tt = time.toString()
    var time1 = tt.split('T')[1];
    // var finaltime = time1[1];
    
    var currentDateTime = dayjs().format("HH:mm:ss:SSSZ");
    var time2 = currentDateTime;
    
    cy.log(`TIme from the DB: ${time1}`);
    cy.log(`Current date is: ${time2}`);
    
    
    // var time1Date= new Date("01/01/2000 "+time1);
    // var time2Date= new Date("01/01/2000 "+time2);

    // if(time1Date >= time2Date ){
    // cy.log("time1");
    // }else{
    //     cy.log("time2");
    // }
    
    
    
    
    
    
    
    
    
    if (Date.parse(time) <= Date.parse(currentDateTime)) {
        switch (dayOfWeek) {
            case 1:
               return "NEXT DAY";
            case 2:
                return "NEXT DAY";
            case 3:
                return "NEXT DAY";
            case 4:
                return "NEXT DAY";
            case 5:
                return "NEXT DAY";
            case 6:
                return "TUESDAY";
            case 7:
                return "TUESDAY";
            default:
                break;
        }

    } else {
        switch (dayOfWeek) {
            case 1:
               return "WEDNESDAY";
            case 2:
                return "THURSDAY";
            case 3:
                return "FRIDAY";
            case 4:
                return "SATURDAY";
            case 5:
                return "TUESDAY";
            case 6:
                return "TUESDAY";
            case 7:
                return "TUESDAY";
            default:
                break;
        }

    }
}

describe('Expected Delivery for PI items for each day', () => {
    
    
    it('1', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=wholesalerId&filters%5B0%5D.value=' + '*').as('search')
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });
        
        cy.visitPage("Brokered Ethical");
        cy.selectWholesaler(Wholesalers.IMED.Name)
        toGetCutOffTime(Wholesalers.IMED.Id);
        cy.get('@wholesalerCutOff').then((time: any) => {
            var expectedD = expectedDelivery(time);
            toCheckDataGrid(expectedD);
        })
    });

    it.only('2', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            return false
        })
        cy.intercept('/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=wholesalerId&filters%5B0%5D.value=' + '*').as('search')
        cy.fixture("main").then(data => {
            cy.signInCreateSession(data.pharmacyUserEmail, data.pharmacyUserPassword);
        });

        cy.visitPage("Brokered Ethical");
        cy.selectWholesaler(Wholesalers.LEXON.Name)
        toGetCutOffTime(Wholesalers.LEXON.Id);
        cy.get('@wholesalerCutOff').then((time: any) => {
            var expectedD = expectedDelivery(time);
            toCheckDataGrid(expectedD);
        })
    });
});