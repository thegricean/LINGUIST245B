// created by jdegen on 01/13/2013

var nTargets = 4;//shuffle([4,16])[0]; // experimental variable 1
var nTargetWord = "four";
if (nTargets == 16) { nTargetWord = "sixteen"; }
var size = [nTargets];
var qud = "is-all";//shuffle(["is-all","is-any"])[0]; // experimental variable 2
var utterances = shuffle(["some","all",nTargetWord,"none"]);
var sizes = utterances.length;
var speaker = shuffle(["Dan","Ann"])[0];//,"Ann","Mike","Dan","Chris","Liz","Jack","Ben","Zoe","Lee","Kim"];
var speakervars = getSpeakerVars(speaker);
var relative = speakervars[0]; 
var pronoun = speakervars[1];
var posspron = speakervars[2];
var relpronoun = speakervars[3]; 
var relposs = speakervars[4]; 
var spouse = speakervars[5];
//console.log("spouse:");
var comb = posspron+" "+spouse;
var datpron = speakervars[6];
var reldat = speakervars[7];
var compQSeen = 0;
var qudQSeen = 0;
var initcolors = shuffle([{color:"#0066FF",colorword:"blue"},{color:"#E60000",colorword:"red"},{color:"#00CC00",colorword:"green"},{color:"#FF9147",colorword:"orange"}]);
var targetColors = [];
for (i = 0;i < nTargets; i+=1) {
	if (i%4 == 0) { initcolors = shuffle(initcolors); }
	j = i%4;
	targetColors.push(initcolors[j]['color']);
}
var trialnum = 1;

var nSlides = 1+2+1+1+1; // instructions slide plus two context slides plus compquestion slide plus target slide plus questionnaire

//////// some functions /////////////
function getDesc(desc,speaker,nTargets,relative,pronoun,posspron,relpronoun,spouse,relposs,qud,comb) {
	var txt = "";
	switch(desc) {
		case "desc1":
			switch(qud) {
				case "is-all": txt = speaker+" is really into collecting marbles. Recently, "+posspron+" friends gave "+datpron+" a special edition of "+nTargets.toString()+" marbles, which "+pronoun+" loves. Yesterday, "+posspron+" five-year-old "+relative+" came to visit and found "+posspron+" set of marbles in a drawer. "+caps(relpronoun)+" also found some shoe boxes. "+caps(relpronoun)+" played with the marbles for a long time and moved them from one box to another until they were all hidden and "+relpronoun+" did not remember where "+relpronoun+" put them."; 
				break;
				case "is-any": txt = speaker+"'s five-year-old "+relative+" loves playing with marbles. For when "+relpronoun+" comes to visit, "+speaker+" keeps a set of "+nTargets.toString()+" marbles in a drawer. Yesterday, "+relpronoun+" came to visit and found "+posspron+" marbles in the drawer. "+caps(relpronoun)+" also found some shoe boxes. "+caps(relpronoun)+" played with the marbles for a long time and moved them from one box to another until they were all hidden and "+relpronoun+" did not remember where "+relpronoun+" put them.";
				break;
			}
		break;
		case "desc2":
			switch(qud) {
				case "is-all": txt = "When "+speaker+" later entered the room, "+pronoun+" saw that all the marbles were gone and there was a pile of shoe boxes on the floor. "+caps(pronoun)+" was upset and complained bitterly to "+comb+". "+caps(pronoun)+" was determined to find every last one of "+posspron+" marbles. "+caps(pronoun)+" started opening one box after another, looking for marbles.";
				break;
				case "is-any": txt = "When "+speaker+" later entered the room, "+pronoun+" saw that all the marbles were gone and there was a pile of shoe boxes on the floor. "+caps(posspron)+" "+relative+" was upset because "+relpronoun+" wanted a marble to play with. "+caps(relpronoun)+" started to cry and "+speaker+"'s "+spouse+" tried to console "+reldat+" while "+speaker+" started opening one box after another, looking for marbles.";
				break;
			}
		break;
	}			
	return txt;	
}

function getSpeakerVars(s) {
	var spvars = [];
	switch(s) {
		case "Dan": spvars = ["niece","he","his","she","her","wife","him","her"];
		break;
		case "Ann": spvars = ["nephew","she","her","he","his","husband","her","him"];				
		break;
		}
	return spvars;
}

function caps(a) {return a.substring(0,1).toUpperCase() + a.substring(1,a.length);}
function showSlide(id) { $(".slide").hide(); $("#"+id).show(); }
function shuffle(v) { newarray = v.slice(0);for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);return newarray;} // non-destructive.
function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  };
  return arr;
}
function uniform(a, b) { return ( (Math.random()*(b-a))+a ); }

