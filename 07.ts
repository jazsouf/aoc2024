const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

type Equations = {
  res: number;
  nums: number[];
}[];

const equations: Equations = input.trim().split("\n").map((line) => {
  const [res, nums] = line.split(": ");
  return { res: Number(res), nums: nums.split(" ").map(Number) };
});

const add = (a: number, b: number) => a + b;
const mult = (a: number, b: number) => a * b;
const concat = (a: number, b: number) => Number(a.toString() + b.toString());

// part 1
const operators1 = ["+", "*"];
// part 2
const operators2 = ["+", "*", "|"];

const filterEquations = (operators: string[]) =>
  equations.filter(({ res, nums }) => {
    const operatorsCount = operators.length;
    const combinations = [];
    const slotsCount = nums.length - 1;
    const combinationsCount = Math.pow(operatorsCount, slotsCount);
    for (let i = 0; i < combinationsCount; i++) {
      let combination = "";

      // base conversion process
      let val = i;
      for (let j = 0; j < slotsCount; j++) {
        const opIdx = val % operatorsCount;

        combination = operators[opIdx] + combination;

        val = Math.floor(val / operatorsCount);
      }
      combinations.push(combination);
    }
    let isOk = false;
    for (let k = 0; k < combinations.length; k++) {
      const combination = combinations[k];
      let total = nums[0];
      for (let i = 0; i < nums.length - 1; i++) {
        if (combination[i] === "+") {
          total = add(total, nums[i + 1]);
        }
        if (combination[i] === "*") {
          total = mult(total, nums[i + 1]);
        }
        if (combination[i] === "|") {
          total = concat(total, nums[i + 1]);
        }
      }
      if (total === res) {
        isOk = true;
        break;
      }
    }
    return isOk;
  });

const getTotal = (equations: Equations) =>
  equations.map((eq) => eq.res).reduce((a, b) => a + b, 0);

const partOne = () => getTotal(filterEquations(operators1));
const partTwo = () => getTotal(filterEquations(operators2));

// log results
console.log(partOne(), partTwo());
