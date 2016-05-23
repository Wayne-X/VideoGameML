// node makeTrendData.js itemdataWithCategory.csv

// load required
var fs = require('fs');	// file write and read

// Check call, get source and destination addresses
numOfArgs = process.argv.length;
if (numOfArgs != 3){
	console.log("improper call. Call with:\nnode makeTrendData.js itemdataWithCategory.csv");
	return;
}

srcAddr = process.argv[2];
writeAddr = "trendItemData.arff";

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
	arr = inStr.split("\n");
	if (arr[arr.length-1]==""){arr.pop();}
	// header
	wstream.write("@RELATION item_data_with_trends\n\n");
	wstream.write("@ATTRIBUTE ID NUMERIC\n");
	wstream.write("@ATTRIBUTE category {");
		wstream.write("\"Ammo\",");
		wstream.write("\"Costumes\",");
		wstream.write("\"Herblore materials\",");
		wstream.write("\"Melee armour - high level\",");
		wstream.write("\"Mining and Smithing\",");
		wstream.write("\"Range armour\",");
		wstream.write("\"Summoning scrolls\",");
		wstream.write("\"Arrows\",");
		wstream.write("\"Crafting materials\",");
		wstream.write("\"Hunting equipment\",");
		wstream.write("\"Melee armour - low level\",");
		wstream.write("\"Miscellaneous\",");
		wstream.write("\"Range weapons\",");
		wstream.write("\"Tools and containers\",");
		wstream.write("\"Bolts\",");
		wstream.write("\"Familiars\",");
		wstream.write("\"Hunting Produce\",");
		wstream.write("\"Melee armour - mid level\",");
		wstream.write("\"Pocket items\",");
		wstream.write("\"Runecrafting\",");
		wstream.write("\"Woodcutting product\",");
		wstream.write("\"Construction materials\",");
		wstream.write("\"Farming produce\",");
		wstream.write("\"Jewellery\",");
		wstream.write("\"Melee weapons - high level\",");
		wstream.write("\"Potions\",");
		wstream.write("\"Runes\",");
		wstream.write("\"Construction products\",");
		wstream.write("\"Fletching materials\",");
		wstream.write("\"Mage armour\",");
		wstream.write("\"Melee weapons - low level\",");
		wstream.write("\"Prayer armour\",");
		wstream.write("\"Runes Spells and Teleports\",");
		wstream.write("\"Cooking ingredients\",");
		wstream.write("\"Food and Drink\",");
		wstream.write("\"Mage weapons\",");
		wstream.write("\"Melee weapons - mid level\",");
		wstream.write("\"Prayer materials\",");
		wstream.write("\"Seeds\"");
	wstream.write("}\n");

	wstream.write("@ATTRIBUTE timestamp NUMERIC\n");
	wstream.write("@ATTRIBUTE price_now NUMERIC\n");
	wstream.write("@ATTRIBUTE price_one NUMERIC\n");
	wstream.write("@ATTRIBUTE price_seven NUMERIC\n");
	wstream.write("@ATTRIBUTE price_thirty NUMERIC\n");
	wstream.write("@ATTRIBUTE thirty_min NUMERIC\n");
	wstream.write("@ATTRIBUTE thirty_max NUMERIC\n");
	wstream.write("@ATTRIBUTE thirty_avg NUMERIC\n");
	wstream.write("@ATTRIBUTE thirty_trend {UP, DOWN, SAME}\n\n");
	wstream.write("@DATA\n");

	// for (var i=0; i<100000; i++){
	for (i in arr){
		if ((i%(Math.round(arr.length/100)))==0){console.log("writing " + String(i) + " of " + String(arr.length));}
		var row = arr[i].split(",");
		if (row[row.length-1]==""){row.pop();}
		if (row[3]=="price_now"){continue;}

		if (row[3]>row[6]){
			row.push("UP");
		}
		else if (row[3]==row[6]){
			row.push("SAME");
		}
		else {
			row.push("DOWN");
		}
		for (var j=0; j<(row.length-1); j++){
			if (j==1){wstream.write("\"");}
			wstream.write(String(row[j]));
			if (j==1){wstream.write("\"");}
			wstream.write(",");
		}
		wstream.write(String(row[row.length-1]) + "\n");
	}
	wstream.end();
	console.log("done, closing");
}