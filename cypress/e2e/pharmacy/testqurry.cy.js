describe('test querry', () => {
    it('Pharmacy Setup', () => {
        
        
        const sql = `select PharmacyGroupId from Pharmacists where Id = '411'`;
        
        cy.sqlServer(sql).then(data => {
            cy.log(data);

            if (data == 1) {
                cy.log('Pharmacy group is TH')
            } else {
                cy.sqlServer(`UPDATE Pharmacists set PharmacyGroupId = 1 where Id = '411'`);
                cy.log('Pharmacy group UPDATED to TH')
            }
        });

        
        
        
    });

    it.only('', () => {
        //Create Prefere
        let createPrefered = cy.sqlServer(`INSERT INTO StockProducts VALUES ('1','0','18.52','10.30','44.38',NULL,'0','0','0','0','0','0','9999627279999',NULL,'999999','STARLING TABS 40MG (ACTAVIS)','GENERIC','100.00','100','99999','0','10','0','0',NULL,NULL,'0','NULL','NULL','NULL','NULL','1','NULL','NULL','NULL')`);
        let selectPreferedId =  cy.sqlServer(`select Id from StockProducts where Description = 'STARLING TABS 40MG (ACTAVIS)'`);
        cy.sqlServer(selectPreferedId).then(data => {
            cy.log(data);
            let preferedId = data;
        });
        //Create NextBest 
        //Create Group 
        //Add itms to the group
        //Set prefered 
    });
});