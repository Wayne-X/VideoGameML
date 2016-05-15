// node processCSVbyCategory.js itemdata.csv ../Item\ Data.json 
// node processCSVbyCategory.js itemdata_delay1_validate.csv  ../Item\ Data.json 
// node-debug processCSVbyCategory.js itemdata_delay1_validate.csv  ../Item\ Data.json 

// load required
var fs = require('fs');	// file write and read

fs.readFile(process.argv[2], 'utf8', function (err,csvstr) {
	if (err) {
		console.log("Bad list source address");
		return;
	}
	fs.readFile(process.argv[3], 'utf8', function (err,data) {
		if (err) {
			console.log("Bad list source address");
			return;
		}
		main(csvstr, data);
	});
});


function main(csvstr, data){
	csvArr = csvstr.split("\n");
	itemsArr = JSON.parse(data).items;
	wstream = fs.createWriteStream("itemdataWithCategory.csv");
	wstream.write("ID,category,timestamp,price_now,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n");
	for (i=1; i<csvArr.length; i++){
		console.log("Writing " + String(i) + " of " + String(csvArr.length));
		csvRow = csvArr[i].split(",");
		csvID = csvRow[0];
		csvRow.splice(1, 0, getCategoryByID(csvID, itemsArr));//itemsArr.find(function(item){item.id == id}));//
		for (j in csvRow){
			wstream.write(csvRow[j] + ',');
		}
		wstream.write("\n");
	}
	wstream.end();
}

function getCategoryByID(id, itemsArr){
	for (k in itemsArr){
		// console.log(String(typeof itemsArr));
		if (itemsArr[k].id == id){
			// console.log("item id "+id+" is type: " + itemsArr[k].type);
			return itemsArr[k].type;
		}
	}
	console.log("couldn't find");
}