// node removeTrailingComma.js
var fs = require('fs'); // file write and read
fileArr = fs.readdirSync("by_category");

for (i in fileArr){
	console.log("writing " + String(i) + " of " + String(fileArr.length) + ": " + String(fileArr[i]));
	string = fs.readFileSync("by_category/" + fileArr[i]).toString();
	string.replace(",\n", "\n");
	string.replace(/,$/, "\n");
	fs.writeFileSync("by_category2/" + fileArr[i], string);
}