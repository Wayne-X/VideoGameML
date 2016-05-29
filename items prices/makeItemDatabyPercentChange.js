// node makeItemDatabyPercentChange.js

// load required
var fs = require('fs'); // file write and read

daysToCompare = Number(process.argv[3]);
addrHeader = "by_category_with_percent_change/";


fs.readFile("itemprices.json", 'utf8', function (err, prices) {
	if (err) {
		console.log("Bad itemprices source address");
		return;
	}
	fs.readFile("itemdata.json", 'utf8', function (err, cats) {
		if (err) {
			console.log("Bad itemdata source address");
			return;
		}
		main(prices, cats);
	});
});

function main(prices, cats){
	prices = JSON.parse(prices).all;
	cats = JSON.parse(cats).items;
	cat_hash = {};
	cats.forEach(function(x, i){
		cat_hash[String(x.id)] = String(x.type).replace(/,/g, '');
	});

	write_hash = {};
	// for each item
	// for each entry in that item
	// get the metrics to create a few lines
	// and push those lines to the appropriate category in write_hash
	for (i=0; i<prices.length; i++){
		x = prices[i];
		if(i%Math.round(prices.length/20)==0){console.log("Processing " + String(i) + " of " + String(prices.length));}
		// for each item
		i_id = String(x.ID);
		i_cat = cat_hash[String(i_id)];
		i_s = "";
		for (j=0; j<x.data.length; j++){
			// for each entry in that item
			if(j<30){continue;}
			y = x.data[j]
			// get the metrics to create a few lines
			i_s += String(i_id) + ",";				// ID
			i_s += String(i_cat) + ",";				// category
			i_s += String(y[0]) + ",";				// timestamp
			i_s += String(y[1]) + ",";				// price_now
			i_s += String(x.data[j-1][1]) + ",";			// price_one
			i_s += String(x.data[j-7][1]) + ",";			// price_seven
			i_s += String(x.data[j-30][1]) + ",";		// price_thirty
			i_s += String(getMin(x.data.slice(j-29, j-29+30))) + ",";		// thirty_min
			i_s += String(getMax(x.data.slice(j-29, j-29+30))) + ",";		// thirty_max
			i_s += String(getAvg(x.data.slice(j-29, j-29+30))) + ",";		// thirty_avg
			// day by day percent change for 30 day range
			for (k=0; k<29; k++){
				i_s += String(getPChange(x.data.slice(j-29, j-29+30), k)) + ",";
			}
			i_s = i_s.slice(0, -1);
			i_s += "\n";
			// console.log("j: " + j);

		};
		// console.log("NEW ITEM -------------------------------------");
		// and push those lines to the appropriate category in write_hash
		if(write_hash[i_cat]==undefined){write_hash[i_cat] = "";}
		write_hash[i_cat] += i_s;
	};	

	// write to file
	fs.mkdir(addrHeader, function(err) {
		header = "ID,category,timestamp,price_now,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg,";
		for (var jj=0; jj<29; jj++){header+="p_change_day"+String(jj)+"_to_day"+String(jj+1)+",";}
		header = header.slice(0, -1);
		header += "\n";
		for (var key in write_hash) {
		if (write_hash.hasOwnProperty(key)) {
			console.log("Writing to: " + addrHeader + String(key) + ".csv");
	    	csvAddr = addrHeader + String(key) + ".csv"
	    	fs.writeFileSync(csvAddr, header + write_hash[key]);
		}
		}
    	console.log("fkn done yeh");
	});
}

// functions -------------------------------

getMin = function(inArr){
	min = inArr[0][1];
	for (k in inArr){
		if (inArr[k][1] < min){
			min = inArr[k][1];
		}
	}
	return min;
}

getMax = function(inArr){
	max = inArr[0][1];
	for (k in inArr){
		if (inArr[k][1] > max){
			max = inArr[k][1];
		}
	}
	return max;	
}

getAvg = function(inArr){
	sum = 0;
	for (k in inArr){
		sum += inArr[k][1];
	}
	return sum/inArr.length;
}

getPChange = function(arr, k){
	t = arr[arr.length-1-k][1];
	s = arr[((arr.length-1)-k)-1][1];
	return String(((t-s) /s) *100);
}