// node processCSVbyMetric.js itemdatapath inpath metric_option
// node processCSVbyMetric.js itemdata.json itemprices.json 0

// 0 : all items, add category data
// 1 : if > 1% change in 50% of days
// 2 : if total change < 10% avg price
// NOTE: also removes all items with avg > 2 bil or below 10

// CSV FORMAT IS
// ID, timestamp, price now, price 1 day ago, price 7 days ago, price 30 days ago, 30 day min price, 30 day max price, 30 day average price
// node makeCSV.js itemdata.json
// node-debug makeCSV.js itemdata.json

// load required
var fs = require('fs'); // file write and read

itemdatapath = process.argv[2];
srcAddr = process.argv[3];
metricOption = process.argv[4];

// get list
fs.readFile(srcAddr, 'utf8', function (err,data) {
    if (err) {
        console.log("Bad list source address: " + srcAddr);
        return;
    }
    fs.readFile(itemdatapath, 'utf8', function (err,data2) {
        if (err) {
            console.log("Bad list source address: " + srcAddr);
            return;
        }
        switch (metricOption){
        case "0":
            main0(data, data2);
            break;
        case "1":
            main1(data, data2);
            break;
        case "2":
            main2(data, data2);
            break;
        default:
            console.log("unknown metric, try again");
        }
    });
});


