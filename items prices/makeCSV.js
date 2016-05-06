// CSV FORMAT IS
// ID, name, timestamp, price now, price 1 day ago, price 7 days ago, price 30 days ago, 30 day min price, 30 day max price, 30 day average price

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


	for (i in obj){
		console.log("writing " + String(i) + "/" + String(obj.length - 1));
		w_ID = String(obj[i].ge_id);
		w_name = String(obj[i].label);
		for (j=30; j<obj[i].data.length; j++){
			w_timestamp = String(obj[i].data[j][0]);
			w_price_now = String(obj[i].data[j][1]);
			w_price_one = String(obj[i].data[j-1][1]);
			w_price_seven = String(obj[i].data[j-7][1]);
			w_price_thirty = String(obj[i].data[j-30][1]);
			w_thirty_min = String(getMin(obj[i].data.slice(j-30, j)));
			w_thirty_max = String(getMax(obj[i].data.slice(j-30, j)));
			w_thirty_average = String(getAvg(obj[i].data.slice(j-30, j)));
			// console.log(w_ID + ',' +  w_name + ',' +  w_timestamp + ',' +  w_price_now + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
			wstream.write(w_ID + ',' +  w_name + ',' +  w_timestamp + ',' +  w_price_now + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
		}
	}
	console.log("done");
	wstream.end();

	// functions -------------------------------
	function getMin(arr){
		min = arr[0][1];
		for (i in arr){
			if (arr[i][1] < min){
				min = arr[i][1];
			}
		}
		return min;
	}

	function getMax(arr){
		max = arr[0][1];
		for (i in arr){
			if (arr[i][1] > max){
				max = arr[i][1];
			}
		}
		return max;	}

	function getAvg(arr){
		sum = 0;
		for (i in arr){
			sum += arr[i][1];
		}
		return sum/arr.length;
	}
}