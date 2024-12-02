// Part 1
async function partOne() {
	const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

	const cleanInput = input
		.split("\n")
		.map((line) => line.split(" ").filter(Number))
		.filter((l) => l.length);

	const left = cleanInput.map((l) => +l[0]).toSorted();
	const right = cleanInput.map((l) => +l[1]).toSorted();

	let diff = 0;
	for (let i = 0; i < left.length; i++) {
		diff += Math.abs(right[i] - left[i]);
	}
	return diff;
}

// Part 2
async function partTwo() {
	const input = await Deno.readTextFile(`${Deno.cwd()}/input.txt`);

	const cleanInput = input
		.split("\n")
		.map((line) => line.split(" ").filter(Number))
		.filter((l) => l.length);

	const left = cleanInput.map((l) => +l[0]).toSorted();
	const right = cleanInput.map((l) => +l[1]).toSorted();

	let sim = 0;
	for (const n of left) {
		const freq = right.filter((x) => x === n).length ?? 0;
		sim += freq * n;
	}
	return sim;
}

//print res
console.log(await partOne(), await partTwo());
