var apiKey = "UrHLGOLkTTpTRUwvWiEFKtRRP8up37Ud";
var apiUrl = "https://api-gateway.skymavis.com/graphql/marketplace";

function fetchApi(query) {
  let headers = {
    "Content-Type": "application/json",
    "X-API-Key": apiKey
  };

  let options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify({ "query": query })
  };

  let response = UrlFetchApp.fetch(apiUrl, options);
  return JSON.parse(response.getContentText());
}

function getEthSpent(axieId) {
  let id = axieId;
  let query = `{ axie (axieId : ${id}) { id transferHistory(size: 1) { results { withPrice}}} }`
  let parsedData = fetchApi(query);

  let trasferHistory = parsedData.data.axie.transferHistory.results;
  let withPrice = trasferHistory[0].withPrice
  return withPrice/10**18;
}

function getAscendStatus(axieId) {
  let id = axieId;
  let query = `{ axie(axieId: "${id}") { axpInfo {xpToAscend} } }`;
  let parsedData = fetchApi(query);
  let xpToAscend = parsedData.data.axie.axpInfo.xpToAscend;
  return xpToAscend;
}

function getAxieClass(axieId) {
  let query = `{ axie(axieId: "${axieId}") { class } }`;
  let parsedData = fetchApi(query);
  return parsedData.data.axie.class.toLowerCase();

}

function getAxieName(axieId) {
  let id = axieId;
  let query = `{ axie(axieId: "${id}") { name } }`;
  let parsedData = fetchApi(query);
  let name = parsedData.data.axie.name;
  return name;
}

function getMementoPrice(mementoType) {
  let memento = {
    aquatic: "1116691496960",
    bird: "1108101562368",
    reptile: "1120986464256",
    plant: "1112396529664",
    beast: "1099511627776",
    bug: "1103806595072",
    dusk: "1176821039104",
    dawn: "1172526071808",
    mech: "1168231104512"
  };

  let tokenId = memento[mementoType];

  if (!tokenId) {
    return "Invalid memento type";
  }

  let query = `{ erc1155Token(tokenType: Material, tokenId: "${tokenId}") { minPrice } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.erc1155Token && parsedData.data.erc1155Token.minPrice) {
    return parsedData.data.erc1155Token.minPrice;
  } else {
    return "Unexpected response format";
  }
}

function getExchangeRate(currency) {
  let query = `{ exchangeRate { ${currency} { usd } } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.exchangeRate && parsedData.data.exchangeRate[currency]) {
    return parsedData.data.exchangeRate[currency].usd;
  } else {
    return "Unexpected response format";
  }
}

function getAxieMaterials(axieId, type) {
  let query = `{ axie(axieId: "${axieId}") { parts { class type } } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.axie && parsedData.data.axie.parts) {
    let parts = parsedData.data.axie.parts;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].type === type) {
        return parts[i].class;
      }
    }
    return "Tipo não encontrado";
  } else {
    return "Resposta inesperada";
  }
}

function getAxiePrice(axieId) {
  let query = `{ axie(axieId: "${axieId}") { order { currentPrice } } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.axie && parsedData.data.axie.order) {
    return parsedData.data.axie.order.currentPrice;
  } else {
    return "Not for Sale!";
  }
}

function getAxieImage(axieId) {
  return "https://axiecdn.axieinfinity.com/axies/" + axieId + "/axie/axie-full-transparent.png";
}

function getAxieMarket(axieId) {
  return "https://app.axieinfinity.com/marketplace/axies/" + axieId;
}

function getAxieLink(axieId) {
  let axieLink = "http://app.axieinfinity.com/profile/inventory/axies/" + axieId;
  return axieLink;
}

function getAxieBreed(axieId) {
  let query = `{ axie(axieId: "${axieId}") { breedCount } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.axie && parsedData.data.axie.breedCount !== undefined) {
    let breedCount = parsedData.data.axie.breedCount;
    return breedCount;
  } else {
    return "Breed Count: Unexpected response format";
  }
}

function getAxieLevel(axieId) {
  let query = `{ axie(axieId: "${axieId}") { axpInfo {level} } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.axie && parsedData.data.axie.axpInfo.level !== undefined) {
    let level = parsedData.data.axie.axpInfo.level;
    return level;
  } else {
    return "Level: Unexpected response format";
  }
}

function getExpectedMementos(axieId) {
  let breed = getAxieBreed(axieId);
  let level = getAxieLevel(axieId);

  // elementos: [0] - lvl 1, [1] - lvl 2 ...
  let mementoTable = [
    [6, 7, 9, 12, 17, 19, 28], //Breed Count 0
    [13, 15, 20, 28, 38, 44, 63], //Breed Count 1
    [25, 75, 100, 138, 188, 219, 313], //Breed Count 2
    [37, 118, 157, 216, 294, 343, 490], //Breed Count 3
    [50, 210, 280, 385, 525, 613, 875], //Breed Count 4
    [62, 252, 336, 462, 630, 735, 1050], //Breed Count 5
    [75, 272, 362, 498, 679, 792, 1132], //Breed Count 6
    [87, 293, 390, 537, 732, 854, 1220]  //Breed Count 7
  ];

  if (level >= 1 && level < 10) {
    level = 0;
  }
  else if (level >= 10 && level < 20) {
    level = 1;
  }
  else if (level >= 20 && level < 30) {
    level = 2;
  }
  else if (level >= 30 && level < 40) {
    level = 3;
  }
  else if (level >= 40 && level < 50) {
    level = 4;
  }
  else if (level >= 50 && level < 60) {
    level = 5;
  }
  else if (level == 60) {
    level = 6;
  };

  mementos = mementoTable[breed][level];
  return mementos;
}

