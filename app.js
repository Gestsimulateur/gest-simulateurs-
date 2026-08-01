const form = document.getElementById("compound-form");

const capitalInput = document.getElementById("capital");
const monthlyInput = document.getElementById("monthly");
const rateInput = document.getElementById("rate");
const yearsInput = document.getElementById("years");

const futureValueEl = document.getElementById("future-value");
const totalContributedEl = document.getElementById("total-contributed");
const estimatedGainsEl = document.getElementById("estimated-gains");
const chart = document.getElementById("growth-chart");

const euro = new Intl.NumberFormat("fr-FR", {
style: "currency",
currency: "EUR",
maximumFractionDigits: 0
});

function calculateSeries(capital, monthly, annualRate, years) {
const monthlyRate = annualRate / 100 / 12;
const totalMonths = years * 12;

let balance = capital;

const points = [
{
year: 0,
balance: balance
}
];

for (let month = 1; month <= totalMonths; month += 1) {
balance = balance * (1 + monthlyRate) + monthly;

if (month % 12 === 0) {
points.push({
year: month / 12,
balance: balance
});
}
}

return points;
}

function drawChart(points) {
const width = 600;
const height = 250;

const padding = {
top: 18,
right: 20,
bottom: 32,
left: 20
};

const maxValue = Math.max(
...points.map((point) => point.balance),
1
);

const maxYear = Math.max(
...points.map((point) => point.year),
1
);

const x = (year) =>
padding.left +
(year / maxYear) *
(width - padding.left - padding.right);

const y = (value) =>
height -
padding.bottom -
(value / maxValue) *
(height - padding.top - padding.bottom);

const line = points
.map((point, index) => {
const command = index === 0 ? "M" : "L";

return `${command} ${x(point.year).toFixed(2)} ${y(
point.balance
).toFixed(2)}`;
})
.join(" ");

const area = `
${line}
L ${x(maxYear)} ${height - padding.bottom}
L ${x(0)} ${height - padding.bottom}
Z
`;

chart.innerHTML = `
<defs>
<linearGradient
id="goldArea"
x1="0"
y1="0"
x2="0"
y2="1"
>
<stop
offset="0%"
stop-color="#c99528"
stop-opacity=".35"
/>
<stop
offset="100%"
stop-color="#c99528"
stop-opacity="0"
/>
</linearGradient>
</defs>

<line
x1="${padding.left}"
y1="${height - padding.bottom}"
x2="${width - padding.right}"
y2="${height - padding.bottom}"
stroke="#e8e2d7"
/>

<path
d="${area}"
fill="url(#goldArea)"
/>

<path
d="${line}"
fill="none"
stroke="#c99528"
stroke-width="4"
stroke-linecap="round"
stroke-linejoin="round"
/>

<circle
cx="${x(maxYear)}"
cy="${y(points[points.length - 1].balance)}"
r="6"
fill="#c99528"
/>

<text
x="${padding.left}"
y="${height - 8}"
fill="#7b8188"
font-size="13"
>
Aujourd’hui
</text>

<text
x="${width - padding.right}"
y="${height - 8}"
fill="#7b8188"
font-size="13"
text-anchor="end"
>
${maxYear} ans
</text>
`;
}

function updateSimulation(event) {
if (event) {
event.preventDefault();
}

const capital = Math.max(
0,
Number(capitalInput.value) || 0
);

const monthly = Math.max(
0,
Number(monthlyInput.value) || 0
);

const rate = Math.max(
0,
Number(rateInput.value) || 0
);

const years = Math.min(
60,
Math.max(1, Number(yearsInput.value) || 1)
);

const points = calculateSeries(
capital,
monthly,
rate,
years
);

const finalValue =
points[points.length - 1].balance;

const totalContributed =
capital + monthly * years * 12;

const gains =
finalValue - totalContributed;

futureValueEl.textContent =
euro.format(finalValue);

totalContributedEl.textContent =
euro.format(totalContributed);

estimatedGainsEl.textContent =
euro.format(gains);

drawChart(points);
}

form.addEventListener(
"submit",
updateSimulation
);

[
capitalInput,
monthlyInput,
rateInput,
yearsInput
].forEach((input) => {
input.addEventListener(
"input",
updateSimulation
);
});

updateSimulation();
