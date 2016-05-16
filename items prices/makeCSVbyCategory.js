// node processCSVbyCategory.js itemdataWithCategory.csv

// load required
var fs = require('fs'); // file write and read

fs.readFile(process.argv[2], 'utf8', function (err,csvstr) {
    if (err) {
        console.log("Bad list source address");
        return;
    }
    main(csvstr);
});

function main(csvstr){
    // console.log("got this far");
    csvArr = csvstr.split("\n");
    catHash = {};
    
    for (i=1; i<csvArr.length; i++){
        if(i % 10000 == 0){
            console.log("Writing " + String(i) + " of " + String(csvArr.length));
        }
        csvRow = csvArr[i].split(",");
        csvID = csvRow[1];
        if (catHash[csvID] == undefined){
            catHash[csvID] = "ID,category,timestamp,price_now,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n";
        }
        catHash[csvID] += csvArr[i] + "\n";
    }
    for (var key in catHash) {
    if (catHash.hasOwnProperty(key)) {
    if (key != "undefined"){
        console.log("writing: " + key);
        writeToFile(key, catHash[key]);
    }
    }
    }
}

function writeToFile(cat, text){
    fs.writeFile("by_category/"+cat+".csv", text, function(err) {
        if(err) {
            return console.log(err);
        }
    }); 
}