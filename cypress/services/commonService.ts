export function getRandomNumber(numberOfItems: number) { 
    const randomInt = Math.floor(Math.random() * numberOfItems) + 0;
    return randomInt;
 }

export function getRandomPackType() {
    var packtypesList = ['BRAND', 'FRIDGE', 'GENERIC', 'OTC', 'ULM']; // need to move to the Enums
    var packType = packtypesList[Math.floor(Math.random() * packypesList.length)];
    return packType;
}


