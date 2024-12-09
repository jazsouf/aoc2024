const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);
// +→ x
// ↓
// y
type Coords = Array<[number, number]>;

const map = input.trim().split("\n").map((y) => y.split(""));
const mapY = map.length;
const mapX = map[0].length;

const antennas = new Set(map.flat().filter((c) => c !== "."));

function getAntinodesCoords(
  antennaCoords: Coords,
  antinodeCoords: Set<string>,
  withHarmonic = false,
) {
  let depth = 1;

  for (let j = 0; j < antennaCoords.length; j++) {
    const [y1, x1] = antennaCoords[j];

    for (let k = j + 1; k < antennaCoords.length; k++) {
      depth++;
      const [y2, x2] = antennaCoords[k];

      const dy = y2 - y1;
      const dx = x2 - x1;

      const antinode1: Coords[0] = [y2 + dy, x2 + dx];
      const antinode2: Coords[0] = [y1 - dy, x1 - dx];

      if (isInBounds(antinode1)) {
        antinodeCoords.add(antinode1.join(","));
        // part2
        withHarmonic && getHamonics(
          [
            [y2, x2],
            antinode1,
          ],
          depth,
          antinodeCoords,
        );
      }
      if (isInBounds(antinode2)) {
        antinodeCoords.add(antinode2.join(","));
        // part2
        withHarmonic && getHamonics(
          [
            [y1, x1],
            antinode2,
          ],
          depth,
          antinodeCoords,
        );
      }
    }
  }
}

// part2
function getHamonics(
  nodes: Coords,
  depth: number,
  antinodeCoords: Set<string>,
) {
  if (depth > Math.floor(Math.sqrt(mapX * mapX + mapY * mapY))) return;

  const [y1, x1] = nodes[0];

  const [y2, x2] = nodes[1];

  const dy = y2 - y1;
  const dx = x2 - x1;

  const antinode: Coords[0] = [y2 + dy, x2 + dx];

  depth++;

  if (isInBounds(antinode)) {
    antinodeCoords.add(antinode.join(","));
    getHamonics(
      [
        [y2, x2],
        antinode,
      ],
      depth,
      antinodeCoords,
    );
  }
}

function isInBounds(coord: number[]): boolean {
  return coord[0] >= 0 && coord[0] < mapY &&
    coord[1] >= 0 && coord[1] < mapX;
}

function partOne() {
  const antinodeCoords = new Set<string>();
  for (const antenna of antennas) {
    const antennaCoords: Coords = [];
    for (let y = 0; y < mapY; y++) {
      for (let x = 0; x < mapX; x++) {
        map[y][x] === antenna && antennaCoords.push([y, x]);
      }
    }

    getAntinodesCoords(antennaCoords, antinodeCoords);
  }
  return antinodeCoords.size;
}

function partTwo() {
  const antinodeCoords = new Set<string>();

  for (const antenna of antennas) {
    const antennaCoords: Coords = [];
    for (let y = 0; y < mapY; y++) {
      for (let x = 0; x < mapX; x++) {
        map[y][x] === antenna && antennaCoords.push([y, x]);
      }
    }

    // get antinodes with harmonics
    getAntinodesCoords(antennaCoords, antinodeCoords, true);

    // add the antennas as antinodes
    antennaCoords.forEach((antenna) => antinodeCoords.add(antenna.join(",")));
  }

  return antinodeCoords.size;
}

// log results
console.log(partOne(), partTwo());
