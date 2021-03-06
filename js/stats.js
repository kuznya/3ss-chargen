//==============================================================================
// Stats object
//==============================================================================

//--------------------------------------------------------------
// operate Interface
//--------------------------------------------------------------

//--------------------------------------------------------------
var setStatChk  = function (stat,value)
{
    var a=hash_copy(this.stats);
    //alert(hash_toString(a));
    a[stat]=value;
    var sum = 0;
    for (k in a)
    {
        var v = a[k];

        if (k==='F')
        {
            sum += v;
            continue;
        }

        // non F
        if (!this.statCosts[k].hasOwnProperty(v))
        {
            return -1;
        }
        sum += this.statCosts[k][v];
    }
    return (this.stat_pointsMax-sum);
}

//--------------------------------------------------------------
var setStat     = function (stat,value)
{
    var points = this.setStatChk(stat,value);
    if (points>=0)
    {
        this.stats[stat]=value;
        this.stat_points = points;
    }
}

//--------------------------------------------------------------
var setRace = function(race,isDraw)
{
    // stats
    if ( !(race in this.racesData) ) return;
    var o = this.racesData[race];
    this.race = race;
    this.statCosts  = o.statCosts;
    this.stats      = hash_copy(o.stats);
    this.stats.F    = 0;
    this.stat_points =
        this.stat_pointsMax = o.points;

    // skills
    this.skill_points = this.skill_pointsMax;
}

//--------------------------------------------------------------
// put Interface
//--------------------------------------------------------------

//--------------------------------------------------------------
var putHeader   = function(txt) { writeln('<tr id=\'h\'><td>'+txt); }


//--------------------------------------------------------------
var putRadio   = function(name,id,txt)
{
    var e_id = name+'_'+id;
    var s = '<input type="radio" name="'+name+'" id="'+e_id+'" value="1" onchange="procButton(this);"/><label for="'+e_id+'"/>'+txt+'</label>';
    writeln(s);
}

//--------------------------------------------------------------
var putRow      = function(value,txt,id)
{
    writeln('<tr>');
    writeln('<td>'+txt);
    writeln(
        '<td'+
        ( (id!==undefined)?' id=\''+id+'\'':'')+
        '>'+value
    );
}

//--------------------------------------------------------------
var putButton   = function(id,label)
{
    var s = '<button id="btn_'+id+'" onClick="procButton(this);">'+label+'</button>';
    writeln(s);
}

//--------------------------------------------------------------
var putCheckBox = function(id)
{
    var s = '<input type="checkbox" id="chk_'+id+'" value="'+id+'" onClick="procButton(this);"/>';
    writeln(s);
}

//--------------------------------------------------------------
var putRaces   = function()
{
    writeln('<tr id="row_race"><td>&nbsp;<td>');
    for (k in this.racesData)
    {
        //alert(k);
        var o = this.racesData[k];
        this.putRadio('race',k,o.name);
    }
}

//--------------------------------------------------------------
var drawRaces   = function()
{
    var id = 'race_'+this.race;
    $('input[name="race"]').prop('checked', false);
    $('#'+id).attr('checked', 'checked');
}


//--------------------------------------------------------------
var putStatRow  = function(stat,stat_txt)
{
    writeln('<tr>');
    writeln('<td>'+stat_txt);
    writeln('<td>');
    for (var i=this.min; i<=this.max; i++)
    {
        this.putButton(''+stat+i,i);
    }
}

//--------------------------------------------------------------
var putBool = function(stat,stat_txt)
{
    writeln('<tr>');
    writeln('<td>'+stat_txt);
    writeln('<td>');
    this.putButton(stat+'0','off');
    this.putButton(stat+'1','on');
}

//--------------------------------------------------------------
var putSkillBox = function(sk)
{
    writeln('<tr id="row_sk'+sk+'"><td>&nbsp;');
    writeln('<td><label id="label_sk'+sk+'" for="chk_sk'+sk+'">');
    this.putCheckBox('sk'+sk);
    writeln('&diams;</label>');
}

//--------------------------------------------------------------
var putSkillItem = function(si)
{
    var o = this.skillsData[si];
    var s = '<span id="item_sk'+si+'">'+o.name+' ('+o.req+')</span>';
    writeln(s);
}

//--------------------------------------------------------------
var putSkill = function(sk)
{
    this.putSkillBox(sk);
    this.putSkillItem(sk);
}

//--------------------------------------------------------------
var putAll      = function()
{
    writeln('<table>');
    this.putHeader('race');
    this.putRaces();

    this.putHeader('stats');

    this.putStatRow('S','Str');
    this.putStatRow('D','Dex');
    this.putStatRow('I','Int');

    this.putBool   ('F','weap.focus');

    this.putRow(this.stat_points,'free points','stat_points');
    this.putRow('---','stats','s_stats');
    writeln('</table>');

    //this.putRow('','&nbsp;');

    writeln('<br/>');
    writeln('<table>');
    this.putHeader('skills');

    this.putSkill    ('S');

    this.putSkillBox ('A');
    this.putSkillItem('A1');
    writeln(',')
    this.putSkillItem('A2');

    this.putSkill    ('L');
    this.putSkill    ('T');

    this.putRow(this.skill_points,'free points','skill_points');
    writeln('</table>');

}


//--------------------------------------------------------------
// redraw Interface
//--------------------------------------------------------------

//--------------------------------------------------------------
var setButton   = function(id,b)
{
    var o = $('#btn_'+id);
    o.removeClass();
    if (b==='disabled')
    { o.prop('disabled',true); }
    else
    {
        o.prop('disabled',false);
        if (b) { o.addClass('on'); }
    }
}