function getTargetMementos(axieId, targetLevel) {
  let breed = getAxieBreed(axieId);
  let level = targetLevel;

  // elementos: [0] - lvl 1, [1] - lvl 2 ...
  let mementoTable = [
    [6, 7, 9, 12, 17, 19, 28], //Breed Count 0
    [13, 15, 20, 28, 38, 44, 63], //Breed Count 1
    [25, 75, 100, 138, 188, 219, 313], //Breed Count 2
    [37, 118, 157, 216, 294, 343, 490], //Breed Count 3
    [50, 210, 280, 385, 525, 613, 875], //Breed Count 4
    [62, 252, 336, 462, 630, 735, 1050], //Breed Count 5
    [75, 272, 362, 498, 679, 792, 1132], //Breed Count 6
    [87, 293, 390, 537, 732, 854, 1220]  //Breed Count 7
  ];

  if (level >= 1 && level < 10) {
    level = 0;
  }
  else if (level >= 10 && level < 20) {
    level = 1;
  }
  else if (level >= 20 && level < 30) {
    level = 2;
  }
  else if (level >= 30 && level < 40) {
    level = 3;
  }
  else if (level >= 40 && level < 50) {
    level = 4;
  }
  else if (level >= 50 && level < 60) {
    level = 5;
  }
  else if (level == 60) {
    level = 6;
  };

  mementos = mementoTable[breed][level];
  return mementos;
}

function getAxieMaterials(axieId, type) {
  let query = `{ axie(axieId: "${axieId}") { parts { class type } } }`;
  let parsedData = fetchApi(query);

  if (parsedData.data && parsedData.data.axie && parsedData.data.axie.parts) {
    let parts = parsedData.data.axie.parts;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].type === type) {
        return parts[i].class;
      }
    }
    return "Tipo não encontrado";
  } else {
    return "Resposta inesperada";
  }
}

function getWethBalance(walletAddress) {
  let tokenContractAddress = "0xc99a6a985ed2cac1ef41640596c5a5f9f4e19ef5";
  let data = "0x70a08231000000000000000000000000" + walletAddress.substring(2);

  let payload = {
    "id": 1,
    "jsonrpc": "2.0",
    "method": "eth_call",
    "params": [{
      "to": tokenContractAddress,
      "data": data
    }, "latest"]
  };

  let options = {
    'method': 'post',
    'contentType': 'application/json',
    'accept': 'application/json',
    'headers': {
      'apikey': apiKey // Inclua a chave de API
    },
    'payload': JSON.stringify(payload)
  };


  let response = UrlFetchApp.fetch('https://api-gateway.skymavis.com/rpc', options);
  let json = JSON.parse(response.getContentText());
  let balance = json.result;
  balance = balance / 10 ** 18;
  return balance;
}

function getPotentialProfit(_axieId, _targetLevel) {
  let targetMementos = getTargetMementos(_axieId, _targetLevel);
  let partsQnt = targetMementos * 0.125;
  let bodyQnt = targetMementos * 0.25;
  const partsType = ["Eyes", "Ears", "Mouth", "Horn", "Back", "Tail"];
  let ethExchangeRate = getExchangeRate("eth");
  let potentialProfit = 0.00;
  let bodyProfit = 0.00;
  let partsProfit = 0.00;

  bodyProfit = (((parseInt(getMementoPrice(getAxieClass(_axieId)))) / 10 ** 18) * ethExchangeRate) * bodyQnt;

  for (let i = 0; i < partsType.length; i++) {
    let materialPrice = (((parseInt(getMementoPrice(getAxieMaterials(_axieId, partsType[i]).toLowerCase()))) / 10 ** 18) * ethExchangeRate) * partsQnt;
    partsProfit = partsProfit + materialPrice;
  }
  potentialProfit = bodyProfit + partsProfit;
  return potentialProfit;
}

function getAscendFee(_axieId, _targetLevel) {
  let currentLevel = getAxieLevel(_axieId);
  let targetLevel = _targetLevel;
  const ascensionFees = [
    { level: 10, fee: 0.50 },
    { level: 20, fee: 1.00 },
    { level: 30, fee: 1.50 },
    { level: 40, fee: 2.00 },
    { level: 50, fee: 2.50 },
    { level: 60, fee: 3.00 }
  ]

  let totalFee = 0;

  for (let i = 0; i < ascensionFees.length; i++) {
    const { level, fee } = ascensionFees[i];
    if (currentLevel < level && targetLevel >= level) {
      totalFee += fee;
    }
  }
  return totalFee + 0.065;
}

