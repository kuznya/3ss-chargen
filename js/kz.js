function print(s)   { document.write(s+'<br/>\n'); }
function write(s)   { document.write(s); }
function writeln(s) { document.write(s+'\n'); }

function hash_copy(a)
{
    var r = {};
    for (k in a)
    {
        if (a.hasOwnProperty(k))
        { r[k] = a[k]; }  
    }
    return r;
}

function hash_toString(a)
{
    var s = '';
    var aa = hash_copy(a);
    for (k in aa)
    {
        s += aa[k]+', ';
    }
    return s;
}