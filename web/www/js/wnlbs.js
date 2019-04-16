
/*---------------------------------
 *  public
 *--------------------------------*/
function getVersion()
{
    document.getElementById("version").innerHTML = "20150915";
}

function check_author()
{
	var uname = getCookie("username");
    var isAdmin = getCookie("isAdmin");
    
	if(uname == "" || uname==null){
		alert("您还没有登录，请登录!");
		window.parent.location="/index.html";
        return false;
	}

	 if(isAdmin != "1"){
		alert("Authorization Error!");
		window.parent.location="/index.html";
	}

    check_exist();
}

function check_exist()
{ 
//	var uname = getCookie("username");
//    var headuser = window.parent.document.getElementById("uname").innerHTML;
//    
//    if(uname!=headuser){
//        alert("You are logouted or logined as anther user " + uname +"  "+ headuser);
//    	window.parent.location="/index.html";
//    }
}

//ajax public func
function createXHR() {
    var xhr;
    try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } catch(E) {
            xhr = false;
        }
    }

    if (!xhr && typeof XMLHttpRequest != 'undefined'){
        xhr = new XMLHttpRequest();
    }
    return xhr;
}

// utility function called by getCookie()
function getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

// primary function to retrieve cookie by name
function getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
    }
    return null;
}

/*---------------------------------
 *  login
 *--------------------------------*/
function loginSubmit() {
	uname = document.getElementById("username").value;
    passwd = document.getElementById("password").value;
	if (uname == '' || passwd == '') {
		alert('User Name or Password is empty !');
		document.getElementById("username").focus();
		return false;
	} else {
		onlogin();
	}
	return true;
}

function Anonymous() {
    xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbAnony;
        xhr.open("GET", "/cgi-bin/login.cgi?username=Anonymous&password=xxx");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

//function setCookie(name, value, expires, path, domain, secure)
function cbAnony() {
    //passwd = document.getElementById("password").value;
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				if(returnValue == "2"){
					document.getElementById("LoginError").innerHTML = "Anonymous User is Not Allowed!";//returnValue;
				} else {
					document.cookie="username=Anonymous;path=/";
					document.cookie="isAdmin=0;path=/";
					window.location.href="/main.html";
				}
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function onlogin() {
    //window.parent.location="/cgi-bin/login.cgi?username="+uname+"&password="+passwd;

    xhr = createXHR();
    uname = document.getElementById("username").value;
    passwd = document.getElementById("password").value;
    
    if(xhr) {
        xhr.onreadystatechange=cbLogin;
        xhr.open("GET", "/cgi-bin/login.cgi?username="+uname+"&password="+passwd);
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

//function setCookie(name, value, expires, path, domain, secure)
function cbLogin() {
	uname = document.getElementById("username").value;
    
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				if(returnValue == "1"){
					document.cookie="username="+uname+";path=/";
					document.cookie="isAdmin=1;path=/";
					window.location.href="/main.html";
				}else if(returnValue == "0"){
					document.cookie="username="+uname+";path=/";
					document.cookie="isAdmin=0;path=/";
					window.location.href="/main.html";
				}else if(returnValue == "2"){
					document.getElementById("LoginError").innerHTML = "User Name or Password Error !";//returnValue;
				} else {
					document.getElementById("LoginError").innerHTML = "Login Exception!!!";//returnValue;
                }

            }
        } else {
            alert("Page Exception!");
        }
    }
}

/*---------------------------------
 *  main.html
 *--------------------------------*/
function main_check() {
	var uname = getCookie("username");
	var isAdmin = getCookie("isAdmin");
	if(uname == ""||uname==null){
		alert("您还没有登录，请登录!");
		window.parent.location="/index.html";
	}
	
    document.getElementById("uname").innerHTML = uname;

    if(isAdmin=="1"){
		document.getElementById("menuID").src="/html/admin-menu.html";
		//document.getElementById("menuID").src="/cgi-bin/openHtml.cgi?file=./chn/admin-menu.html";
	}else{
		document.getElementById("menuID").src="/html/menu.html";
		//document.getElementById("menuID").src="/cgi-bin/openHtml.cgi?file=./chn/menu.html";
	}

}

function header_getuser() {
	var uname = getCookie("username");
	document.getElementById("iuser").innerHTML = uname;
}

function logout() {
	document.cookie="username=;path=/";
	document.cookie="isAdmin=;path=/";
    
    //main_logout();

    alert("注销登录成功!");

    window.parent.location="/index.html";
}

function main_logout(){
    var xhr = createXHR();
    var uname = getCookie("username");
    if(uname!=null||uname!=""){
        if(xhr) {
            xhr.onreadystatechange=cbLogout;
            xhr.open("GET", "/cgi-bin/logout.cgi?");
            xhr.send(null);
        } else {
            alert("The browsing is not support ajax, please change another!");
        }
    }
}

function cbLogout() {    
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
                //
			}
        } else {
            alert("Page Exception!");
        }
    }
}
/*---------------------------------
 *  chg-passwd
 *--------------------------------*/
function getuser() {
	var uname = getCookie("username");
    
    check_exist();

	document.getElementById("username").innerHTML = uname;
}

function chgpasswd_submit() {
    uname = window.parent.getCookie("username");
    oldpasswd = document.getElementById("passwd").value;
    passwd = document.getElementById("chg-passwd").value;
    passwdag = document.getElementById("chg-passwd-again").value;

     if (oldpasswd == '') {
		alert('Old Password is empty !');
		document.getElementById("passwd").focus();
		return false;
	}
    if (passwd == '') {
		alert('New Password is empty !');
		document.getElementById("chg-passwd").focus();
		return false;
	}
     if (passwdag == '') {
		alert('Type New Password Again !');
		document.getElementById("chg-passwd-again").focus();
		return false;
	}
    if (passwd != passwdag) {
		alert('Two password is different !');
		document.getElementById("chg-passwd").focus();
		return false;
	}

    window.location.href="/cgi-bin/chn/chg-passwd.cgi?username="+uname+"&oldpassword="+oldpasswd+"&password="+passwd;
    //document.getElementById("chgMsg").innerHTML = "/cgi-bin/chn/chg-passwd.cgi?username="+uname+"&oldpassword="+oldpasswd+"&password="+passwd;

    return true;
}

/*---------------------------------
 *  io-summary
 *--------------------------------*/
function iosummary_check() {
	var uname = getCookie("username");
	var isAdmin = getCookie("isAdmin");
	var enas;
	if(uname == "" || uname==null){
		alert("您还没有登录，请登录!");
		window.parent.location="/index.html";
	}
	
	if(isAdmin=="0"){
		enas = document.getElementsByName("ahref");
		for(var i = 0; i < enas.length; i++){
			enas[i].href = "javascript:void(0);";
			enas[i].setAttribute("disabled", "disabled");
		}
	}

    check_exist();
}

