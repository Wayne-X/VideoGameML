// load required
var fs = require('fs');	// file write and read
var http = require('http');

srcAddr = process.argv[2];
writeAddr = "items.js";

// get list
fs.readFile(srcAddr, 'utf8', function (err,data) {
	if (err) {
		console.log("Bad list source address: " + srcAddr);
		return;
	}
	main(data, false, 0);
});

function main(a, ifa, i){
	console.log("called: " + String(i));
	if (!ifa){
		a = a.split(',');
	}

	getInfo(a[i]);
	setTimeout(main(a, true, i+1), 100000);
}	


function getInfo(id){

	var options = {
		host: 'services.runescape.com',
		port: 80,
		path: '/m=itemdb_rs/api/graph/' + String(id) + '.json'
	};


	http.get(options, function (http_res) {
	    var data = "";
	    http_res.on("data", function (chunk) {
	        data += chunk;
	    });
	    http_res.on("end", function () {
	        console.log(data);
	    });
		http_res.on('error', function(e) {
		 	console.log("Got error: " + e.message);
		});
	});
}