//--------------------------------------------------------------
var drawStatRow = function(stat)
{
    var value = this.stats[stat];
    var limits = (stat=='F') ? [0,1] : [this.min,this.max];
    // [4,6] for SDI
    // [0,1] for F
    for (var i=limits[0]; i<= limits[1]; i++)
    {
        var points = this.setStatChk(stat,i);
        //alert(points);
        var id = ''+stat+i;
        var b = ((points>=0) ? (i==value) : 'disabled');
        setButton(id,b);
    }
}

//--------------------------------------------------------------
var countSkillPoints = function()
{
    var cnt = 0;
    for (k in this.skills)
    {
        var b = $('#chk_sk'+k).is(':checked');
        if (b) cnt++;
        this.skills[k] = b ? 1:0;
    }
    //alert(cnt);
    this.skill_points = this.skill_pointsMax-cnt;
}


//--------------------------------------------------------------
var drawSkillBox = function(sk)
{
    var points = this.skill_points;
    var checked = $('#chk_sk'+sk).is(':checked');

    $('#row_sk'+sk).removeClass();
    $('#label_sk'+sk).removeClass();
    $('#chk_sk'+sk).attr("disabled", false);
    if (checked)
    {   // checked
        $('#label_sk'+sk).addClass('itemOn');
    }
    else if (!points)
    {   // disabled
        $('#row_sk'+sk).addClass('disabled');
        $('#label_sk'+sk).addClass('disabled');
        $('#chk_sk'+sk).attr("disabled", true);
    }
}

//--------------------------------------------------------------
var drawSkillItem = function(si)
{
    var points = this.skill_points;
    var sk = si.substr(0,1);
    var checked = $('#chk_sk'+sk).is(':checked');
    var req = this.skillsData[si].req;
    var statOk  = this.stats[req] >= 5;
    var o = $('#item_sk'+si);
    o.removeClass();
    if (!statOk) return;
    if (checked)
    { o.addClass('itemOn'); }
    else if (points)
    { o.addClass('itemReady'); }
}

//--------------------------------------------------------------
var drawAll   = function()
{
    // races
    this.drawRaces();

    // stats
    var r = this.stats
    for (k in r)
    {
        this.drawStatRow(k);
    }
    //alert(this.stat_points);
    $('#stat_points').html(this.stat_points);
    var s = ''+r.S+r.D+r.I;
    s += r.F ? ' +': '';

    $('#s_stats').html(s);

    // skills
    this.countSkillPoints();
    for(k in this.skills)
    {
        this.drawSkillBox(k);
    }

    for(k in this.skillsData)
    {
        this.drawSkillItem(k);
    }

    $('#skill_points').html(this.skill_points);
}


//--------------------------------------------------------------
// constructor
//--------------------------------------------------------------
function Stats()
{
    this.racesData =
        {
            human :
                {
                    name   : 'human',
                    size   : 0,
                    statCosts :
                        {
                            S:{4:0,5:1,6:3},
                            D:{4:0,5:1,6:3},
                            I:{4:0,5:1,6:3},
                        },
                    stats  : {S:4,D:4,I:4},
                    points : 3,
                },

            elf :
                {
                    name   : 'elf',
                    size   : 0,
                    statCosts :
                        {
                            S:{4:0,5:1,6:3},
                            D:{5:0,6:1},
                            I:{4:0,5:1,6:3},
                        },
                    stats  : {S:4,D:5,I:4},
                    points : 2,
                },

            orc :
                {
                    name   : 'orc',
                    size   : 0,
                    statCosts :
                        {
                            S:{5:0,6:1},
                            D:{4:0,5:1,6:3},
                            I:{4:0,5:1,6:3},
                        },
                    stats  : {S:5,D:4,I:4},
                    points : 2,
                },

            /*
             goblin :
             {
             name   : 'goblin',
             size   : -1,
             statCosts :
             {
             S:{3:0,4:1},
             D:{5:0,6:1},
             I:{4:0,5:1,6:3},
             },
             stats  : {S:3,D:5,I:4},
             points : 2,
             },
             */
        }
    this.skillsData =
        {
            S : {name:'Stealth',req:'D'},
            A1: {name:'Athletics',req:'S'},
            A2: {name:'Acrobatics',req:'D'},
            L : {name:'Lore',req:'I'},
            T : {name:'Talk',req:'I'},
        };
    this.min = 4;
    this.max = 6;
    this.race = ''
    this.statCosts = {};
    this.stat_pointsMax = 0;
    this.skill_pointsMax = 2;

    this.stats = {};
    this.stat_points    = 0;
    this.skill_points   = 0;

    this.skills         = {S:0,A:0,L:0,T:0};


    this.putHeader      = putHeader;
    this.putRow         = putRow;
    this.putButton      = putButton;
    this.putRadio       = putRadio;
    this.putCheckBox    = putCheckBox;
    this.putBool        = putBool;

    // race
    this.setRace        = setRace;
    this.putRaces       = putRaces;
    this.drawRaces      = drawRaces;

    // stats
    this.setStatChk     = setStatChk;
    this.setStat        = setStat;
    this.putStatRow     = putStatRow;
    this.drawStatRow    = drawStatRow;

    // skills
    this.putSkillBox    = putSkillBox;
    this.putSkillItem   = putSkillItem;
    this.putSkill       = putSkill;
    this.countSkillPoints=countSkillPoints;
    this.drawSkillBox   = drawSkillBox;
    this.drawSkillItem  = drawSkillItem;

    // main
    this.putAll         = putAll;
    this.drawAll        = drawAll;

    // init
    this.setRace('human');
    this.drawRaces();
    this.putAll();
    this.drawAll();
}