/*---------------------------------
 *  io-config
 *--------------------------------*/

//<script type="text/javascript">
function chgPort()
{     
	var s1 = document.getElementById("ioport");
	var s2 = document.getElementById("iomode");
	//var str = s1.value + " " + s2.value + "=";
    //document.getElementById("info").innerHTML = "selected " + num;

	//proc Hide/Display
	var tcp = document.getElementById("tcpOutputDiv");
	var tcpnew = document.getElementById("tcpNewDiv");
	var com = document.getElementById("comOutputDiv");
	var ntrip = document.getElementById("ntripOutputDiv");
	s2.length = 0;
	
	if(s1.value.indexOf("new")>=0){
		s2.options[0] = new Option("RTCM", "RTCM");
		s2.options[1] = new Option("NMEA", "NMEA");
		s2.options[2] = new Option("TC18", "TC18");
		tcpnew.style.display = "";
		tcp.style.display = "none";
		ntrip.style.display = "none";
		com.style.display = "none";
	}else if(s1.value.indexOf("TCP")>=0||s1.value.indexOf("UDP")>=0){
		s2.options[0] = new Option("RTCM", "RTCM");
		s2.options[1] = new Option("NMEA", "NMEA");
		s2.options[2] = new Option("TC18", "TC18");
		tcpnew.style.display = "none";
		tcp.style.display = "";
		ntrip.style.display = "none";
		com.style.display = "none";
	}else if(s1.value.indexOf("Ntrip")>=0){
		s2.options[0] = new Option("RTCM", "RTCM");
		tcpnew.style.display = "none";
		ntrip.style.display = "";
		tcp.style.display = "none";
		com.style.display = "none";
	}else if(s1.value.indexOf("COM")>=0){
		s2.options[0] = new Option("RTCM", "RTCM");
		s2.options[1] = new Option("NMEA", "NMEA");
		s2.options[2] = new Option("TC18", "TC18");
		tcpnew.style.display = "none";
		tcp.style.display = "none";
		ntrip.style.display = "none";
		com.style.display = "";
	}
	
	if(s1.value.indexOf("RTCM")>=0){
		s2.options[0].selected = true;
	}else if(s1.value.indexOf("NMEA")>=0){
		s2.options[1].selected = true;
	}else if(s1.value.indexOf("TC18")>=0){
		s2.options[2].selected = true;
	}
	
	showTCPsub();
}

