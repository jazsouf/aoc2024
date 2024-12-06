const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

const map = input.trim().split(/\n/);

interface GuardPosition {
  paddedMap: string[][];
  y: number;
  x: number;
}

const createPaddedMap = () => {
  const padding = "-".repeat(map[0].length + 2);
  return [
    padding,
    ...map.map((row) => `-${row}-`),
    padding,
  ].map((row) => row.split(""));
};

const GUARD_ORIENTATIONS = ["^", ">", "v", "<"];

function partOne() {
  const paddedMap = createPaddedMap();

  while (true) {
    //find the guard's position
    const y = paddedMap.findIndex((r) =>
      r.some((c) => GUARD_ORIENTATIONS.includes(c))
    );
    if (y < 0) throw Error("can't find the guard's Y pos");
    const x = paddedMap[y].findIndex((c) => GUARD_ORIENTATIONS.includes(c));

    const isGuardOut = moveGuard({
      paddedMap,
      y,
      x,
    });

    if (isGuardOut) {
      break;
    }
  }

  return (paddedMap.flat().filter((p) => p === "X").length);
}

function partTwo() {
  const ogMap = createPaddedMap();

  let possibleObstaclesCount = 0;

  for (let Y = 1; Y < ogMap.length - 1; Y++) {
    console.log("rows tested: ", Y);
    for (let X = 1; X < ogMap[0].length - 1; X++) {
      if (ogMap[Y][X] === ".") {
        const paddedMap = createPaddedMap();

        // init loop count
        let loopPass = 0;

        // add an obstacle
        paddedMap[Y][X] = "#";

        while (true) {
          loopPass++;

          //find the guard's position
          const y = paddedMap.findIndex((r) =>
            r.some((c) => GUARD_ORIENTATIONS.includes(c))
          );
          if (y < 0) throw Error("can't find the guard's Y pos");
          const x = paddedMap[y].findIndex((c) =>
            GUARD_ORIENTATIONS.includes(c)
          );

          const isGuardOut = fastMoveGuard({ paddedMap, y, x });

          if (isGuardOut) {
            paddedMap[Y][X] = ".";
            break;
          }

          // the Rich Harris special infinite-loop detection, but here it's inside two nested loops, so it's actually super slow
          if (loopPass > 175) {
            possibleObstaclesCount++;
            paddedMap[Y][X] = ".";
            break;
          }
        }
      }
    }
  }

  return possibleObstaclesCount;
}

function moveGuard(
  { paddedMap, y, x }: GuardPosition,
) {
  let isGuardOut = false;
  const currentSprite = paddedMap[y][x];
  paddedMap[y][x] = "X";
  if (currentSprite === "^") {
    const nextPossiblePos = paddedMap[y - 1][x];

    if (nextPossiblePos === "-") {
      isGuardOut = true;
    } else if (nextPossiblePos === "#") {
      paddedMap[y][x] = ">";
    } else {
      paddedMap[y - 1][x] = "^";
    }
  }

  if (currentSprite === ">") {
    const nextPossiblePos = paddedMap[y][x + 1];

    if (nextPossiblePos === "-") {
      isGuardOut = true;
    } else if (nextPossiblePos === "#") {
      paddedMap[y + 1][x] = "v";
    } else {
      paddedMap[y][x + 1] = ">";
    }
  }

  if (currentSprite === "v") {
    const nextPossiblePos = paddedMap[y + 1][x];

    if (nextPossiblePos === "-") {
      isGuardOut = true;
    } else if (nextPossiblePos === "#") {
      paddedMap[y][x - 1] = "<";
    } else paddedMap[y + 1][x] = "v";
  }

  if (currentSprite === "<") {
    const nextPossiblePos = paddedMap[y][x - 1];

    if (nextPossiblePos === "-") {
      isGuardOut = true;
    } else if (nextPossiblePos === "#") {
      paddedMap[y - 1][x] = "^";
    } else paddedMap[y][x - 1] = "<";
  }
  return isGuardOut;
}

function fastMoveGuard(
  { paddedMap, y, x }: GuardPosition,
) {
  let isGuardOut = false;
  const currentSprite = paddedMap[y][x];

  paddedMap[y][x] = ".";

  if (currentSprite === "^") {
    const yObstacle = paddedMap.map((row) => row[x]).findLastIndex((c, i) =>
      c === "#" && i < y
    );

    const xObstacle = x;

    if (yObstacle < 0) {
      isGuardOut = true;
    } else {
      paddedMap[yObstacle + 1][xObstacle] = ">";
    }
  }

  if (currentSprite === ">") {
    const yObstacle = y;
    const xObstacle = paddedMap[y].findIndex((
      c,
      i,
    ) => c === "#" && i > x);

    if (xObstacle < 0) {
      isGuardOut = true;
    } else {
      paddedMap[yObstacle][xObstacle - 1] = "v";
    }
  }

  if (currentSprite === "v") {
    const yObstacle = paddedMap.map((row) => row[x]).findIndex((c, i) => {
      return c === "#" && i > y;
    });
    const xObstacle = x;

    if (yObstacle < 0) {
      isGuardOut = true;
    } else {
      paddedMap[yObstacle - 1][xObstacle] = "<";
    }
  }

  if (currentSprite === "<") {
    const yObstacle = y;
    const xObstacle = paddedMap[y].findLastIndex((
      c,
      i,
    ) => c === "#" && i < x);

    if (xObstacle < 0) {
      isGuardOut = true;
    } else {
      paddedMap[yObstacle][xObstacle + 1] = "^";
    }
  }
  return isGuardOut;
}

// log the solutions
console.log(partOne(), partTwo());
