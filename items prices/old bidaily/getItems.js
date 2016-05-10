// CSV FORMAT IS
// CSV FORMAT IS
// ID, name, timestamp, price now, price 1 day ago, price 7 days ago, price 30 days ago, 30 day min price, 30 day max price, 30 day average price
// node makeCSV.js 1.json
// node-debug makeCSV.js 1.json

// load required
var fs = require('fs');	// file write and read

srcAddr = process.argv[2];

// get list
fs.readFile(srcAddr, 'utf8', function (err,data) {
	if (err) {
		console.log("Bad list source address: " + srcAddr);
		return;
	}
	main(data);
});

function main(inStr){
	inStr = inStr.replace(/(\r\n|\n|\r)/gm,"");
	inStr = inStr.substring(1);
	console.log("length: " + inStr.split(',').length);
}