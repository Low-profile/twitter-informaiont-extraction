//let infowindow;
//let geocoder;
let markersArray = [];

let EARTH_RADIUS = 6378137.0;    //单位M
let PI = Math.PI;
let map;
// todo: add init function
let slc_marker_locs = [];
let pt_marker_locs = [];



$.ajax({
    //url: 'testdata.txt',
    url: 'slc_tweets.json',
    dataType: 'json',
    async: false,
    //data: myData,
    success: function (data) {
        let stopall = stops_slc.split(";");
        $.each(data, function (infoIndex, info) {
            //console.log('aaa')
            if (info["stop_id"] !== "") {
                let ilat;
                let ilng;
                let found = false;
                for (let i in stopall) {
                    let curstop = stopall[i].split(",");
                    if (curstop[0] === info["stop_id"]) {
                        ilat = parseFloat(curstop[4]);
                        ilng = parseFloat(curstop[5]);
                        found = true;
                        break;
                    }
                }

                // let onestop = stopall[info["stop_id"]].split(",");
                // let ilat = parseFloat(onestop[4]);
                // let ilng = parseFloat(onestop[5]);
                if(found)
                    slc_marker_locs.push({
                        lat: ilat,
                        lng: ilng,
                        info: info["content"],
                        link: info["links"]
                    });
            }

        });
    },
    error: function (jqXHR) {
        console.log(jqXHR);
    }
});

$.ajax({
    url: 'pt_tweets.json',
    dataType: 'json',
    async: false,
    //data: myData,
    success: function (data) {
        let stopall = stops_portland.split(";");
        $.each(data, function (infoIndex, info) {
            //console.log('aaa')
            if (info["stop_id"] !== "") {
                let found = false
                let ilat;
                let ilng;
                for (let i in stopall) {
                    let curstop = stopall[i].split(",");
                    if (curstop[0] === info["stop_id"]) {
                        ilat = parseFloat(curstop[4]);
                        ilng = parseFloat(curstop[5]);
                        found = true;
                        break;
                    }
                }
                if(found)
                // let onestop = stopall[info["stop_id"]].split(",");
                // let ilat = parseFloat(onestop[4]);
                // let ilng = parseFloat(onestop[5]);
                    pt_marker_locs.push({
                        lat: ilat,
                        lng: ilng,
                        info: info["content"],
                        link: info["links"]
                    });
            }

        });
    },
    error: function (jqXHR) {
        console.log(jqXHR);
    }
});


// $.ajax({
//     type: "GET",
//     url: "slc_stops.csv",
//     dataType: "text"
//     success: function (data) {
//         processData(data);
//     }
// });

// function processData(allText) {
//     let allTextLines = allText.split(/\r\n|\n/);
//     let headers = allTextLines[0].split(',');
//     let lines = [];
//
//     for (let i = 1; i < allTextLines.length; i++) {
//         let data = allTextLines[i].split(',');
//         if (data.length === headers.length) {
//
//             let tarr = [];
//             for (let j = 0; j < headers.length; j++) {
//                 tarr.push(headers[j] + ":" + data[j]);
//             }
//             lines.push(tarr);
//         }
//     }
//     // alert(lines);
// }


function cc() {
    var city = document.getElementById("city");
    var stopall = [];
    if(city.options[city.selectedIndex].value == "slc"){
        stopall = stops_slc.split(";");
    }else{
        stopall = stops_portland.split(";");
    }
    document.getElementById("stp_range").innerHTML = "(1~"+ (stopall.length-1).toString() +")";
}


function getRad(d) {
    return d * PI / 180.0;
}

function checkEnter() {
    let stopno = document.getElementById("stop_no");
    stopno.focus();
    if (event.keyCode === 13)
        WattCal();
}

function getGreatCircleDistance(lat1, lng1, lat2, lng2) {
    let radLat1 = getRad(lat1);
    let radLat2 = getRad(lat2);

    let a = radLat1 - radLat2;
    let b = getRad(lng1) - getRad(lng2);

    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000.0;

    return s;
}

function SetPosition(location) {
    let minDist = 1000;
    let proximateStop = 1;
    let pNum = 0;
    let stopno = document.getElementById("stop_no");
    //Object 'stops' defined in stops.js
    let city = document.getElementById("city");
    //Object 'stops' defined in stops.js
    let stopall = [];
    if(city.options[city.selectedIndex].value === "slc"){
        stopall = stops_slc.split(";");
    }else{
        stopall = stops_portland.split(";");
    }
    for (let i = 1; i <= stopall.length-1; i++) {
        let stop = stopall[i].split(",");
        let ilati = parseFloat(stop[4]);
        let ilong = parseFloat(stop[5]);
        let lat = location.lat();
        let lng = location.lng();
        //alert("ilat:"+ilati+" ilng:"+ilong+" lat:"+lat+" lng:"+lng);

        let dist = getGreatCircleDistance(ilati, ilong, lat, lng);

        if (dist < minDist) {
            minDist = dist;
            proximateStop = i;
            pNum += 1;
        }
    }

    if (pNum > 0) {
        stopno.value = proximateStop;
        WattCal();
    } else {
        alert("No data in this area!");
        //document.getElementById("Msg").innerHTML = "<font color=\'red\'>No data at this area!</font>";
    }

}


