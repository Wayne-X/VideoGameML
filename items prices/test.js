// CSV FORMAT IS
// ID, name, timestamp, price now, price 1 day ago, price 7 days ago, price 30 days ago, 30 day min price, 30 day max price, 30 day average price
// node makeCSV.js 1.json
// node-debug makeCSV.js 1.json

// load required
var fs = require('fs');	// file write and read

// Check call, get source and destination addresses
numOfArgs = process.argv.length;
if (numOfArgs != 3){
	console.log("improper call. Call with:\nnode makeCSV.js 1.json");
	return;
}

srcAddr = process.argv[2];
writeAddr = "csv/" + srcAddr.match(/\d+/)[0] + ".csv"

// get list
fs.readFile(srcAddr, 'utf8', function (err,data) {
	if (err) {
		console.log("Bad list source address: " + srcAddr);
		return;
	}
	main(data);
});

function main(inStr){
	// init
	wstream = fs.createWriteStream(writeAddr);
	obj = JSON.parse(inStr);

	not = 0;
	is = 0;

	for (i in obj){
		for (j=1; j<obj[i].data.length; j++){
			passed = obj[i].data[j][0] - obj[i].data[j-1][0];
			if (passed != 43200) {
				not++;
				console.log("anomaly, interval is: " + String(passed));
			}
			else
				{is++}
			// console.log("time passed: " + String(passed));
		}
	}

	console.log("not: " + String(not));
	console.log("is: " + String(is));
}