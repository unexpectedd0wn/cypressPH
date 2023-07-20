export class SqlScripts{
    
    /**
    * sql querry to clean up Pharmacy shopping cart and Subbstitution Tab 
    * @example sql.cleanUpShoppingCart(pharmacyId);
    */
    cleanUpShoppingCart(pharmacyId: number) {
        cy.sqlServer(`DELETE FROM ShoppingCartItems WHERE PharmacyId = ${pharmacyId}`);
        cy.sqlServer(`DELETE FROM BrokeredItems WHERE PharmacyId = ${pharmacyId}`);
    }

    /**
    * sql querry to add item to the Pharmacy Subbstitution Tab
    * qty is = 1
    * @example sql.addItemToSubstitutionTab(preferedId, pharmacyId, IPUcode, currentDateTime);
    */
    addItemToSubstitutionTab(preferedId: number, pharmacyId: number, ipuCode: number, datetime: Date) {
        cy.sqlServer(`INSERT INTO BrokeredItems VALUES (${preferedId},${pharmacyId},'1',${ipuCode}, '${datetime}')`);
    }

    /**
    * sql querry to update Pharmacy settings
    * @example sql.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);
    */
    updatePharmacy(useCutOff: number, cutOffTime: string, normalDepotId: number, mainDepotId: number, pharmacyId: number) {
        cy.sqlServer(`UPDATE Pharmacists SET UseCutOff = ${useCutOff}, CutOffTime = ${cutOffTime}, NormalDepotId = ${normalDepotId}, MainDepotId = ${mainDepotId} where Id = ${pharmacyId}`);
    }

    /**
    * sql querry to update Stock values for the UD item
    * @example sql.updateUDStockProductStock(0, 0, 0, preferedId);
    */
    updateUDStockProductStock(InBallinaStock, InDublinStock, InLimerickStock, stockProductId) {
        cy.sqlServer(`UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${stockProductId}`);
    }

    /**
    * sql querry to update Pharmacy settings: Exclude No GMS, 
    * Means, if value set to 0, on the Order pages, for the specific Pharmacy
    * system will show items where GmsCode = null or PENDING
    * In case when value set to 1, then on the Order pages, system should not 
    * shown the items where GmsCode = null or PENDING
    * @example sql.updatePharmacySetExcludeNoGms(1, pharmacyId);
    */
    updatePharmacySetExcludeNoGms(excludeNoGms , pharmacyId) {
        cy.sqlServer(`UPDATE Pharmacists SET ExcludeNoGMS = ${excludeNoGms} where Id = ${pharmacyId}`);
    }

    /**
    * sql querry to update Pharmacy settigs: Use Paralells
    * In case where useGreys = 0, on the Order pages system doesn't shows PI items(!= United Drug)
    * @example sql.updatePharmacySetUseGreys(1, pharmacyId)
    */
    updatePharmacySetUseGreys(useGreys, pharmacyId) {
        cy.sqlServer(`UPDATE Pharmacists SET UseGreys = ${useGreys} where Id = ${pharmacyId}`);
    }

    /**
    * sql querry to update Pharmacy settigs: Use Paralells
    * In case where useGreys = 0, on the Order pages system doesn't shows PI items(!= United Drug)
    * @example sql.toUpdatePharmacyPricesDiscounts(0,0,pharmacyId)
    */
    toUpdatePharmacyPricesDiscounts(showUdNetPrices , show2ndLine, pharmacyId) {
        cy.sqlServer(`UPDATE Pharmacists SET ShowUdNetPrices = ${showUdNetPrices}, Show2ndLine = ${show2ndLine} where Id = ${pharmacyId}`);
    }


}

export const sql = new SqlScripts();

