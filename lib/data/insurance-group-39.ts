const normalizedGroup39Entries = new Set([
  "alfa romeo|gt",
  "alfa romeo|gtv",
  "alfa romeo|spider",
  "audi|a4",
  "audi|a5",
  "audi|allroad",
  "audi|q7",
  "bmw|330",
  "bmw|335",
  "bmw|528",
  "bmw|z4",
  "bmw|z8",
  "cadillac|cts",
  "fiat|coupe",
  "honda|civic",
  "jaguar|xjr8",
  "jaguar|xk8",
  "landrover|discovery",
  "landrover|range rover",
  "lotus|elise",
  "mercedes-benz|c class",
  "mercedes-benz|clk",
  "mercedes-benz|e class",
  "mercedes-benz|slk",
  "nissan|patrol",
  "peugeot|4007",
  "peugeot|407",
  "renault|clio",
  "renault|laguna",
  "saab|9-3",
  "subaru|impreza",
  "vauxhall|vxr220",
  "volkswagen|touareg",
  "volvo|s60",
  "volvo|v60",
  "volvo|v70",
  "volvo|xc70",
  "volvo|xc90",
]);

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim();
}

function composeKey(make: string, model: string) {
  return `${normalize(make)}|${normalize(model)}`;
}

export type Group39Match = {
  autoMake: string;
  autoModel: string;
  isGroup39: boolean;
  matchKey: string;
};

export function evaluateGroup39(autoMake: string, autoModel: string): Group39Match {
  const matchKey = composeKey(autoMake, autoModel);

  return {
    autoMake,
    autoModel,
    isGroup39: normalizedGroup39Entries.has(matchKey),
    matchKey,
  };
}