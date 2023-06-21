export function getRandomNumber() { 
    const randomInt = Math.floor(Math.random() * 24) + 0;
    return randomInt;
 }

export function getRandomPackType() {
    var packtypesList = ['BRAND', 'FRIDGE', 'GENERIC', 'OTC', 'ULM'];
    var packType = packtypesList[Math.floor(Math.random() * packtypesList.length)];
    return packType;
}


