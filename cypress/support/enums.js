export const expectedDelivery = {
    NextDay : 'Next Day',
    SameDay : 'Same Day',
    empty : '  '
};

export const depot = {
    Ballina : "Ballina",
    Dublin : "Dublin",
    Limerick : "Limerick"
}

export const cutOffTime = {
    before : "'22:59:00.0000000'",
    after : "'00:01:00.0000000'",
    null : 'null'
}

export const useCutOff = {
    yes : 1,
    no : 0
}

export const localaDepot = {
    Dublin : 1,
    Limerick: 2,
    Ballina : 3
}

export const cutoffDepot = {
    Dublin : 1,
    Limerick: 2,
    Ballina : 3
}

export const dublin = {
    InStock : 1,
    OOS: 0
}

export const ballina = {
    InStock : 1,
    OOS: 0
}


export const limerick = {
    InStock : 1,
    OOS: 0
}


export const Wholeslaers ={
    UD: {
        Id: 1,
        Name: "United Drug",
        secondName: "ELEMENTS"
    },
    PCO: {
        Id: 2,
        Name: "PCO"
    },
    IMED: {
        Name: "IMED"
    },
    ONEILLS:{
        Name: `O’Neills`
    }, 
    LEXON: {
        Name: 'Lexon'
    },
    CLINIGEN:{
        Name: 'Clinigen'
    }
}

export const headingsWithPrice = {
    InStock : 1,
    OOS: 0
}

export const headingsWithoutPrice = {
    InStock : 1,
    OOS: 0
}

export const headings = {
    brokeredEthical : ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment'],
    brokeredOTC : ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment'],
    secondLine: ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Comment'],
    // secondLineWithPrices['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type', 'Discount', 'Net\nPrice', 'Comment'],
    ulm: ['Description', 'Pack\nSize', 'In\nStock', 'Qty', 'Expected\nDelivery', 'Trade\nPrice', 'Wholesaler', 'GMS\nCode', 'Pack Type']
}







