const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

function partOne(input: string) {
  const cleanInput = input.split("mul(").map((subInput) => {
    const double = subInput.split(")");
    if (double.length < 2) return [NaN, NaN];
    return double[0].split(",").map(Number);
  }).filter((pair) => {
    const hasTwoItems = pair?.length === 2;
    const itemsAreNumbers = pair.every((item) => !isNaN(item));
    return hasTwoItems && itemsAreNumbers;
  });
  return cleanInput.reduce((sum, [a, b]) => sum + a * b, 0);
}

function partTwo(input: string) {
  const validInputs = input.replaceAll("do()", "do()1").replaceAll(
    "don't()",
    "don't()0",
  ).split(/do\(\)|don't\(\)/).filter((input) => input[0] !== "0");

  return (validInputs.map(partOne).reduce((a, b) => a + b, 0));
}

// log results
console.log(partOne(input), partTwo(input));