function factor(n) {
	var minFactor = leastFactor(n);
	if (n==minFactor) return ""+n;
	return minFactor+"*"+factor(n/minFactor);
}

function leastFactor(n) {
	if (n==0) return 0;
	if (n==1) return 1;
	if (n%2 == 0) return 2;
	if (n%3 == 0) return 3;	
	if (n%5 == 0) return 5;	
	return "you need that extra code after all";	
}	

//sample a random point (p.x, p.y) inside a half-circle with center at (center.x, center.y) and radius r
function sampleMarblePosition(center, numP, row, col) {
	var factorized = factor(numP);
	factorArray = factorized.split("*");
	var xadjust = 0;
	var yadjust = 0;
	xadjust = (120-col*10)/col;
	yadjust = (95-row*10)/row;	
	return {x: center.x + Math.random()*xadjust, y: center.y + Math.random()*yadjust, xtest: center.x, ytest: center.y};
}

function getPointLocations(n) {
	var initpointlocations = [];
	var rows = 0;
	var columns = 0;
	switch (n) {
		case 1: initpointlocations = [{x:15,y:15}]; rows = 1; columns = 1;
		break;
		case 2: initpointlocations = [{x:15,y:15},{x:75,y:15}]; rows = 1; columns = 2;
		break;
		case 3:
			initpointlocations = [{x:15,y:15},{x:55,y:15},{x:95,y:15}]; rows = 1; columns = 3;
			break;
		case 4:
			initpointlocations = [{x:15,y:15},{x:75,y:15},{x:15,y:60},{x:75,y:60}]; rows = 2; columns = 2;
			break;
		case 8:
			initpointlocations = [{x:15,y:15},{x:60,y:15},{x:105,y:15},{x:15,y:50},{x:60,y:50},{x:105,y:50},{x:15,y:85},{x:75,y:85}]; rows = 3; columns = 3;
			break;
		case 12:
			initpointlocations = [{x:15,y:15},{x:47.5,y:15},{x:80,y:15},{x:112.5,y:15},{x:15,y:50},{x:47.5,y:50},{x:80,y:50},{x:112.5,y:50},{x:15,y:85},{x:47.5,y:85},{x:80,y:85},{x:112.5,y:85}]; rows = 3; columns = 4;
			break;
		case 16:
			initpointlocations = [{x:15,y:15},{x:47.5,y:15},{x:80,y:15},{x:112.5,y:15},{x:15,y:40},{x:47.5,y:40},{x:80,y:40},{x:112.5,y:40},{x:15,y:65},{x:47.5,y:65},{x:80,y:65},{x:112.5,y:65},{x:15,y:90},{x:47.5,y:90},{x:80,y:90},{x:112.5,y:90}]; rows = 4; columns = 4;
			break;
	}
	return [initpointlocations,rows,columns];
}
function getPoints(numPoints) {
	var points = [];
	var testpoints = [];
	var initpointlocationArray = getPointLocations(numPoints);
	var initpointlocations = initpointlocationArray[0];
	var nrows = initpointlocationArray[1];	
	var ncolumns = initpointlocationArray[2];		
	var pointcolors = targetColors;
	var points = [];
	for (var i=0; i < numPoints; i++) {
		samp = sampleMarblePosition(initpointlocations[i],numPoints,nrows,ncolumns);
		points[i] = {x:samp.x,y:samp.y,color:pointcolors[i]};
		testpoints[i] = {x:samp.xtest,y:samp.ytest,color:"black"}
	}
	return [points,testpoints];
}

function draw(id,size){
  var numBluePoints = 0;
  var canvas = document.getElementById(id);
  if (canvas.getContext){
   	var ctx = canvas.getContext("2d");
   	canvas.width = 150;
   	canvas.height = 120;    	

	//paint the box
    var x = 2;//canvas.width;
    var y = 2;//canvas.height;
    var radius = canvas.height/2 + 9;
    var startAngle = 1.05 * Math.PI;
    var endAngle = 1.95 * Math.PI;
    var counterClockwise = true;
    ctx.beginPath();
    ctx.rect(x, y, 146, 116);
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = 'black';
    ctx.stroke();

	//paint the marbles
	pointss = getPoints(size[numBluePoints]); 
	var points = pointss[0];
	var tpoints = pointss[1];	
	for (var i=0; i < points.length; i++) {
		ctx.beginPath();
	    ctx.arc(points[i].x, points[i].y, 9, 0, 2*Math.PI, counterClockwise);
	    ctx.fillStyle = points[i].color;
		ctx.closePath();
		ctx.fill();
	}
  }
}


