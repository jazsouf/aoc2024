async function partOne() {
  const input = (
    await Deno.readTextFile(`${Deno.cwd()}/input.txt`)
  ).trim();

  const reports = input.split("\n").map((line) => line.split(" ").map(Number));

  return filterForSafeReport(reports).length;
}

async function partTwo() {
  const input = (
    await Deno.readTextFile(`${Deno.cwd()}/input.txt`)
  ).trim();

  const reports = input.split("\n").map((line) => line.split(" ").map(Number));

  const safeReports = filterForSafeReport(reports);

  const notSafeReports = reports.filter((report) => {
    const diffs: number[] = [];

    for (let i = 0; i < report.length - 1; i++) {
      diffs.push(report[i] - report[i + 1]);
    }

    const isAllIncreasingByOneTwoOrThree = diffs.filter((d) =>
      d >= 1 && d <= 3
    ).length === diffs.length;

    const isAllDecreasingByOneTwoOrThree =
      diffs.filter((d) => d <= -1 && d >= -3).length === diffs.length;

    return !isAllIncreasingByOneTwoOrThree && !isAllDecreasingByOneTwoOrThree;
  });

  const subReports = notSafeReports.map((report) => {
    const res = [];
    for (let i = 0; i < report.length; i++) {
      res.push(report.filter((_l, j) => i !== j));
    }
    return res;
  });

  const okSubReports = subReports.filter((subReport) => {
    return filterForSafeReport(subReport).length > 0;
  });

  const totalNumberOfSafeReports = safeReports.length + okSubReports.length;

  return totalNumberOfSafeReports;
}

// common function for both parts
function filterForSafeReport(reports: number[][]) {
  const safeReports = reports.filter((report) => {
    const diffs: number[] = [];

    for (let i = 0; i < report.length - 1; i++) {
      diffs.push(report[i] - report[i + 1]);
    }

    const isAllIncreasingByOneTwoOrThree = diffs.filter((d) =>
      d >= 1 && d <= 3
    ).length === diffs.length;

    const isAllDecreasingByOneTwoOrThree =
      diffs.filter((d) => d <= -1 && d >= -3).length === diffs.length;

    return isAllIncreasingByOneTwoOrThree || isAllDecreasingByOneTwoOrThree;
  });
  return safeReports;
}

// print results
console.log(await Promise.all([partOne(), partTwo()]));
