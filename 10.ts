const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

const topographicMap = input.trim().split("\n").map((line) =>
  line.split("").map(Number)
);

const paddedTopographicMap = [
  new Array(topographicMap[0].length + 2).fill(-1),
  ...topographicMap.map((l) => [-1, ...l, -1]),
  new Array(topographicMap[0].length + 2).fill(-1),
];

const trailHeads: [number, number][] = [];

paddedTopographicMap.forEach((line, y) => {
  line.forEach((pos, x) => {
    if (pos === 0) trailHeads.push([y, x]);
  });
});

let partOneScore = 0;
let partTwoScore = 0;

trailHeads.forEach(([y, x]) => {
  const heightsReached: Set<string> = new Set();
  findValidSurroundings([y, x], 1, heightsReached);
  partOneScore += heightsReached.size;
});

function findValidSurroundings(
  [y, x]: [number, number],
  nextLevel: number,
  heightsReached: Set<string>,
) {
  const validSurroundings = [[y - 1, x], [y, x + 1], [y + 1, x], [y, x - 1]]
    .filter(([Y, X]) => paddedTopographicMap[Y][X] === nextLevel);

  validSurroundings.forEach(([Y, X]) => {
    if (nextLevel === 9) {
      heightsReached.add([Y, X].join(""));
      partTwoScore += 1;
    }
    findValidSurroundings(
      [Y, X],
      nextLevel + 1,
      heightsReached,
    );
  });
}

console.log(partOneScore, partTwoScore);