function WattCal() {
    let stopno = document.getElementById("stop_no");
    let city = document.getElementById("city");
    let wattall = [];
    let stopall = [];

    if(city.options[city.selectedIndex].value === "slc"){
        wattall = watt_slc.split(";");
        stopall = stops_slc.split(";");
    }else{
        wattall = watt_portland.split(";");
        stopall = stops_portland.split(";");
    }

    let sno = parseInt(stopno.value);
    if (stopno.value.length === 0 || (/[^\d]/.test(sno)) || sno <= 0 || sno > wattall.length-1) {
        //alert("Stop Number illegal!(1~6265)");
        document.getElementById("Msg").innerHTML = "<span style=\'red\'>Illegal Stop Number!(1~"+ (wattall.length-1).toString() +")</span>";
        stopno.focus();
        return;
    }
    document.getElementById("Msg").innerHTML = "";

    let divWatt = document.getElementById("wattcanvas");
    let divMap = document.getElementById("map");
    let maphr = document.getElementById("maphr");
    let tazhr = document.getElementById("tazhr");
    //let taz = document.getElementById("taz");
    //let divvis = document.getElementById("vis");

    let slc_taz=document.getElementById("slc_taz");
    let pl_taz=document.getElementById("portland_taz");


    //display two figure
    divWatt.style.display = 'block';
    divMap.style.display = 'inline-block';
    maphr.style.display = 'block';
    tazhr.style.display = 'block';

    //taz.style.display = 'block';
    //divvis.style.display = 'inline-block'

    //Object 'watt' defined in WATT.js
    //let wattall = watt.split(";");

    //let lab = wattall[0].split(",");
    //lab.splice(0,1);

    if(city.options[city.selectedIndex].value === "slc"){
        slc_taz.style.display='block';
        pl_taz.style.display='none';
    }else{
        slc_taz.style.display='none';
        pl_taz.style.display='block';
    }

    let dat = wattall[sno].split(",");
    dat.splice(0, 1);
    dat.splice(1, 1);

    let idat = [];
    let median = [];
    let average = [];
    for (let i = 0; i < dat.length - 2; i++) {
        idat[i] = dat[i] / 60;
        median[i] = dat[dat.length - 2] / 60;
        average[i] = dat[dat.length - 1] / 60;
    }

    //Object 'stops' defined in stops.js
   // let stopall = stops.split(";");
    let onestop = stopall[sno].split(",");

    let id = document.getElementById("WattChart");
    if (id != null) {
        divWatt.removeChild(id);
    }

    let canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 400;
    canvas.id = "WattChart";
    divWatt.appendChild(canvas);

    let ctx = canvas.getContext("2d");

    new Chart(ctx, {
        type: 'line',
        data: {
            //labels : lab ,
            labels: [
                '5:00AM', '5:10AM', '5:20AM', '5:30AM', '5:40AM', '5:50AM',
                '6:00AM', '6:10AM', '6:20AM', '6:30AM', '6:40AM', '6:50AM',
                '7:00AM', '7:10AM', '7:20AM', '7:30AM', '7:40AM', '7:50AM',
                '8:00AM', '8:10AM', '8:20AM', '8:30AM', '8:40AM', '8:50AM',
                '9:00AM', '9:10AM', '9:20AM', '9:30AM', '9:40AM', '9:50AM',
                '10:00AM', '10:10AM', '10:20AM', '10:30AM', '10:40AM', '10:50AM',
                '11:00AM', '11:10AM', '11:20AM', '11:30AM', '11:40AM', '11:50AM',
                '12:00PM', '12:10PM', '12:20PM', '12:30PM', '12:40PM', '12:50PM',
                '1:00PM', '1:10PM', '1:20PM', '1:30PM', '1:40PM', '1:50PM',
                '2:00PM', '2:10PM', '2:20PM', '2:30PM', '2:40PM', '2:50PM',
                '3:00PM', '3:10PM', '3:20PM', '3:30PM', '3:40PM', '3:50PM',
                '4:00PM', '4:10PM', '4:20PM', '4:30PM', '4:40PM', '4:50PM',
                '5:00PM', '5:10PM', '5:20PM', '5:30PM', '5:40PM', '5:50PM',
                '6:00PM', '6:10PM', '6:20PM', '6:30PM', '6:40PM', '6:50PM',
                '7:00PM', '7:10PM', '7:20PM', '7:30PM', '7:40PM', '7:50PM',
                '8:00PM', '8:10PM', '8:20PM', '8:30PM', '8:40PM', '8:50PM',
                '9:00PM', '9:10PM', '9:20PM', '9:30PM', '9:40PM', '9:50PM',
                '10:00PM'],
            datasets:
                [
                    {
                        label: "Median of WATT",// + onestop[2]+" (No." + sno + ")",
                        data: median,
                        borderColor: "rgb(183,115,40)",
                        borderWidth: 2,
                        lineTension: 0
                    },

                    {
                        label: "Average of WATT",// + onestop[2]+" (No." + sno + ")",
                        borderColor: "rgb(75, 90, 192)",
                        borderWidth: 1,
                        lineTension: 0,
                        data: average
                    },
                    {
                        label: "WATT of " + onestop[2] + " (No." + sno + ")",
                        data: idat,
                        borderWidth: 1,
                        borderColor: "rgb(220, 220, 220)",
                        backgroundColor: "rgb(165,237,217)",
                        lineTension: 0.3
                    },

                ]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: false,
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: false,
                    }
                }]
            },
            elements: {point: {radius: 0}}
        }
    });

    //updateTweets()


    let ilati = parseFloat(onestop[4]);
    let ilong = parseFloat(onestop[5]);

    let uluru = {lat: ilati, lng: ilong};

    map.setCenter(uluru)

    // let marker = new google.maps.Marker({
    //   position: uluru,
    //   map: map
    // });

    //map.addMarker(marker);


    /*
        let contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">STAT demo</h1>'+
          '<div id="bodyContent">'+
          '<p><b>#UTA</b>, Missed the bus, must wait 30s mins for the next! <b>#exhausted #unfair</b><br>'+
          'from <b>@tontboer</b> at 16/03/2018 12:11:34</p>'+
          '<img src="example.png" />'+
          '</div>'+
          '</div>';
        */


}

