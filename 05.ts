const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

// clean data
const rules = input.trim().split(/\n\n/)[0].split(/\n/);
const updates = input
  .trim()
  .split(/\n\n/)[1]
  .split(/\n/)
  .map((update) => update.split(","));

function getRuleMap(rules: string[]) {
  const ruleMap: { [key: string]: string[] } = {};
  for (const rule of rules) {
    const [X, Y] = rule.split("|");
    ruleMap[X] = ruleMap[X] ? [...ruleMap[X], Y] : [Y];
  }
  return ruleMap;
}

function getCorrectAndIncorrectUpdates(updates: string[][]) {
  const correctUpdates = [];
  const incorrectUpdates = [];

  for (const update of updates) {
    const isCorrect = checkIsCorrectUpdate(update);
    isCorrect ? correctUpdates.push(update) : incorrectUpdates.push(update);
  }
  return { correctUpdates, incorrectUpdates };
}

function checkIsCorrectUpdate(update: string[]) {
  const ruleMap = getRuleMap(rules);
  for (let i = 0; i < update.length; i++) {
    const numbersToCheckFor = ruleMap[update[i]] ?? [];
    for (let j = 0; j <= i; j++) {
      if (numbersToCheckFor.includes(update[j])) return false;
    }
  }
  return true;
}

function orderUpdates(incorrectUpdates: string[][]) {
  const ruleMap = getRuleMap(rules);
  for (const update of incorrectUpdates) {
    for (let i = 0; i < update.length; i++) {
      const numbersToCheckFor = ruleMap[update[i]] ?? [];
      for (let j = 0; j <= i; j++) {
        if (numbersToCheckFor.includes(update[j])) {
          [update[j], update[i]] = [update[i], update[j]];
        }
      }
    }
  }
  return incorrectUpdates;
}

function getResult(updates: string[][]) {
  return updates
    .map((update) => +update[Math.floor(update.length / 2)])
    .reduce((a, b) => a + b, 0);
}

const { correctUpdates, incorrectUpdates } =
  getCorrectAndIncorrectUpdates(updates);

const partOneResult = getResult(correctUpdates);
const partTwoResult = getResult(orderUpdates(incorrectUpdates));

// log results
console.log(partOneResult, partTwoResult);
