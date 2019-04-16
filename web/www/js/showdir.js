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
         window.location.href="/cgi-bin/delete.cgi?dir=" + dir + "&files=" + str;
    }
}


