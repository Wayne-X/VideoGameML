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
    itemsHash = {};
    itemsArr.forEach(function (x) {itemsHash[String(x.id)] = x.type})
    wstream = fs.createWriteStream("itemdataWithCategory.csv");
    wstream.write("ID,category,timestamp,price_now,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n");
    for (i=1; i<csvArr.length; i++){
        if(i % 1000 == 0){
            console.log("Writing " + String(i) + " of " + String(csvArr.length));
        }
        csvRow = csvArr[i].split(",");
        csvID = csvRow[0];
        cat = itemsHash[String(csvID)];
        if (cat !== undefined){
            csvRow.splice(1, 0, cat);
            for (j in csvRow){
                wstream.write(csvRow[j] + ',');
            }
            wstream.write("\n");
        }
        else {
            console.log("missing data for ID: " + String(csvID));
        }
    }
    wstream.end();
}