// write all, with category data
function main0(inStr, data){
    // init
    writeAddr = "by_metric/all_with_category.csv";
    wstream = fs.createWriteStream(writeAddr);
    arr = JSON.parse(inStr).all;
    itemsArr = JSON.parse(data).items;
    itemsHash = {};
    itemsArr.forEach(function (x) {itemsHash[String(x.id)] = x.type})
    // arr = arr.slice(0, 100);
    wstream.write("ID,category,timestamp,price_now,change_amt,change_type,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n");


    for (i in arr){
        if (i % 100 == 0){
            console.log("writing " + String(i) + " of " + String(arr.length));
        }

        w_ID = String(arr[i].ID);
        w_cat = itemsHash[w_ID].replace (",","");
        
        for (j=30; j<arr[i].data.length; j++){
            // check time difference
            // t = arr[i].data[j][0] - arr[i].data[j-1][0];
            // if (t != 86400000){
            //  console.log("bad time: " + String(t));
            // }
            w_timestamp = String(arr[i].data[j][0]);
            // if (w_timestamp == 1449964800000){
            //  console.log("problem");
            // }
            
            change = arr[i].data[j][1] - arr[i].data[j - 1][1];
            w_change  = String(change / arr[i].data[j - 1][1]);
            w_change_type = change > 0 ? "U" : (change === 0 ? "S" : "D");
            w_price_now = String(arr[i].data[j][1]);
            w_price_one = String(arr[i].data[j-1][1]);
            w_price_seven = String(arr[i].data[j-7][1]);
            w_price_thirty = String(arr[i].data[j-30][1]);
            w_thirty_min = String(getMin(arr[i].data.slice(j-30, j)));
            w_thirty_max = String(getMax(arr[i].data.slice(j-30, j)));
            w_thirty_average = String(getAvg(arr[i].data.slice(j-30, j)));
            wstream.write(w_ID + ',' + w_cat + ',' +  w_timestamp + ',' +  w_price_now + ',' + w_change + ',' + w_change_type + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
        }
    }
    wstream.end();
    console.log("done, closing");

    // functions -------------------------------

    function getMin(inArr){
        min = inArr[0][1];
        for (k in inArr){
            if (inArr[k][1] < min){
                min = inArr[k][1];
            }
        }
        return min;
    }

    function getMax(inArr){
        max = inArr[0][1];
        for (k in inArr){
            if (inArr[k][1] > max){
                max = inArr[k][1];
            }
        }
        return max; 
    }

    function getAvg(inArr){
        sum = 0;
        for (k in inArr){
            sum += inArr[k][1];
        }
        return sum/inArr.length;
    }
}

// remove if average > 2 bil or < 10
// if > 1% change in 50% of days
function main1(inStr, data){
    // init
    writeAddr = "by_metric/change_freq_metric.csv";
    wstream = fs.createWriteStream(writeAddr);
    arr = JSON.parse(inStr).all;
    itemsArr = JSON.parse(data).items;
    itemsHash = {};
    itemsArr.forEach(function (x) {itemsHash[String(x.id)] = x.type})
    // arr = arr.slice(0, 100);
    wstream.write("ID,category,timestamp,price_now,change_amt,change_type,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n");

    sskipk = 0;
    bskipk = 0;
    fck = 0;
    for (i in arr){
        if (i % 100 == 0){
            console.log("writing " + String(i) + " of " + String(arr.length));
        }

        w_ID = String(arr[i].ID);
        w_cat = itemsHash[w_ID].replace (",","");

        if (totalAverage(arr[i]) > 20000000){
            // console.log("skipping: " + w_ID + " with average: " + String(totalAverage(arr[i])));
            bskipk++;
            continue;
        }
        if (totalAverage(arr[i]) < 10){
            // console.log("skipping: " + w_ID + " with average: " + String(totalAverage(arr[i])));
            sskipk++;
            continue;
        }
        if (badFreqCheck(arr[i].data)){
            fck++;
            continue;
        }


        for (j=30; j<arr[i].data.length; j++){
            // check time difference
            // t = arr[i].data[j][0] - arr[i].data[j-1][0];
            // if (t != 86400000){
            //  console.log("bad time: " + String(t));
            // }
            w_timestamp = String(arr[i].data[j][0]);
            // if (w_timestamp == 1449964800000){
            //  console.log("problem");
            // }
            
            change = arr[i].data[j][1] - arr[i].data[j - 1][1];
            w_change  = String(change / arr[i].data[j - 1][1]);
            w_change_type = change > 0 ? "U" : (change === 0 ? "S" : "D");
            w_price_now = String(arr[i].data[j][1]);
            w_price_one = String(arr[i].data[j-1][1]);
            w_price_seven = String(arr[i].data[j-7][1]);
            w_price_thirty = String(arr[i].data[j-30][1]);
            w_thirty_min = String(getMin(arr[i].data.slice(j-30, j)));
            w_thirty_max = String(getMax(arr[i].data.slice(j-30, j)));
            w_thirty_average = String(getAvg(arr[i].data.slice(j-30, j)));
            wstream.write(w_ID + ',' + w_cat + ',' +  w_timestamp + ',' +  w_price_now + ',' + w_change + ',' + w_change_type + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
        }
    }
    wstream.end();
    console.log("items skipped to <10 average: " + String(sskipk));
    console.log("items skipped to >2bil average: " + String(bskipk));
    console.log("items skipped to <50% of days with >1% change: " + String(fck));
    console.log("done, closing");

    // functions -------------------------------

    function badFreqCheck(a){
        s = 0;
        for (k=1; k<a.length; k++){
            pchange = Math.abs((a[k][1] - a[k-1][1])/a[k-1][1]);
            if (pchange < 0.01){
                s++;
            }
        }
        if ((s/(a.length-1)) < 0.5){
            return true;
        }
    }

    function totalAverage(a){
        s = 0;
        for (k in a.data){
            s += a.data[k][1];
        }
        // console.log("average of: " + String(s/a.data.length));
        return s/a.data.length;
    }

    function getMin(inArr){
        min = inArr[0][1];
        for (k in inArr){
            if (inArr[k][1] < min){
                min = inArr[k][1];
            }
        }
        return min;
    }

    function getMax(inArr){
        max = inArr[0][1];
        for (k in inArr){
            if (inArr[k][1] > max){
                max = inArr[k][1];
            }
        }
        return max; 
    }

    function getAvg(inArr){
        sum = 0;
        for (k in inArr){
            sum += inArr[k][1];
        }
        return sum/inArr.length;
    }
}

// remove if average > 2 bil or < 10
// if total % change < 10% avg price
function main2(inStr, data){
    // init
    writeAddr = "by_metric/change_sum_metric.csv";
    wstream = fs.createWriteStream(writeAddr);
    arr = JSON.parse(inStr).all;
    itemsArr = JSON.parse(data).items;
    itemsHash = {};
    itemsArr.forEach(function (x) {itemsHash[String(x.id)] = x.type})
    // arr = arr.slice(0, 100);
    wstream.write("ID,category,timestamp,price_now,change_amt,change_type,price_one,price_seven,price_thirty,thirty_min,thirty_max,thirty_avg\n");

    sskipk = 0;
    bskipk = 0;
    sumk = 0;
    for (i in arr){
        if (i % 100 == 0){
            console.log("writing " + String(i) + " of " + String(arr.length));
        }

        w_ID = String(arr[i].ID);
        w_cat = itemsHash[w_ID].replace (",","");

        if (totalAverage(arr[i].data) > 20000000){
            // console.log("skipping: " + w_ID + " with average: " + String(totalAverage(arr[i])));
            bskipk++;
            continue;
        }
        if (totalAverage(arr[i].data) < 10){
            // console.log("skipping: " + w_ID + " with average: " + String(totalAverage(arr[i])));
            sskipk++;
            continue;
        }
        if (badSumCheck(arr[i].data)){
            sumk++;
            continue;
        }


        for (j=30; j<arr[i].data.length; j++){
            // check time difference
            // t = arr[i].data[j][0] - arr[i].data[j-1][0];
            // if (t != 86400000){
            //  console.log("bad time: " + String(t));
            // }
            w_timestamp = String(arr[i].data[j][0]);
            // if (w_timestamp == 1449964800000){
            //  console.log("problem");
            // }
            
            change = arr[i].data[j][1] - arr[i].data[j - 1][1];
            w_change  = String(change / arr[i].data[j - 1][1]);
            w_change_type = change > 0 ? "U" : (change === 0 ? "S" : "D");
            w_price_now = String(arr[i].data[j][1]);
            w_price_one = String(arr[i].data[j-1][1]);
            w_price_seven = String(arr[i].data[j-7][1]);
            w_price_thirty = String(arr[i].data[j-30][1]);
            w_thirty_min = String(getMin(arr[i].data.slice(j-30, j)));
            w_thirty_max = String(getMax(arr[i].data.slice(j-30, j)));
            w_thirty_average = String(getAvg(arr[i].data.slice(j-30, j)));
            wstream.write(w_ID + ',' + w_cat + ',' +  w_timestamp + ',' +  w_price_now + ',' + w_change + ',' + w_change_type + ',' +  w_price_one + ',' +  w_price_seven + ',' +  w_price_thirty + ',' +  w_thirty_min + ',' +  w_thirty_max + ',' +  w_thirty_average + '\n');
        }
    }
    wstream.end();
    console.log("items skipped to <10 average: " + String(sskipk));
    console.log("items skipped to >2bil average: " + String(bskipk));
    console.log("items skipped to total % change < 0.5: " + String(sumk));
    console.log("done, closing");

    // functions -------------------------------

    function badSumCheck(a){
        s = 0;
        for (k=1; k<a.length; k++){
            s += Math.abs(a[k][1] - a[k-1][1]) / a[k][1];
        }
        // console.log("total change: " + String(s));
        // console.log("average change: " + String(totalAverage(a)) + "\n");
        if (s < 0.5){
            return true;
        }
    }

    function totalAverage(a){
        s = 0;
        for (k in a){
            s += a[k][1];
        }
        // console.log("average of: " + String(s/a.data.length));
        return s/a.length;
    }

    function getMin(inArr){
        min = inArr[0][1];
        for (k in inArr){
            if (inArr[k][1] < min){
                min = inArr[k][1];
            }
        }
        return min;
    }

    function getMax(inArr){
        max = inArr[0][1];
        for (k in inArr){
            if (inArr[k][1] > max){
                max = inArr[k][1];
            }
        }
        return max; 
    }

    function getAvg(inArr){
        sum = 0;
        for (k in inArr){
            sum += inArr[k][1];
        }
        return sum/inArr.length;
    }
}
