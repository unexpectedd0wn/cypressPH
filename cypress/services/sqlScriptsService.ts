export class SqlScripts {
  /**
   * sql query to clean up Pharmacy shopping cart and Substitution Tab
   * @example sql.cleanUpShoppingCart(pharmacyId);
   */
  cleanUpShoppingCart(pharmacyId: number) {
    cy.sqlServer(
      `DELETE FROM ShoppingCartItems WHERE PharmacyId = ${pharmacyId}`
    );
    cy.sqlServer(`DELETE FROM BrokeredItems WHERE PharmacyId = ${pharmacyId}`);
  }

  /**
   * sql query to add item to the Pharmacy Substitution Tab
   * qty is = 1
   * @example sql.addItemToSubstitutionTab(preferredId, pharmacyId, ipuCode, currentDateTime);
   */
  addItemToSubstitutionTab(
    preferredId: number,
    pharmacyId: number,
    ipuCode: number,
    datetime: Date
  ) {
    cy.sqlServer(
      `INSERT INTO BrokeredItems VALUES (${preferredId},${pharmacyId},'1',${ipuCode}, '${datetime}')`
    );
  }

  /**
   * sql querry to update Pharmacy settings
   * @example sql.updatePharmacy(useCutOff.yes, cutOffTime.before, localaDepot.Ballina, cutoffDepot.Dublin, pharmacyId);
   */
  updatePharmacy(
    useCutOff: number,
    cutOffTime: string,
    normalDepotId: number,
    mainDepotId: number,
    pharmacyId: number
  ) {
    cy.sqlServer(
      `UPDATE Pharmacists SET UseCutOff = ${useCutOff}, CutOffTime = ${cutOffTime}, NormalDepotId = ${normalDepotId}, MainDepotId = ${mainDepotId} where Id = ${pharmacyId}`
    );
  }

  /**
   * sql querry to update Stock values for the UD item
   * @example sql.updateUDStockProductStock(0, 0, 0, preferredId);
   */
  updateUDStockProductStock(
    InBallinaStock: number,
    InDublinStock: number,
    InLimerickStock: number,
    stockProductId: number
  ) {
    cy.sqlServer(
      `UPDATE StockProducts SET InBallinaStock = ${InBallinaStock}, InDublinStock = ${InDublinStock}, InLimerickStock = ${InLimerickStock}  where Id = ${stockProductId}`
    );
  }

  /**
   * sql query to update Pharmacy settings: Exclude No GMS,
   * Means, if value set to 0, on the Order pages, for the specific Pharmacy
   * system will show items where GmsCode = null or PENDING
   * In case when value set to 1, then on the Order pages, system should not
   * shown the items where GmsCode = null or PENDING
   * @example sql.updatePharmacySetExcludeNoGms(1, pharmacyId);
   */
  updatePharmacySetExcludeNoGms(excludeNoGms, pharmacyId) {
    cy.sqlServer(
      `UPDATE Pharmacists SET ExcludeNoGMS = ${excludeNoGms} where Id = ${pharmacyId}`
    );
  }

  /**
   * sql query to update Pharmacy settings: Use Parallels
   * In case where useGreys = 0, on the Order pages system doesn't shows PI items(!= United Drug)
   * @example sql.updatePharmacySetUseGreys(1, pharmacyId)
   */
  updatePharmacySetUseGreys(useGreys, pharmacyId) {
    cy.sqlServer(
      `UPDATE Pharmacists SET UseGreys = ${useGreys} where Id = ${pharmacyId}`
    );
  }

  /**
   * sql query to update Pharmacy settings: Use Parallels
   * In case where useGreys = 0, on the Order pages system doesn't shows PI items(!= United Drug)
   * @example sql.toUpdatePharmacyPricesDiscounts(0,0,pharmacyId)
   */
  toUpdatePharmacyPricesDiscounts(showUdNetPrices, show2ndLine, pharmacyId) {
    cy.sqlServer(
      `UPDATE Pharmacists SET ShowUdNetPrices = ${showUdNetPrices}, Show2ndLine = ${show2ndLine} where Id = ${pharmacyId}`
    );
  }

  /**
   * sql query to update Parallel item Stock flag
   * @example sql.updatePIStockProductStock(0,145)
   */
  updatePIStockProductStock(InStock, StockProductId) {
    cy.sqlServer(
      `UPDATE StockProducts SET InStock = ${InStock}  where Id = ${StockProductId}`
    );
  }

  /**
   * sql query to update Parallel item Stock flag
   * @example sql.addItemToShoppingCart(0,145)
   */
  addItemToShoppingCart(ipuCode, pharmacyId, stockProductId, datetime) {
    cy.sqlServer(
      `INSERT INTO ShoppingCartItems VALUES (${ipuCode},${pharmacyId},'1',${stockProductId}, '${datetime}', '0')`
    );
  }

  /**
   * sql query to update Parallel item Stock flag
   * @example sql.addItemToShoppingCart(0,145)
   */
  getIPUCode(Id) {
    cy.sqlServer(`SELECT IPUCode from Stockproducts WHERE Id = ${Id}`);
  }
}

export const sql = new SqlScripts();