// function placeMarker(location, map, geocoder) {
//     clearOverlays(infowindow);//清除地图中的标记
//     let marker = new google.maps.Marker({
//         position: location,
//         map: map
//     });
//     markersArray.push(marker);
//     //根据经纬度获取地址
//     if (geocoder) {
//         geocoder.geocode({'location': location}, function (results, status) {
//             if (status === google.maps.GeocoderStatus.OK) {
//                 if (results[0]) {
//                     attachSecretMessage(marker, results[0].geometry.location, results[0].formatted_address);
//                 }
//             } else {
//                 alert("Geocoder failed due to: " + status);
//             }
//         });
//     }
// }

//在地图上显示经纬度地址
// function attachSecretMessage(marker, piont, address) {
//     let message = "<b>Coordinates:</b>" + piont.lat() + " , " + piont.lng() + "<br />" + "<b>Address:</b>" + address;
//     let infowindow = new google.maps.InfoWindow(
//         {
//             content: message,
//             size: new google.maps.Size(50, 50)
//         });
//     infowindow.open(map, marker);
//     if (typeof (mapClick) === "function") mapClick(piont.lng(), piont.lat(), address);
// }

//删除所有标记阵列中消除对它们的引用
// function clearOverlays(infowindow) {
//     if (markersArray && markersArray.length > 0) {
//         for (let i = 0; i < markersArray.length; i++) {
//             markersArray[i].setMap(null);
//         }
//         markersArray.length = 0;
//     }
//     if (infowindow) {
//         infowindow.close();
//     }
// }

function initMap() {
    let uluru = {lat: 40.767059, lng: -111.847321};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: uluru
    });


    //let infoWin = new google.maps.InfoWindow();
    let marker_locs = slc_marker_locs.concat(pt_marker_locs)

    console.log(marker_locs)

    let markers = marker_locs.map(function (location) {
        let marker = new google.maps.Marker({
            position: location,
            info: location.info,
            link: location.link
        });
        google.maps.event.addListener(marker, 'click', function (evt) {
            //infoWin.setContent(location.info);
            //infoWin.setContent(location.links);
            //infoWin.open(map, marker);
            SetPosition(evt.latLng); // zoom to the cluster center
            updateTweets([marker]);
        });
        return marker;
    });


    let mcOptions = {gridSize: 40, maxZoom: 16, zoomOnClick: false, minimumClusterSize: 2};

    let markerCluster = new MarkerClusterer(map, markers, mcOptions);

    google.maps.event.addListener(map, 'click', function (event) {
        SetPosition(event.latLng);
        //placeMarker(event.latLng, map, geocoder);
    });

    google.maps.event.addListener(markerCluster, 'clusterclick', function(cluster) {
        SetPosition(cluster.getCenter()); // zoom to the cluster center
        let cur_markers = cluster.getMarkers();
        updateTweets(cur_markers);
    });

}

function updateTweets(markers){
    let tweets = document.getElementById("tweets");
    while (tweets.firstChild) {
        tweets.removeChild(tweets.firstChild);
    }

    for (let i = 0; i < markers.length; i ++ )
    {
        let blockquote = document.createElement('blockquote');
        blockquote.setAttribute("class", "twitter-tweet");
        blockquote.setAttribute("data-lang", "en");
        let a_html = document.createElement('a');
        a_html.setAttribute("href", markers[i]["link"]);
        blockquote.appendChild(a_html);
        tweets.appendChild(blockquote)
    }

    twttr.widgets.load()
}