function showTCPsub()
{
    //var str = "";
	var s = document.getElementById("ioport");
	var s1 = document.getElementById("iomode");
	var rtcm = document.getElementById("rtcmDiv");
	var ntrip = document.getElementById("nmeaDiv");
	var tc18 = document.getElementById("tc18Div");
	if(s1.value=="RTCM"){
		rtcm.style.display = "";
		ntrip.style.display = "none";
		tc18.style.display="none";
	}else if(s1.value=="NMEA"){
		rtcm.style.display = "none";
		ntrip.style.display = "";
		tc18.style.display="none";
	}else if(s1.value=="TC18"){
		rtcm.style.display = "none";
		ntrip.style.display = "none";
		tc18.style.display="";
	}

	var arr = s.value.split("*");

	//proc input/output
	var tcpio = document.getElementById("tcpio");
	var comio = document.getElementById("comio");
	var btl = document.getElementById("btl");
	var tport = document.getElementById("tcp.port");
	var sport = document.getElementById("server.port");
	
	if(arr[0].indexOf("TCP")>=0||arr[0].indexOf("UDP")>=0){
		tcpio.innerHTML = "输出： " + arr[1];
        var arr1 = arr[0].split(" ");
		tport.value = arr1[1];//parseInt(arr[0].substring(6)); //cal port
        if(arr[0].indexOf("UDP")>=0)
            sport.innerHTML = "UDP";
        else
            sport.innerHTML = "TCP";
	}else if(arr[0].indexOf("COM")>=0){
        var arr1 = arr[1].split("$");
		comio.innerHTML = "输出： " + arr1[1];
		v = parseInt(arr1[0]); //cal btl
		for(j=0; j<7; j++){
			if(v==btl.options[j].text){
				btl.options[j].selected=true;
				break;
			}
		}
	}else if(arr[0].indexOf("new")>=0){
        document.getElementById("udp").checked = false;
        document.getElementById("new.port").value = "";
    }
	
	//proc RTCM
	var ena = document.getElementById("rtcm.ena");
	var ver = document.getElementById("rtcm.version");
	var mod = document.getElementById("rtcm.mode");
	if(arr[1].indexOf("RTCM")>=0){ena.options[1].selected=true;}else{ena.options[0].selected=true;}

	if(arr[1].indexOf("RTCM_V31")>=0){ver.options[1].selected=true;}else 
        if(arr[1].indexOf("RTCM_V32")>=0){ver.options[2].selected=true;}else{ver.options[0].selected=true;}

	if(arr[1].indexOf("RTK+DGPS")>=0){mod.options[2].selected=true;}else
	    if(arr[1].indexOf("DGPS")>=0){mod.options[1].selected=true;}else
	        if(arr[1].indexOf("DGPS9-3")>=0){mod.options[3].selected=true;}else{mod.options[0].selected=true;}
	
	//proc NMEA
	var gga = document.getElementById("gga"); var gsv = document.getElementById("gsv");
	var gsa = document.getElementById("gsa"); var rmc = document.getElementById("rmc");
	var vtg = document.getElementById("vtg"); var zda = document.getElementById("zda");
	gga.options[0].selected=true;	gga.options[0].selected=true;	gsa.options[0].selected=true;
	rmc.options[0].selected=true;	vtg.options[0].selected=true;	zda.options[0].selected=true;
	if(arr[1].indexOf("NMEA-")>=0){
		tmp = arr[1].split(",");
		for(i=0; i<tmp.length; i++){
			if(tmp[i].indexOf("NMEA-GGA")>=0){
				v = tmp[i].substring(9);
				//str += "gga:" + v;
				for(j=0; j<8; j++){if(v==gga.options[j].text) {gga.options[j].selected=true; break;}}
			}
			if(tmp[i].indexOf("NMEA-GSV")>=0){
				v = tmp[i].substring(9);
				//str += "gsv:" + v;
				for(j=0; j<8; j++){if(v==gsv.options[j].text) {gsv.options[j].selected=true; break;}}
			}
			if(tmp[i].indexOf("NMEA-GSA")>=0){
				v = tmp[i].substring(9);
				//str += "gsa:" + v;
				for(j=0; j<8; j++){if(v==gsa.options[j].text) {gsa.options[j].selected=true; break;}}
			}
			if(tmp[i].indexOf("NMEA-RMC")>=0){
				v = tmp[i].substring(9);
				//str += "rmc:" + v;
				for(j=0; j<8; j++){if(v==rmc.options[j].text) {rmc.options[j].selected=true; break;}}
			}
			if(tmp[i].indexOf("NMEA-VTG")>=0){
				v = tmp[i].substring(9);
				//str += "vtg:" + v;
				for(j=0; j<8; j++){if(v==vtg.options[j].text) {vtg.options[j].selected=true; break;}}
			}
			if(tmp[i].indexOf("NMEA-ZDA")>=0){
				v = tmp[i].substring(9);
				//str += "zda:" + v;
				for(j=0; j<8; j++){if(v==zda.options[j].text) {zda.options[j].selected=true; break;}}
			}
		}
	}
	//document.getElementById("info").innerHTML = str;
	
    //proc TC18
    var best = document.getElementById("bestpos");    var rang = document.getElementById("range");
	var stav = document.getElementById("satvis");    var rcmp = document.getElementById("rangecmp");
	var time = document.getElementById("time");    var psrd = document.getElementById("psrdop");
	var ionu = document.getElementById("ionutc");    var gpsl = document.getElementById("gpsxl");
	var gnss = document.getElementById("gnssxl");    var bdsl = document.getElementById("bdsxl");
	best.options[0].selected=true;	rang.options[0].selected=true;	stav.options[0].selected=true;
	rcmp.options[0].selected=true;	time.options[0].selected=true;	psrd.options[0].selected=true;
	ionu.options[0].selected=true;	gpsl.options[0].selected=true;	gnss.options[0].selected=true;  bdsl.options[0].selected=true;

	if(arr[1].indexOf("TC18-")>=0){
		tmp1 = arr[1].split(",");

		for(i=0; i<tmp1.length; i++){
			if(tmp1[i].indexOf("bestpos")>=0){
				v = tmp1[i].substring(13);
				//str += " bestpos:" + v;
				for(j=0; j<8; j++){if(v==best.options[j].text) {best.options[j].selected=true; break;}}
			}
			if(tmp1[i].indexOf("range")>=0){
				v = tmp1[i].substring(11);
				//str += " range:" + v;
				for(j=0; j<8; j++){if(v==rang.options[j].text) {rang.options[j].selected=true; break;}}
			}
			if(tmp1[i].indexOf("satvis")>=0){
				v = tmp1[i].substring(12);
				//str += " satvis:" + v;
				for(j=0; j<8; j++){if(v==stav.options[j].text) {stav.options[j].selected=true; break;}}
			}
			if(tmp1[i].indexOf("rangecmp")>=0){
				v = tmp1[i].substring(14);
				//str += " rangecmp:" + v;
				for(j=0; j<8; j++){if(v==rcmp.options[j].text) {rcmp.options[j].selected=true; break;}}
			}
			if(tmp1[i].indexOf("time")>=0){
				v = tmp1[i].substring(10);
				//str += " time:" + v;
				for(j=0; j<8; j++){if(v==time.options[j].text) {time.options[j].selected=true; break;}}
			}
			if(tmp1[i].indexOf("psrdop")>=0){
				v = tmp1[i].substring(12);
				//str += " psrdop:" + v;
				for(j=0; j<8; j++){if(v==psrd.options[j].text) {psrd.options[j].selected=true; break;}}
			}
            if(tmp1[i].indexOf("ionutc")>=0){
				v = tmp1[i].substring(12);
				//str += " psrdop:" + v;
				for(j=0; j<8; j++){if(v==psrd.options[j].text) {psrd.options[j].selected=true; break;}}
			}
	        if(tmp1[i].indexOf("gpsephem")>=0){
                if(tmp1[i].indexOf("ONCHANGED")){
                    gpsl.options[1].selected=true;
                }

				//v = tmp1[i].substring(12);
				//str += " gpsxl:" + v;
				//for(j=0; j<2; j++){if(v==gpsl.options[j].text) {gpsl.options[j].selected=true; break;}}
			}
			if(tmp1[i].indexOf("gloephemeirs")>=0){
                if(tmp1[i].indexOf("ONCHANGED")){
                    gnss.options[1].selected=true;
                }

				//v = tmp1[i].substring(15);
				//str += " gnssxl:" + v;
				//for(j=0; j<2; j++){if(v==gnss.options[j].text) {gnss.options[j].selected=true; break;}}
			}
            if(tmp1[i].indexOf("bd2ephem")>=0){
                if(tmp1[i].indexOf("ONCHANGED")){
                    bdsl.options[1].selected=true;
                }

				//v = tmp1[i].substring(11);
				//str += " bdsxl:" + v;
				//for(j=0; j<2; j++){if(v==bdsl.options[j].text) {bdsl.options[j].selected=true; break;}}
			}

		}
	}
	//document.getElementById("info").innerHTML = str;
}

//RTCM 二级联动菜单
function chgVersion()
{     
    var rtcm_ver = new Array();
    rtcm_ver[0] = new Array('24','RTK','web_rtcm24_type1');
    rtcm_ver[1] = new Array('24','DGPS','web_rtcm24_type2');
    rtcm_ver[2] = new Array('24','RTK+DGPS','web_rtcm24_type3');
    rtcm_ver[3] = new Array('24','DGPS9-3','web_rtcm24_type4');  
    rtcm_ver[4] = new Array('31','RTK','web_rtcm32_type1');
    rtcm_ver[5] = new Array('32','RTK','web_rtcm32_type2');

	var s1 = document.getElementById("rtcm.version");    
	var s2 = document.getElementById("rtcm.mode"); 
	s2.length = 0;
	var value = s1.value;
	//document.getElementById("info").innerHTML = value;
	for(i=0; i<rtcm_ver.length; i++)     
	{     
		if(rtcm_ver[i][0]==value) {
			s2.options[s2.length] = new Option(rtcm_ver[i][1], rtcm_ver[i][2]);
		}
	} 
}

function addport()
{
    var str = "";
    var port_num = 0;
    var iop = document.getElementById("ioport");
    var np = document.getElementById("new.port").value;

    for(i=0; i<iop.length-1; i++){//ignore the last option "newPort"
        if(iop.options[i].text.indexOf("TCP")>=0){
            port_num++;
        }
    }

    if(np=="" || np==null){
		alert("Error: Port is Empty!");
		return false;
	}

    if(port_num>=5){
        alert("Error: the number of TCP/IP port is bigger than 5!");
        return false;
    }
    
    if(!isNaN(np)){
		str = "IPSERVICE create " + np +" ";
	}else{
		alert("Error: Port MUST be a Number!");
	    return false;
	}
	
    if(document.getElementById("udp").checked){
		str += "udp@";
	}else{
		str += "tcp@";
    }
    
    window.location.href='/cgi-bin/chn/IO-Proc.cgi?cmd=' + str;
}

