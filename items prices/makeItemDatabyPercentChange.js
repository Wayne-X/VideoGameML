// node makeItemDatabyPercentChange.js itemdataWithCategory.csv 30
// node makeItemDatabyPercentChange.js csvfile daysToCompare[1, 7, 30]
// node makeItemDatabyPercentChange.js testItemdataWithCategory.csv 30


// load required
var fs = require('fs'); // file write and read

daysToCompare = Number(process.argv[3]);
addrHeader = "by_category_with_percent_change_over_" + String(daysToCompare) + "_days/"

// get index of dayToCompare
index = {
	category: 1,
	priceNow: 3, 
	priceCompare: -1,
};
switch (process.argv[3]){
	case "1":
		index.priceCompare = 4;
		break;
	case "7":
		index.priceCompare = 5;
		break;
	case "30":
		index.priceCompare = 6;
		break;
	default:
		console.log("ERROR: unknown daysToCompare parameter: " + String(process.argv[3]));
		return
		break;
}

fs.readFile(process.argv[2], 'utf8', function (err,csvstr) {
	if (err) {
		console.log("Bad csv source address");
		return;
	}
	main(csvstr);
});


function main(items){
	// process
	items = items.split("\n");
    items.shift();
    if(items[items.length-1] == ""){items.pop();}

    // put into object
    itemsObj = {};
    console.log("Step 1/3: PROCESSING");
    items.map(function(x, i, a){
    	if(i%Math.round(a.length/10)==0){console.log("processing " + String(i) + " of " + String(a.length))}
    	xarr = x.split(",");
    	xarr.push(getChange(xarr));
    	category = xarr[index.category];
    	if (itemsObj[category] == undefined){itemsObj[category] = [];}
    	itemsObj[category].push(xarr);
    });

    // prepare
    console.log("Step 2/3: MAKING STRING");
    k = 0;
	for (var key in itemsObj) {
	if (itemsObj.hasOwnProperty(key)) {
		if(k%Math.round(itemsObj.length/10)==0){console.log("processing " + String(k) + " of " + String(itemsObj.length))}
		s = "ID,category,timestamp,price_now,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg,";
		s += "percent_change_over_" + String(daysToCompare) + "_days\n";
		itemsObj[key].map(function(x, i, a){
			s += String(x) + "\n";
		})
		itemsObj[key] = s;
		k += 1;
	}
	}

    // print
    console.log("Step 3/3: WRITING");
	fs.mkdir(addrHeader, function(err) {
		k = 0;
		for (var key in itemsObj) {
		if (itemsObj.hasOwnProperty(key)) {
			if(k%Math.round(itemsObj.length/10)==0){console.log("processing " + String(k) + " of " + String(itemsObj.length))}
	    	csvAddr = addrHeader + String(key) + ".csv"
	    	fs.writeFileSync(csvAddr, itemsObj[key]);
		}
		}
    	console.log("fkn done yeh");
	});
}

function getChange(arr){
	priceNow = Number(arr[index.priceNow]);
	priceCompare = Number(arr[index.priceCompare]);
	// console.log("Change of: " + String((priceCompare - priceNow) /priceNow *100));
	// console.log("         : " + String(priceNow) + ", " + String(priceCompare));
	return String((priceCompare - priceNow) /priceNow *100) + "%";
}