// start experiment
$(document).ready(function() {
  showSlide("consent");
  $("#mustaccept").hide();
});


// experiment specification
var experiment = {
  data: {
         windowWidth:window.innerWidth,
         windowHeight:window.innerHeight,
         browser: BrowserDetect.browser,
         totalmarbles: nTargets,
         utterances: utterances,
         qud: qud,
         speaker: speaker,  
         compQInfo:[],       
         trialInfo:[]},         
         
  instructions: function() {
    if (turk.previewMode) {
      $("#instructions #mustaccept").show();
    } else {
    	
      showSlide("instructions");
    	$('.bar').css('width', ( (100/nSlides) + "%")); 
	    $("#bowlinstructions").html("<p class='block-text'>In this experiment, you will read a short story and answer questions about it. <b>Please read the story carefully</b>.<p>Click 'Begin' when you're ready to start.</p>"); 
	    trialnum += 1;   	     
      	$("#begin").click(function() { experiment.context1(); })
    }
  },
  
  context1: function() {
    $('.bar').css('width', ( (100*(trialnum)/nSlides) + "%"));
    $("#desc1text").html(getDesc("desc1",speaker,nTargets,relative,pronoun,posspron,relpronoun,spouse,relposs,qud,comb));
    showSlide("desc1");
    if (trialnum < 3) { trialnum += 1; }
    $("#desc1button").click(function() { experiment.context2() })    
  },
  context2: function() {
    $('.bar').css('width', ( (100*(trialnum)/nSlides) + "%"));
    $("#desc2text").html(getDesc("desc2",speaker,nTargets,relative,pronoun,posspron,relpronoun,spouse,relposs,qud,comb));
    showSlide("desc2");
	    if (trialnum < 4) { trialnum += 1;}
    $("#desc2button").click(function() { experiment.compQuestions() })    
  },  
  compQuestions: function() {
  	if (compQSeen == 0) { compQSeen += 1; } // TODO: FIX ALL THE CONTEXT-RESEE ISSUES
  	var compresponses = {};
  	var numResponses = [];
  	var qudResponses = [];
  	var nnumResponses = 0;
  	var nqudResponses = 0;  	
    $('.bar').css('width', ( (100*(trialnum)/nSlides) + "%"));
    $("#compError").hide();
    if (compQSeen != 2) {
	    $("#qudQuestion").hide();
    	$("#qudOptions").hide();
	    $("#qudbutton").hide();
    }
	if (compQSeen == 2) { $("compbutton").hide(); }
  	$("#numQuestion").html("1. How many marbles are there in "+speaker+"'s set?");
  	$("#qudQuestion").html("2. When will "+speaker+" be satisfied?");
  	var speakergoals = shuffle([{id:"is-all",q:"If "+pronoun+" finds all of the marbles."},{id:"is-any",q:"If "+pronoun+" finds at least one of the marbles."},{id:"is-none",q:"If "+pronoun+" doesn't find any marbles."},{id:"is-most",q:"If "+pronoun+" finds most of the marbles."}]);
  	var qudText = '';
  	for (var i=0; i < speakergoals.length; i++) {    	
		qudText = qudText.concat('<tr><td align="left"><input type="radio" name="qud" value="'+speakergoals[i]['id']+'">'+speakergoals[i]['q']+'</input></td></tr>');
    } 
    $("#qudOptions").html(qudText);
	if (trialnum < 5) { trialnum += 1; }
  	showSlide("compQuestions");
	$("#numQ").focus();  	
    $("#compbutton").click(function() {
    	if (! $("#numQ").val() || $("#numQ").val() == '') {
    		$("#compError").show();
    	} else {
	    	nnumResponses += 1;
    		var numM = $("#numQ").val();
    		numResponses.push(numM);	
	    	if (numM != nTargets & numM != nTargetWord & numM != caps(nTargetWord)) {
//				wrongMarbleResponses.push(numM);
	    		$("#numQ").val('');
    			experiment.context1()
	    	} else {
				$("#compbutton").hide();	    		
	    		if (qudQSeen == 0) { qudQSeen += 1; }
				compQSeen = 2;
				$("#numQ").prop('disabled',true);
			    $("#compError").hide();	    		
		    	$("#qudQuestion").show();
		    	$("#qudOptions").show();
    			$("#qudbutton").show();
				$("#qudbutton").click(function() {   			
		    	var qudR = '';
		    	qudR = $('input:radio[name=qud]:checked').val();	    			
		    	if (! qudR || qudR == '') {
		    		$("#compError").show();
		    	} else {
			    	nqudResponses += 1;		    		
			    	qudResponses.push(qudR);			    		
					if (qudR == qud) {
						$("#compbutton").unbind("click");	
						compresponses['numResponses'] = numResponses;
						compresponses['qudResponses'] = qudResponses;
						compresponses['nnumResponses'] = nnumResponses;					
						compresponses['nqudResponses'] = nqudResponses;	
					    var comptrialData = experiment.data["compQInfo"].push(compresponses);
			    		experiment.vagueSliders() 
					} else {
						experiment.context1()
					}		
				}
				});
    		
	    	}
	    }
    });      	
  },
  // target display.
  vagueSliders: function() {
	// show progress bar
    $('.bar').css('width', ( (100*(trialnum)/nSlides) + "%"));
    // hide some things at start of trial  	
	$("#targetError").hide();
	
    var nResponses = 0;	
    var responses = {};
    $("#insText").html("<p>"+caps(speaker)+" found this box: </p>");
    draw("canvas1",size);   
	$("#uttText").html(caps(pronoun)+" called out to "+comb+": ");
    $("#answer").html("<span class='utterance'><b> 'I found _______ of the marbles!'</b></span>");     
    // 3. ask for production option ratings
    $("#sliderAdjustText").html("For each of the following words, adjust the slider to indicate how likely you think it is that "+speaker+" used that word.");
    showSlide("targetSlide");
    // 4. show utterances 
    var bowls = '<tr><td></td><td colspan="3" class="utttd">very unlikely</td><td width="10"></td><td colspan="3">very likely</td></tr><tr><td colspan="2"></td><td width="3">|</td><td colspan="3"></td><td width="3">|</td><td></td></tr>';
    for (var i=0; i < utterances.length; i++) {    	
    	utt = utterances[i]; // don't forget to initialize utterances globally
		bowls = bowls.concat('<tr><td align="left" class="utttd"><span class="utterance">'+utt+'</span></td><td colspan="2"></td><td colspan="3" width="110" align="center"><div id="slidy'+i+'" align="center"></div></td><td colspan="2"></td></tr>');
    }     
    bowls = bowls.concat('<tr><td colspan="2"></td><td>|</td><td colspan="3"></td><td>|</td><td></td></tr><tr><td></td><td colspan="3" class="utttd">very unlikely</td><td></td><td colspan="3">very likely</td></tr>');
    // 2. measure question
    $("#utteranceOptions").html(bowls);	
	function bowlChangeCreator(ind, caseLabel) {
		return function(value) {
		if (responses['target' + ind] == null)
		{
			nResponses++;
		}				
		responses['target' + ind] = $("#"+caseLabel).slider("value");		
		$("#"+caseLabel).css({"background":"#E6E6E6",
		"border-color": "#001F29"});
      	$("#"+caseLabel+" .ui-slider-handle").css({
      		"background":"#E62E00",
			"border-color": "#001F29" }); 		
		}
	}    
                          
    for (var i=0; i < utterances.length; i++) {                           
	     var caseLabel = "slidy" + i;
         $("#"+caseLabel).slider({	
               animate: "fast",
               orientation: "horizontal",
               max: 1 , 
               min: 0, 
               step: 0.01, 
               value: 0.5,               
               change: bowlChangeCreator(i, caseLabel)
     	});
    }     

 	trialnum += 1;
    // only proceed if all sliders tapped
    $("#sliderMoveon").click(function() {
     if ( nResponses < utterances.length ) {   	
       $("#targetError").show();
     } else {
       $("#sliderMoveon").unbind("click");
	   var trialData = experiment.data["trialInfo"].push(responses);
       experiment.questionaire();
     }
    });            
  },
 
  questionaire: function() {
    $(document).keypress( function(event){
     if (event.which == '13') {
        event.preventDefault();
      }
    });
    $('.bar').css('width', ( "100%"));
    showSlide("questionaire");
    $("#lgerror").hide();
    $("#formsubmit").click(function(){
    rawResponse = $("#questionaireform").serialize();
    pieces = rawResponse.split("&");
    var age = pieces[0].split("=")[1];
    var lang = pieces[1].split("=")[1];
    var comments = pieces[2].split("=")[1];
    if (lang.length > 0) {
        experiment.data["language"] = lang;
        experiment.data["comments"] = comments;
        experiment.data["age"] = age;
        showSlide("finished");
        setTimeout(function() { turk.submit(experiment.data) }, 1000);
    }
    });
  }
};