function delport()
{
    tp = document.getElementById("tcp.port").value;
    pm = document.getElementById("server.port");
    window.location.href='/cgi-bin/chn/IO-Proc.cgi?cmd=IPSERVICE delete ' + tp +" "+ pm.innerHTML;
}

function iosubmit()
{
	var str = "";
	var p = document.getElementById("ioport");
	var m = document.getElementById("iomode");
	
    var arr = p.value.split("*");
    var arr1 = arr[0].split(" ");
    var tp = arr1[1];

	//str += p.value+" ";
	if(p.value.indexOf("new")>=0){
        var port_num = 0;
        str = "IPSERVICE create ";
		np = document.getElementById("new.port").value;

        for(i=0; i<p.length-1; i++){//ignore the last option "newPort"
            if(p.options[i].text.indexOf("TCP")>=0){
                port_num++;
            }
        }

		if(np=="" || np==null){
			alert("Error: Port is Empty!");
			return false;
		}
        
        if(port_num>=5){
            alert("Error: the number of TCP/IP port is bigger than 5!");
            return false;
        }
        
        if(!isNaN(np)){
			str = str + np + " ";
		}else{
			alert("Error: Port MUST be a Number!");
			return false;
		}
		if(document.getElementById("udp").checked){
		    str += "udp@";
	    }else{
		    str += "tcp@";
        }

        tp = np; //get port number
	}else if(p.value.indexOf("TCP")>=0){
        //str += "Log "+tp+" ";
	}else if(p.value.indexOf("Ntrip")>=0){
		if(document.getElementById("ntrip.ena").checked){
			if(checkNtrip()==false) return false;
			str += "NTRIPCONFIG "+tp+" server " + //(document.getElementById("ntrip.ibss").checked?"ibss ":"") +
			document.getElementById("ntrip.ver").value+" "+document.getElementById("ntrip.http").value+" "+
			document.getElementById("ntrip.mount").value+" "+document.getElementById("ntrip.user").value+" "+
			document.getElementById("ntrip.passwd").value+"@";
		}else{
			str += "NTRIPCONFIG "+tp+" disable@";
		}
	}else if(p.value.indexOf("COM")>=0){
		str += "COM COM1 " + document.getElementById("btl").value+"@";
	}
	
	if(m.value=="RTCM"){
		if(document.getElementById("rtcm.ena").value=="0"){
			str += "unlog "+tp+" web_rtcm@";
		}else{
            str += "Log "+tp+" web_rtcm" + document.getElementById("rtcm.mode").value + "@";
		}
	}else if(m.value=="NMEA"){
        d = document.getElementById("gga");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" GNGGA@";
        }else{
            str += "log "+tp+" GNGGA ontime "+d.value+"@";
        }

        d = document.getElementById("gsv");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" GNGSV@";
        }else{
            str += "log "+tp+" GNGSV ontime "+d.value+"@";
        }

        d = document.getElementById("gsa");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" GNGSA@";
        }else{
            str += "log "+tp+" GNGSA ontime "+d.value+"@";
        }

        d = document.getElementById("rmc");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" GNRMC@";
        }else{
            str += "log "+tp+" GNRMC ontime "+d.value+"@";
        }

        d = document.getElementById("vtg");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" GNVTG@";
        }else{
            str += "log "+tp+" GNVTG ontime "+d.value+"@";
        }

        d = document.getElementById("zda");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" GNZDA@";
        }else{
            str += "log "+tp+" GNZDA ontime "+d.value+"@";
        }
	}else if(m.value=="TC18"){
        d = document.getElementById("bestpos");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" bestposb@";
        }else{
            str += "log "+tp+" bestposb ontime "+d.value+"@";
        }

        d = document.getElementById("range");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" rangeb@";
        }else{
            str += "log "+tp+" rangeb ontime "+d.value+"@";
        }

        d = document.getElementById("satvis");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" satvisb@";
        }else{
            str += "log "+tp+" satvisb ontime "+d.value+"@";
        }

        d = document.getElementById("rangecmp");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" rangecmpb@";
        }else{
            str += "log "+tp+" rangecmpb ontime "+d.value+"@";
        }

        d = document.getElementById("time");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" timeb@";
        }else{
            str += "log "+tp+" timeb ontime "+d.value+"@";
        }

        d = document.getElementById("psrdop");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" psrdopb@";
        }else{
            str += "log "+tp+" psrdopb ontime "+d.value+"@";
        }

        d = document.getElementById("ionutc");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" ionutcb@";
        }else{
            str += "log "+tp+" ionutcb ontime "+d.value+"@";
        }

        d = document.getElementById("gpsxl");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" gpsephemb@";
        }else{
            str += "log "+tp+" gpsephemb "+d.value+"@";
        }

        d = document.getElementById("gnssxl");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" gloephemerisb@";
        }else{
            str += "log "+tp+" gloephemerisb "+d.value+"@";
        }

        d = document.getElementById("bdsxl");
        if(d.options[0].selected==true){
            str += "unlog "+tp+" bd2ephemb@";
        }else{
            str += "log "+tp+" bd2ephemb "+d.value+"@";
        }
	}
	
	//document.getElementById("info").innerHTML = str;
    window.location.href='/cgi-bin/chn/IO-Proc.cgi?cmd=' + str;
}

function checkNtrip() {
	http = document.getElementById("ntrip.http");
	mount = document.getElementById("ntrip.mount");
    uname = document.getElementById("ntrip.user");
    passwd = document.getElementById("ntrip.passwd");
    passwda = document.getElementById("ntrip.passwda");
	if (http.value == '') {
		alert('http address is empty !');
		http.focus();
		return false;
	}
    if (mount.value == '') {
		alert('mount point is empty !');
		mount.focus();
		return false;
	}
    if (uname.value == '') {
		alert('User Name is empty !');
		uname.focus();
		return false;
	}
    if (passwd.value == '') {
		alert('Password is empty !');
		passwd.focus();
		return false;
	}
     if (passwda.value == '') {
		alert('Password is empty !');
		passwda.focus();
		return false;
	}
    if (passwd.value != passwda.value) {
		alert('Two password is different !');
		passwd.focus();
		return false;
	}
   
    return true;
}

/*---------------------------------
 *  ref-station
 *--------------------------------*/
