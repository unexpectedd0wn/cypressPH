class intercept{
    requestWith =
    {
            
        pack_type: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=PackType&filters%5B0%5D.value=',
        pack_size: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=PackSize&filters%5B0%5D.value=',
        wholesaler: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=wholesalerId&filters%5B0%5D.value=',
        ClearFilter: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery',
    }
}
module.exports = new intercept();