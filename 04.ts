const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

function partOne(input: string) {
  const lines = input.trim().split(/\n/);

  const cols = [];

  for (let y = 0; y < lines.length; y++) {
    const col = [];
    for (let x = 0; x < lines[y].length; x++) {
      col.push(lines[x][y]);
    }
    cols.push(col.join(""));
  }

  const diagL = [];

  let temp, k, x, y;
  for (k = 0; k <= 2 * (lines.length - 1); k++) {
    for (temp = [], y = cols.length - 1; (x = k - y), y >= 0; --y) {
      x >= 0 && x < lines.length && temp.push(lines[y][x]);
    }
    temp.length > 3 && diagL.push(temp.join("").padEnd(lines[0].length, "."));
  }

  const diagR = [];

  for (k = 0; k <= 2 * (lines.length - 1); ++k) {
    for (
      temp = [], y = cols.length - 1;
      (x = k + y - cols.length), y >= 0;
      --y
    ) {
      x >= 0 && x < lines.length && temp.push(lines[y][x]);
    }
    temp.length > 3 && diagR.push(temp.join("").padEnd(lines[0].length, "."));
  }

  const values = [...lines, ...cols, ...diagL, ...diagR];

  const total = [
    ...values,
    ...values.map((v) => v.split("").reverse().join("")),
  ]
    .map((i) => i.split(/XMAS/).length - 1)
    .reduce((a, b) => a + b, 0);

  return total;
}

function partTwo(input: string) {
  const lines = input.trim().split(/\n/);

  const paddedLines = [
    "".padStart(lines[0].length + 2, "."),
    ...lines.map((line) => `.${line}.`),
    "".padStart(lines[0].length + 2, "."),
  ];

  const patterns = ["MAS", "SAM"];

  let total = 0;

  paddedLines.map((line, y) => {
    for (let x = 0; x < line.length; x++) {
      if (line[x] === "A") {
        const leftDiag = `${paddedLines[y - 1][x - 1]}A${paddedLines[y + 1][x + 1]}`;
        const rightDiag = `${paddedLines[y + 1][x - 1]}A${paddedLines[y - 1][x + 1]}`;
        if (patterns.includes(leftDiag) && patterns.includes(rightDiag))
          total++;
      }
    }
  });

  return total;
}

// log results
console.log(partOne(input), partTwo(input));