function loadrs()
{
	//window.location.href="/cgi-bin/chn/recv-config.cgi?cmd=loadrs";
	
    check_author();
	xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbGetRSInfo;
        xhr.open("GET", "/cgi-bin/chn/recv-config.cgi?cmd=loadrs");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procRsInfo(Obj)
{
	var rs = Obj.split(",");
	
    var rtcm2 = document.getElementById('rtcm2');
    var rtcm3 = document.getElementById('rtcm3');
    var tsn = document.getElementById('tsname');
    var tsc = document.getElementById('tsc');
    var bx = document.getElementById('bx');
    var by = document.getElementById('by');
    var bz = document.getElementById('bz');

	rtcm2.value = rs[0];
	rtcm3.value = rs[1];
	tsn.value = rs[2];
	tsc.value = rs[3];
	bx.innerHTML = rs[4];
	by.innerHTML = rs[5];
	bz.innerHTML = rs[6];
}

function cbGetRSInfo() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				//document.getElementById("Msg").innerHTML = returnValue;
				procRsInfo(returnValue);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function loadfix()
{
	xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbGetFixInfo;
        xhr.open("GET", "/cgi-bin/chn/recv-config.cgi?cmd=loadrs");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procFixInfo(Obj)
{
	var rs = Obj.split(",");
	
    var bx = document.getElementById('bx');
    var by = document.getElementById('by');
    var bz = document.getElementById('bz');

	bx.innerHTML = rs[4];
	by.innerHTML = rs[5];
	bz.innerHTML = rs[6];
}

function cbGetFixInfo() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				//document.getElementById("Msg").innerHTML = returnValue;
				procFixInfo(returnValue);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function loadllh()
{
	xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbGetLlhInfo;
        xhr.open("GET", "/cgi-bin/chn/recv-config.cgi?cmd=loadllh");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procLlhInfo(Obj)
{
	var rs = Obj.split(",");
	
    var latd = document.getElementById('latd');
    var latf = document.getElementById('latf');
    var latm = document.getElementById('latm');
    var lpn = document.getElementById('latpn');
    var lps = document.getElementById('latps');
    
    var lond = document.getElementById('lond');
    var lonf = document.getElementById('lonf');
    var lonm = document.getElementById('lonm');
    var lpe = document.getElementById('lonpe');
    var lpw = document.getElementById('lonpw');
    var rh = document.getElementById('refhei');

	latd.value = rs[0];
	latf.value = rs[1];
	latm.value = rs[2];
	if(rs[3]=="N"){
		lpn.checked = true;
		lps.checked = false;
	}else{
		lpn.checked = false;
		lps.checked = true;
	}
	
	lond.value = rs[4];
	lonf.value = rs[5];
	lonm.value = rs[6];
	
	if(rs[7]=="E"){
		lpe.checked = true;
		lpw.checked = false;
	}else{
		lpe.checked = false;
		lpw.checked = true;
	}
	rh.value = rs[8];
}

function cbGetLlhInfo() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				//document.getElementById("Msg").innerHTML = returnValue;
				procLlhInfo(returnValue);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function RSsubmit()
{
	var str = "";
	var d = document.getElementById("rtcm2");
    if(d.value==""||isNaN(d.value)){
        alert("Error: rtcm 2.x ID must be a number!");
        d.focus();
        return false;
    }
	str += "SETRTCM2xID "+d.value+"@";

	d = document.getElementById("rtcm3");
    if(d.value==""||isNaN(d.value)){
        alert("Error: rtcm 3.x ID must be a number!");
        d.focus();
        return false;
    }
	str += "SETRTCM3xID "+d.value+"@";
	
    d = document.getElementById("tsname");
    if(!(/^[A-Z]{4}\d{4}$/.test(d.value))){
        alert("测站名请输入4个大写字母+4个数字");
        d.focus();
        return false;
    }
    str += "SETSTATIONNAME "+ d.value + "@";

    d = document.getElementById("tsc");
    str += "SETSTATIONCODE "+ d.value + "@";

    d = document.getElementById("latd");
    v = parseFloat(d.value);
    if(d.value==""||(/[^\d]/.test(d.value))||(v>99)||(v<0)){
        alert("Error: 度的范围是0~99的正整数");
        d.focus();
        return false;
    }
    
    var lat = v;
    
    d = document.getElementById("latf");
    v = parseFloat(d.value);
    if(d.value==""||(/[^\d]/.test(d.value))||(v>60)||(v<0)){
        alert("Error: 分 的范围是0~60的正整数");
        d.focus();
        return false;
    }
    
    lat += v/60.0;
    
    d = document.getElementById("latm");
    v = parseFloat(d.value);
    if(!(/^\d+(\.\d*)?/.test(d.value))||(v>100)||(v<0)){
        alert("Error: 秒的范围是0~100的浮点数");
        d.focus();
        return false;
    }
    
    lat += v/3600.0;
    d = document.getElementById("latps");
    if(d.checked==true)
        str += "fix position -" + lat.toString();
    else
        str += "fix position " + lat.toString();

    d = document.getElementById("lond");
    v = parseFloat(d.value);
    if(d.value==""||(/[^\d]/.test(d.value))||(v>180)||(v<0)){
        alert("Error: 度的范围是0~180的正整数");
        d.focus();
        return false;
    }
    
    var lon = v;

    d = document.getElementById("lonf");
    v = parseInt(d.value);
    if(d.value==""||(/[^\d]/.test(d.value))||(v>60)||(v<0)){
        alert("Error: 分 的范围是0~60的正整数");
        d.focus();
        return false;
    }
    
    lon += v/60.0;
    
    d = document.getElementById("lonm");
    v = parseInt(d.value);
    if(!(/^\d+(\.\d*)?/.test(d.value))||(v>100)||(v<0)){
        alert("Error: 秒的范围是0~100的浮点数");
        d.focus();
        return false;
    }
    
    lon += v/3600.0;
    
    d = document.getElementById("lonpw");
    if(d.checked==true)
        str += " -" + lon.toString();
    else
        str += " " + lon.toString();


    d = document.getElementById("refhei");
    if(!(/^\d+(\.\d*)?/.test(d.value))){//d.value==""||isNaN(d.value)){
        alert("Error: 参考高度必须是合法数字");
        d.focus();
        return false;
    }

    str += " " +d.value + "@";

    //document.getElementById("Msg").innerHTML = str;//"<h1>提交成功</h1>";
    //setTimeout("window.location.href='/cgi-bin/chn/recv-general.cgi'",2000);
    window.location.href='/cgi-bin/chn/recv-config.cgi?sendcmd=' + str;
}
/*======================= track.html ==========================*/
function loadtrack()
{
    check_author();
	xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbLoadTrack;
        xhr.open("GET", "/cgi-bin/chn/recv-config.cgi?cmd=loadtrack");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procLoadTrack(Obj)
{
	var rs = Obj.split(",");
	
    var v1 = document.getElementById('gpsd');
    var v2 = document.getElementById('gnssd');
    var v3 = document.getElementById('bdsd');
    
    v1.value = rs[0];
    v2.value = rs[1];
    v3.value = rs[2];
    
    var v4 = document.getElementById('engps');
    var v5 = document.getElementById('engnss');
    var v6 = document.getElementById('enbds');
    
    v4.checked = (rs[3]=="1")?true:false;
    v5.checked = (rs[4]=="1")?true:false;
    v6.checked = (rs[5]=="1")?true:false;
    
}

function cbLoadTrack() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				//document.getElementById("Msg").innerHTML = returnValue;
				procLoadTrack(returnValue);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function Tracksumbmit()
{
    var coll = document.getElementsByName("heid");
    var vv = 0;
   
	for(var i = 0; i < coll.length; i++){
		vv = parseInt(coll[i].value);
		if(coll[i].value=="" || isNaN(coll[i].value) || (vv>90) || (vv<-10)){
			alert("Error：截止高度角必须在-10到+90度之间！");
			coll[i].focus();
			return false;
		}
	}
	
	var str = "";
	var v1 = document.getElementById('gpsd');
    var v2 = document.getElementById('gnssd');
    var v3 = document.getElementById('bdsd');
    
    str = "ecutoff "+v1.value +"@gloecutoff "+ v2.value +"@bd2ecutoff "+ v3.value+"@";
    
    var v4 = document.getElementById('engps');
    str += (v4.checked?"syscontrol enable GPS@":"syscontrol disable GPS@");
    
    var v5 = document.getElementById('engnss');
    str += (v5.checked?"syscontrol enable GLONASS@":"syscontrol disable GLONASS@");
    
    var v6 = document.getElementById('enbds');
    str += (v6.checked?"syscontrol enable BD2@":"syscontrol disable BD2@");
    
    //document.getElementById("Msg").innerHTML = "Track " + str;
	//setTimeout("window.location.href='/cgi-bin/chn/recv-general.cgi'",2000);
    window.location.href='/cgi-bin/chn/recv-config.cgi?sendcmd=' + str;
}

/*======================= pps-config.html ==========================*/
function loadpps()
{
    check_author();
	xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbLoadPPS;
        xhr.open("GET", "/cgi-bin/chn/recv-config.cgi?cmd=loadpps");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procLoadPPS(Obj)
{
	var rs = Obj.split(",");
	
	var v1 = document.getElementById('extfrq');
    var v2 = document.getElementById('pps1');
    var v3 = document.getElementById('slope');
    
	if(rs[0]=="1") v1.options[1].selected = true; else v1.options[0].selected = true;

    if(rs[1]=="1") v2.options[1].selected = true; else v2.options[0].selected = true;
    
    if(rs[2]=="1") v3.options[1].selected = true; else v3.options[0].selected = true;
    
}

function cbLoadPPS() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				//document.getElementById("Msg").innerHTML = returnValue;
				procLoadPPS(returnValue);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function PPSsubmit()
{
	var str = "";
	var v1 = document.getElementById('extfrq');
    var v2 = document.getElementById('pps1');
    var v3 = document.getElementById('slope');
	
    str += "externalclock "+v1.value +"@ppsconfig GPS "+ v2.value;
    if(v2.value=="disable")
        str += "@";
    else
        str += " "+v3.value+"@";
    
    document.getElementById("Msg").innerHTML = "PPS " + str;
	//setTimeout("window.location.href='/cgi-bin/chn/recv-general.cgi'",2000);
    window.location.href='/cgi-bin/chn/recv-config.cgi?sendcmd=' + str;
}

/*======================= reset.html ==========================*/
function reset(Obj)
{
	if(Obj=='recr-reset'){
		c = confirm("重启接收机?");
		if(c){
			//document.getElementById("Msg").innerHTML = "接收机即将重启";
            window.location.href='/cgi-bin/chn/recv-config.cgi?sendcmd=' + "reset";
		}
	}else{
		c = confirm("清除所有接收机设置?");
		if(c){
			//document.getElementById("Msg").innerHTML = "所有接收机数据即将清除";
            window.location.href='/cgi-bin/chn/recv-config.cgi?sendcmd=' + "freset";
		}
    }
}

/*---------------------------------
 *  sat-enable
 *--------------------------------*/
function enable(Obj)
{
    var coll = document.getElementsByName(Obj);

	for(var i = 0; i < coll.length; i++)
		coll[i].checked = true;
}

function disable(Obj)
{
    var coll = document.getElementsByName(Obj);
    
	for(var i = 0; i < coll.length; i++)
		coll[i].checked = false;
}

function selall(Obj1, Obj2)
{
    enable(Obj1);
    enable(Obj2);
}

function cleanall(Obj1, Obj2)
{
    disable(Obj1);
    disable(Obj2);
}

function satenable_submit(Obj)
{
    var name1 = document.getElementsByName('ena');
    
    var mask = 0;
    var i = 0;
    for(i = 0; i < name1.length; i++){
        if(name1[i].checked==false){
			mask = mask | (1<<i);
        }
    }
    
    window.location.href="/cgi-bin/chn/sat-enable.cgi?sendcmd="+Obj+"@"+mask;
}

function getStatus(Obj)
{
	var uname = getCookie("username");
    var isAdmin = getCookie("isAdmin");

	if(uname == "" || uname==null){
		alert("您还没有登录，请登录!");
		window.parent.location="/index.html";
        return false;
	}

	 if(isAdmin != "1"){
		alert("Authorization Error!");
		window.parent.location="/index.html";
	}
    
    check_exist();
    
	xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbGetStatus;
        xhr.open("GET", "/cgi-bin/chn/sat-enable.cgi?cmd="+Obj);
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procStatus(Obj)
{
    var name1 = document.getElementsByName('ena');

    for(var i = 0; i < name1.length; i++){
		if(Obj & (1<<i)){
			name1[i].checked = false;
        }
    }
}

function cbGetStatus() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				var ret = Number(returnValue);
				//document.getElementById("Msg").innerHTML = "Get GPS mask is " + ret.toString();
				procStatus(ret);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

/*---------------------------------
 *  dl-summary
 *--------------------------------*/
function dl_summary_check() {
	var uname = getCookie("username");
	var isAdmin = getCookie("isAdmin");
	var enas;
	if(uname == "" || uname==null){
		alert("您还没有登录，请登录!");
		window.parent.location="/index.html";
	}
	
	if(isAdmin=="0"){
		enas = document.getElementsByName("sena");
		for(var i = 0; i < enas.length; i++){
			enas[i].disabled = true;
		}
		
		enas = document.getElementsByName("ahref");
		for(var i = 0; i < enas.length; i++){
			enas[i].href = "javascript:void(0);";
			enas[i].setAttribute("disabled", "disabled");
		}
	}

    check_exist();

}

function autodel(Obj)
{
    var ena = document.getElementById(Obj);
     if(ena.checked==true){
        c = confirm("Enable Auto Delete?");
        if(!c) {
            ena.checked = false;
        }else{
            window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=AutoDel "+Obj+" enable";
        }
    }else{
        c = confirm("Disable Auto Delete?");
        if(!c) {
            ena.checked = true;
        }else{
            window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=AutoDel "+Obj+" disable";
        }
    }
}

function format(Obj)
{
    c = confirm("Are you sure to Format disk "+Obj+"?");
    if(c) {
        window.location.href="/cgi-bin/chn/datalog_proc.cgi?cmd=Format " + Obj;
    }
}

function enaRec(Obj1)
{
    var ena = document.getElementById(Obj1);

    if(ena.checked==true){
        c = confirm("Enable this record?");
        if(!c) {
            ena.checked = false;
        }else{
            //document.getElementById("Msg").innerHTML = "appfile 1 " + ena.value;
            window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=appfile start " + ena.value;
        }
    }else{
        c = confirm("Disable this record?");
        if(!c) {
            ena.checked = true;
        }else{
            //document.getElementById("Msg").innerHTML = "appfile 0 " + ena.value;
            var arr = ena.value.split(" ");
            window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=appfile stop " + arr[0];
        }
    }
}

/*---------------------------------
 *  dl-config
 *--------------------------------*/
function deldl()
{
	var name = document.getElementById("sname").innerHTML;
    var path = document.getElementById("sen").value;

	c = confirm("Delet datalog "+name);
	if(c){
		//document.getElementById("Msg").innerHTML = "Datalog "+name+" will be deleted!";
        window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=appfile delete " + path;
	}
}

function dl_config_submit()
{
	var str = "";
    var enable = document.getElementById("sen");
    str += enable.checked?"start ":"stop ";
    str += document.getElementById("sname").innerHTML;

    if(enable.checked){
        str += " "+document.getElementById("workmode").value;
	    str += " "+document.getElementById("filelen").value;
	    str += " "+document.getElementById("clt").value;
	    str += " "+document.getElementById("pot").value;
	    //str += ","+document.getElementById("fs").value;
	    //str += ","+document.getElementById("namestyle").value;
	}
    //document.getElementById("Msg").innerHTML = "Modified_datalog "+str;
    window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=appfile " + str;
}

/*---------------------------------
 *  new-dl
 *--------------------------------*/
/*
function new_dl_submit()
{
	var name = document.getElementById("stn").value;
	if(!(/^[A-Z]{8}$/.test(name))){
		alert("时段名称请输入8个大写字母");
		return false;
	}
	var str = document.getElementById('sen').checked?"start ":"stop ";
    str += name;
    str += " "+document.getElementById('workmode').value;
	str += " "+document.getElementById('filelen').value;
	str += " "+document.getElementById('clt').value;
	str += " "+document.getElementById('pot').value;
	//str += ","+document.getElementById('fs').value;
	//str += ","+document.getElementById('namestyle').value;
	
    //document.getElementById("Msg").innerHTML = "Add_datalog "+str;
    window.location.href="/cgi-bin/chn/datalog_proc.cgi?sendcmd=appfile " + str;
}
*/

/*---------------------------------
 *  user-manager
 *--------------------------------*/
function deluser(delname) {
	var uname = getCookie("username");
	var c = confirm("Are you sure to Delete User "+delname+"?");
	if (c) {
		window.location.href="/cgi-bin/chn/user-manager.cgi?deluser="+delname;
        //document.getElementById("delMsg").innerHTML = "/cgi-bin/chn/user-manager.cgi?deluser="+delname;
        if (delname==uname){
            alert("Your Counter was deleted by Administrator!");
	        document.cookie="username=;path=/";
	        document.cookie="isAdmin=;path=/";
		    window.parent.location="/index.html";
        }
	}
}

function addanony() {
    window.location.href="/cgi-bin/chn/user-manager.cgi?adduser=Anonymous&addpasswd=xxx&isAdmin=No";
}
function adduser() {
    uname = document.getElementById("add-name").value;
    passwd = document.getElementById("add-passwd").value;
    passwdag = document.getElementById("add-passwd-again").value;
    isadmin = document.getElementById("isAdmin").value;

    if (uname == '') {
		alert('User Name is empty !');
		document.getElementById("add-name").focus();
		return false;
	}
    if (passwd == '') {
		alert('Password is empty !');
		document.getElementById("add-passwd").focus();
		return false;
	}
     if (passwdag == '') {
		alert('Password is empty !');
		document.getElementById("add-passwd-again").focus();
		return false;
	}
    if (passwd != passwdag) {
		alert('Two password is different !');
		document.getElementById("add-passwd").focus();
		return false;
	}
    window.location.href="/cgi-bin/chn/user-manager.cgi?adduser="+uname+"&addpasswd="+passwd+"&isAdmin="+isadmin;
    //document.getElementById("addMsg").innerHTML = "/cgi-bin/chn/user-manager.cgi?adduser="+uname+"&addpasswd="+passwd+"&isAdmin="+isadmin;

    return true;
}

/*---------------------------------
 *  eth-config
 *--------------------------------*/
function load_eth(){
    check_author();
    xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbGetEthInfo;
        xhr.open("GET", "/cgi-bin/chn/Net-Proc.cgi?cmd=loadeth");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function procEthInfo(Obj)
{
	var src = Obj.split(",");
	var ipmode = document.getElementById("ipmode");
    var ipcol = document.getElementsByName("ip");
    var hostname = document.getElementById("hostname");
    
    //DHCP or Static
    if(src[0]=="1"){
        ipmode.options[1].selected = true;
        for(var i = 0; i < ipcol.length; i++){
            ipcol[i].disabled = true;
        }
        hostname.disabled = true;
    }

    //IP address
    if(src[1]==""||src[1]==null||src[1]==" "){
        ipcol[0].value = "0"; ipcol[1].value = "0";
        ipcol[2].value = "0"; ipcol[3].value = "0";
    }else{
    var ipaddr = src[1].split(".");
    ipcol[0].value = ipaddr[0]; ipcol[1].value = ipaddr[1];
    ipcol[2].value = ipaddr[2]; ipcol[3].value = ipaddr[3];
    }
    //Net Gate Way
    if(src[2]==""||src[2]==null||src[2]==" "){
        ipcol[4].value = "0"; ipcol[5].value = "0";
        ipcol[6].value = "0"; ipcol[7].value = "0";
    }else{
    ipaddr = src[2].split(".");
    ipcol[4].value = ipaddr[0]; ipcol[5].value = ipaddr[1];
    ipcol[6].value = ipaddr[2]; ipcol[7].value = ipaddr[3];
    }
    //Net MASK
    if(src[3]==""||src[3]==null||src[3]==" "){
        ipcol[8].value = "255"; ipcol[9].value = "255";
        ipcol[10].value = "255"; ipcol[11].value = "255";
    }else{
    ipaddr = src[3].split(".");
    ipcol[8].value = ipaddr[0]; ipcol[9].value = ipaddr[1];
    ipcol[10].value = ipaddr[2];    ipcol[11].value = ipaddr[3];
    }
    //Host name
    hostname.value = src[4];
}

function cbGetEthInfo() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				//document.getElementById("Msg").innerHTML = returnValue;
				procEthInfo(returnValue);
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function chgIpMode(){
    var said = document.getElementById("ipmode");
    var coll = document.getElementsByName("ip");
    var hostname = document.getElementById("hostname");
    if (said.value=="dhcp"){
        for(var i = 0; i < coll.length; i++){
            coll[i].disabled = true;
        }
        hostname.disabled = true;
    }else{
        for(var i = 0; i < coll.length; i++){
            coll[i].disabled = false;
        }
        hostname.disabled = false;
    }
}

function eth_submit(){
    var said = document.getElementById("ipmode");
    var coll = document.getElementsByName("ip");
    var hostname = document.getElementById("hostname");
    var str = "";

    if (said.value=="static"){
        for(var i = 0; i < coll.length; i++){
            vv = parseInt(coll[i].value);
            if(coll[i].value=="" || (/[^\d]/.test(coll[i].value)) || (vv>255) || (vv<0)){
                alert("Error: Must a INT Number 0~255");
                coll[i].focus();
                return false;
            }
        }
        
        str += "NETCONFIG STATIC "+coll[0].value+"."+coll[1].value+"."+coll[2].value+"."+coll[3].value+"::"+coll[4].value+"."+coll[5].value+"."+coll[6].value+"."+coll[7].value+":"+coll[8].value+"."+coll[9].value+"."+coll[10].value+"."+coll[11].value+":"+hostname.value+":eth0";
        
    }else{
        str += "NETCONFIG DHCP";
    }
    
    window.location.href="/cgi-bin/chn/Net-Proc.cgi?sendcmd="+str+"@";
}

function ftp_submit()
{
    var ftp_ena =  document.getElementById("ftp-en");
    var str = "";

    if(ftp_ena.checked==true){
        str += "FTPCONFIG enable";
    }else{
        str += "FTPCONFIG disable";
    }
    
    window.location.href="/cgi-bin/chn/Net-Proc.cgi?sendcmd="+str+"@";
}
/*---------------------------------
 *  showdir
 *--------------------------------*/

function selall(Obj)
{
    var said = document.getElementById("sa");
    var coll = document.getElementsByName(Obj);
    if (said.checked){
        for(var i = 0; i < coll.length; i++)
            coll[i].checked = true;
    }else{
        for(var i = 0; i < coll.length; i++)
            coll[i].checked = false;
    }
}

function del(Obj, dir)
{
    var coll = document.getElementsByName(Obj);
    var str = '';
    for(var i = 0; i < coll.length; i++){
        if(coll[i].checked){
            str += coll[i].value + ',';
        }
    }
    if(str==''){
         alert("No file Selected!");
    }else{
         window.location.href="/cgi-bin/chn/delete.cgi?dir=" + dir + "&files=" + str;
    }
}

/*---------------------------------
 *  upfirmware
 *--------------------------------*/
function load_fwver(){
    check_author();
    xhr = createXHR();
    if(xhr) {
        xhr.onreadystatechange=cbGetFWVerInfo;
        xhr.open("GET", "/cgi-bin/chn/Net-Proc.cgi?cmd=loadfwver");
        xhr.send(null);
    } else {
        alert("The browsing is not support ajax, please change another!");
    }
}

function cbGetFWVerInfo() {
    if (xhr.readyState == 4) {
        if (xhr.status == 200) {
            var returnValue = xhr.responseText;
            if(returnValue != null && returnValue.length > 0) {
				document.getElementById("fwver").innerHTML = returnValue;
            }
        } else {
            alert("Page Exception!");
        }
    }
}

function fw_submit(){
    var fid = document.getElementById("file");
    if(fid.value==""){
        alert("please select firmware update file!");
        fid.focus();
    }else{
        document.getElementById("form1").submit();
    }
}
/*---------------------------------
 *  menu
 *--------------------------------*/

function MenuSwitch(className){		
	this._elements = [];
	this._default = -1;
	this._className = className;
	this._previous = false;
}

MenuSwitch.prototype.setDefault = function(id){
	this._default = Number(id);
}

MenuSwitch.prototype.setPrevious = function(flag){
	this._previous = Boolean(flag);
}

MenuSwitch.prototype.collectElementbyClass = function(){
	this._elements = [];
	var allelements = document.getElementsByTagName("div");
	for(var i=0;i<allelements.length;i++){
		var mItem = allelements[i];
		if (typeof mItem.className == "string" && mItem.className == this._className){
			var h3s = mItem.getElementsByTagName("h3");
			var uls = mItem.getElementsByTagName("ul");
			if(h3s.length == 1 && uls.length == 1){
				h3s[0].style.cursor = "hand";					
				if(this._default == this._elements.length){
					uls[0].style.display = "block";	
				}else{
					uls[0].style.display = "none";	
				}
				this._elements[this._elements.length] = mItem;
			}				
		}
	}
}

MenuSwitch.prototype.open = function(mElement){
	var uls = mElement.getElementsByTagName("ul");
	uls[0].style.display = "block";
}

MenuSwitch.prototype.close = function(mElement){
	var uls = mElement.getElementsByTagName("ul");
	uls[0].style.display = "none";
}

MenuSwitch.prototype.isOpen = function(mElement){
	var uls = mElement.getElementsByTagName("ul");
	return uls[0].style.display == "block";
}

MenuSwitch.prototype.toggledisplay = function(header){
	var mItem;
	if(window.addEventListener){
		mItem = header.parentNode;
	}else{
		mItem = header.parentElement;
	}
	if(this.isOpen(mItem)){
		this.close(mItem);
	}else{
		this.open(mItem);
	}		
    if(!this._previous){
		for(var i=0;i<this._elements.length;i++){
			if(this._elements[i] != mItem){				
				var uls = this._elements[i].getElementsByTagName("ul");
				uls[0].style.display = "none";		
			}
		}
	}
}	

MenuSwitch.prototype.init = function(){		
	var instance = this;
	this.collectElementbyClass();
	if(this._elements.length==0){
		return;
	}
	for(var i=0;i<this._elements.length;i++){
		var h3s = this._elements[i].getElementsByTagName("h3");		
		if(window.addEventListener){
			h3s[0].addEventListener("click",function(){instance.toggledisplay(this);},false);
		}else{
			h3s[0].onclick = function(){instance.toggledisplay(this);}
		}
	}
}

