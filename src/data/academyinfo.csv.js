import { csvFormat } from "d3-dsv";

// fetch postgresql academyinfo data
const response = await fetch('http://166.104.191.253:8089/academyinfo?year=2023');
const data = await response.json();

const countBySchoolType = data.reduce((acc, curr) => {
		const { 학교종류 } = curr;
		if (!acc[학교종류]) {
			acc[학교종류] = 0;
		}
		acc[학교종류]++;
		return acc;
	}, {});

const result = Object.entries(countBySchoolType).map(([key, value]) => ({
		구분: key,
		학교수: value
	}));

// Output CSV.
process.stdout.write(csvFormat(data));



