// CSV FORMAT IS
// ID, timestamp, price now, price 1 day ago, price 7 days ago, price 30 days ago, 30 day min price, 30 day max price, 30 day average price
// node makeCSV.js itemdata.json
// node-debug makeCSV.js itemdata.json

// load required
var fs = require('fs');	// file write and read

// Check call, get source and destination addresses
numOfArgs = process.argv.length;
if (numOfArgs != 3){
	console.log("improper call. Call with:\nnode makeCSV.js itemdata.json");
	return;
}

srcAddr = process.argv[2];
writeAddr = "itemdata.csv";

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
	arr = JSON.parse(inStr).all;
	arr = arr.slice(0, 100);
	wstream.write("ID,timestamp,price_now,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n");



	for (i in arr){
		console.log("writing " + String(i) + " of " + String(arr.length));
		w_ID = String(arr[i].ID);

		for (j=30; j<arr[i].data.length; j++){
			// check time difference
			// t = arr[i].data[j][0] - arr[i].data[j-1][0];
			// if (t != 86400000){
			// 	console.log("bad time: " + String(t));
			// }
			w_timestamp = String(arr[i].data[j][0]);
			// if (w_timestamp == 1449964800000){
			// 	console.log("problem");
			// }

			w_price_now = String(arr[i].data[j][1]);
			w_price_one = String(arr[i].data[j-1][1]);
			w_price_seven = String(arr[i].data[j-7][1]);
			w_price_thirty = String(arr[i].data[j-30][1]);
			w_thirty_min = String(getMin(arr[i].data.slice(j-30, j)));
			w_thirty_max = String(getMax(arr[i].data.slice(j-30, j)));
			w_thirty_average = String(getAvg(arr[i].data.slice(j-30, j)));
			// // console.log(w_ID + ',' +  w_name + ',' +  w_timestamp + ',' +  w_price_now + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
			wstream.write(w_ID + ','  +  w_timestamp + ',' +  w_price_now + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
		}
	}
	wstream.end();
	console.log("done, closing");

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