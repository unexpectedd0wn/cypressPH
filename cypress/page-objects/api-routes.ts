export class Api{
           
        request =
        {
        filter_pack_type: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=PackType&filters%5B0%5D.value=',
        filter_pack_size: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=PackSize&filters%5B0%5D.value=',
        _filter_wholesaler: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=wholesalerId&filters%5B0%5D.value=',
        
        ClearFilter: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery',
        _getPageData: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=brokeredEthical&filters%5B1%5D.value=true&filters%5B1%5D.$type=boolean*',
        _filter_GmsCode: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=GMSCode&filters%5B0%5D.value=',
        _getShoppingcart: '/api/pharmacy/shoppingcart*',
        _addItemShoppingCart: '/api/stock-product/cart/add*',
        _searchWithText: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=SearchString&filters%5B0%5D.value=',
        _searchWithGMSCode: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=GMSCode',
        _getPageDataBrokeredEthical: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=brokeredEthical',
        _getPageDataBrokeredOTC: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=brokeredOtc',
        _getPageDataSecondLine: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=secondLine',
        _getPageDataULM: '/api/stock-product/products?skip=0&take=25&sortingDirection=1&sortingField=description&filters%5B0%5D.propertyName=expectedDelivery&filters%5B0%5D.value=0&filters%5B0%5D.$type=number&filters%5B0%5D.matchMode=0&filters%5B1%5D.propertyName=ulm',
        _addItemToShoppingCart: '/api/stock-product/cart/add',
        _sendOrder: '/api/pharmacy/sendorder/*',
        _getDataOrderHistoryPage: '/api/order-history?*',
        }
    
    
}

export const APIRequests = new Api();

