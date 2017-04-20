// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function startsWith(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
       var substring = substrings[i];
       if (str.indexOf(substring) == 0) {
         return 1;
       }
    }
    return -1;     
}

function advanceWord(word_id) {
  console.log("got in here "+word_id);
  // $(".sprword").hide();
  $(".sprword").css('visibility','hidden');
  // $("#"+word_id).show();
  $("#"+word_id).css('visibility','visible');
  exp.word_start = Date.now();
}

function make_slides(f) {
  preload(
    ["images/aquarium_000.jpeg","images/aquarium_001.jpeg","images/aquarium_010.jpeg","images/aquarium_011.jpeg","images/aquarium_100.jpeg","images/aquarium_101.jpeg","images/aquarium_110.jpeg","images/aquarium_111.jpeg","images/bottle_000.jpeg","images/bottle_001.jpeg","images/bottle_010.jpeg","images/bottle_011.jpeg","images/bottle_100.jpeg","images/bottle_101.jpeg","images/bottle_110.jpeg","images/bottle_111.jpeg","images/chimney.gif","images/garage_000.jpeg","images/garage_001.jpeg","images/garage_010.jpeg","images/garage_011.jpeg","images/garage_100.jpeg","images/garage_101.jpeg","images/garage_110.jpeg","images/garage_111.jpeg","images/house_000.jpeg","images/house_001.jpeg","images/house_010.jpeg","images/house_011.jpeg","images/house_100.jpeg","images/house_101.jpeg","images/house_110.jpeg","images/house_111.jpeg","images/jar_000.jpeg","images/jar_001.jpeg","images/jar_010.jpeg","images/jar_011.jpeg","images/jar_100.jpeg","images/jar_101.jpeg","images/jar_110.jpeg","images/jar_111.jpeg","images/practiceimage.jpg"], 
    {after: function() {console.log("all images loaded")}}
  );  
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.practicetrial = slide({
    name : "practicetrial",
    // present : exp.all_stims,
    start : function() {
      $("#contbutton").hide();
      $("#practice2").hide();
      console.log("got into present handle");
      this.trial_start = Date.now();
      exp.practiceword_counter = 0;
      _s.rts = [];
      document.body.onkeyup = function(e){
        if(e.keyCode == 32){
          _s.rts.push(Date.now()-exp.word_start);
          exp.practiceword_counter++;
          if (exp.practiceword_counter < 8) {
            advanceWord("p"+exp.practiceword_counter);
          } else {
            $(".sprword").hide();
            $("#practice2").show();
            $("#contbutton").show();
          }
        }
      }
    },
    // present_handle : function() {
    //   console.log("got into present handle");
    //   this.trial_start = Date.now();
    //   exp.practiceword_counter = 0;
    //   _s.rts = [];
    //   document.body.onkeyup = function(e){
    //     if(e.keyCode == 32){
    //       _s.rts.push(Date.now()-exp.word_start);
    //       exp.practiceword_counter++;
    //       if (exp.practiceword_counter < 8) {
    //         advanceWord("p"+exp.practiceword_counter);
    //       } else {
    //         $(".sprword").hide();
    //         $("#practice2").show();
    //         $("#contbutton").show();
    //       }
    //     }
    //   }
    // },
    button : function() {
      console.log("got here");
      exp.go();
    }    
    });

  slides.sprtrial = slide({
    name : "sprtrial",
    present : exp.all_stims,
    start : function() {
	   $(".err").hide();
     $('input[name="tf"]').prop('checked',false);
     // $('no').prop('checked',false);
    },
    present_handle : function(stim) {
      console.log(stim);
      $(".err").hide();
      $("#truefalse").hide();
      $("#advancebutton").hide();
    	this.trial_start = Date.now();
      exp.word_counter = 0;
      _s.rts = [];
      this.stim = stim;
      var contextsentence = stim.contextsentence + " Press the space bar to see how "+stim.name+" described these "+stim.noun+".";
      $("#contextsentence").html(contextsentence);
	  console.log(stim.imgs[0]);
      var testimagehtml = '<table><tr><td><img src="images/'+stim.imgs[0]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[1]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[2]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[3]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[4]+'" style="height:100px;"></td></tr>'+
                                      '<tr><td><img src="images/'+stim.imgs[5]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[6]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[7]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[8]+'" style="height:100px;"></td>'+
                                      '<td><img src="images/'+stim.imgs[9]+'" style="height:100px;"></td>';
      $("#testimage").html(testimagehtml); 

      var sentence = stim.sentence;
      var sentencehtml = "<p>";
      for (i=0;i<sentence.length;i++) {
        sentencehtml = sentencehtml + '<span id="w'+(i+1)+'" class="sprword">'+sentence[i]+'</span>';
      }
      sentencehtml = sentencehtml + "</p>";
      $("#sentence").html(sentencehtml);
      console.log("sentencehtml");
      console.log(sentencehtml);

      document.body.onkeyup = function(e){
        if(e.keyCode == 32){
          _s.rts.push(Date.now()-exp.word_start);
          exp.word_counter++;
          if (exp.word_counter <= stim.sentence.length) {
            advanceWord("w"+exp.word_counter);
          } else {
            $(".sprword").hide();
            $('input[id=yes]').attr('checked',false);
            $('input[id=no]').attr('checked',false);
            $("#truefalse").show();
            $("#advancebutton").show();
          }
        }
      }
    },
    button : function() {
      var ok_to_go_on = true;
      if ($('input[name="tf"]:checked').val() == undefined) {
        ok_to_go_on = false;
        $(".err").show();
      } else {
        this.log_responses();
        _stream.apply(this);
    }
  }, 
    log_responses : function() {
        exp.data_trials.push({
          "item" : this.stim.item,
          "slide_number_in_experiment" : exp.phase,
          "sentence": this.stim.sentence,
          "sentence_type": this.stim.sentence_type,
          "quantifier": this.stim.quantifier,
          "rt" : Date.now() - _s.trial_start,
          "response" : _s.rts.concat($('input[name="tf"]:checked').val())
        });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        comments : $("#comments").val(),
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "catch_trials" : exp.catch_trials,
          "system" : exp.system,
          "condition" : exp.condition,
          "subject_information" : exp.subj_data,
          "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      setTimeout(function() {turk.submit(exp.data);}, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {

  var names = _.shuffle([
    {
      "name":"James",
      "gender":"M"
    },
    {
      "name":"John",
      "gender":"M"
    },
    {
      "name":"Robert",
      "gender":"M"
    },
    {
      "name":"Michael",
      "gender":"M"
    },
    {
      "name":"William",
      "gender":"M"
    },
    {
      "name":"David",
      "gender":"M"
    },
    {
      "name":"Richard",
      "gender":"M"
    },
    {
      "name":"Joseph",
      "gender":"M"
    },
    {
      "name":"Charles",
      "gender":"M"
    },
    {
      "name":"Thomas",
      "gender":"M"
    },
    {
      "name":"Christopher",
      "gender":"M"
    },
    {
      "name":"Daniel",
      "gender":"M"
    },
    {
      "name":"Matthew",
      "gender":"M"
    },
    {
      "name":"Donald",
      "gender":"M"
    },
    {
      "name":"Anthony",
      "gender":"M"
    },
    {
      "name":"Paul",
      "gender":"M"
    },
    {
      "name":"Mark",
      "gender":"M"
    },
    {
      "name":"George",
      "gender":"M"
    },
    {
      "name":"Steven",
      "gender":"M"
    },
    {
      "name":"Kenneth",
      "gender":"M"
    },
    {
      "name":"Andrew",
      "gender":"M"
    },
    {
      "name":"Edward",
      "gender":"M"
    },
    {
      "name":"Joshua",
      "gender":"M"
    },
    {
      "name":"Brian",
      "gender":"M"
    },
    {
      "name":"Kevin",
      "gender":"M"
    },
    {
      "name":"Ronald",
      "gender":"M"
    },
    {
      "name":"Timothy",
      "gender":"M"
    },
    {
      "name":"Jason",
      "gender":"M"
    },
    {
      "name":"Jeffrey",
      "gender":"M"
    },
    {
      "name":"Gary",
      "gender":"M"
    },
    {
      "name":"Ryan",
      "gender":"M"
    },
    {
      "name":"Nicholas",
      "gender":"M"
    },
    {
      "name":"Eric",
      "gender":"M"
    },
    {
      "name":"Jacob",
      "gender":"M"
    },
    {
      "name":"Jonathan",
      "gender":"M"
    },
    {
      "name":"Larry",
      "gender":"M"
    },
    {
      "name":"Frank",
      "gender":"M"
    },
    {
      "name":"Scott",
      "gender":"M"
    },
    {
      "name":"Justin",
      "gender":"M"
    },
    {
      "name":"Brandon",
      "gender":"M"
    },
    {
      "name":"Raymond",
      "gender":"M"
    },
    {
      "name":"Gregory",
      "gender":"M"
    },
    {
      "name":"Samuel",
      "gender":"M"
    },
    {
      "name":"Benjamin",
      "gender":"M"
    },
    {
      "name":"Patrick",
      "gender":"M"
    },
    {
      "name":"Jack",
      "gender":"M"
    },
    {
      "name":"Dennis",
      "gender":"M"
    },
    {
      "name":"Jerry",
      "gender":"M"
    },
    {
      "name":"Alexander",
      "gender":"M"
    },
    {
      "name":"Tyler",
      "gender":"M"
    },
    {
      "name":"Mary",
      "gender":"F"
    },
    {
      "name":"Jennifer",
      "gender":"F"
    },
    {
      "name":"Elizabeth",
      "gender":"F"
    },
    {
      "name":"Linda",
      "gender":"F"
    },
    {
      "name":"Emily",
      "gender":"F"
    },
    {
      "name":"Susan",
      "gender":"F"
    },
    {
      "name":"Margaret",
      "gender":"F"
    },
    {
      "name":"Jessica",
      "gender":"F"
    },
    {
      "name":"Dorothy",
      "gender":"F"
    },
    {
      "name":"Sarah",
      "gender":"F"
    },
    {
      "name":"Karen",
      "gender":"F"
    },
    {
      "name":"Nancy",
      "gender":"F"
    },
    {
      "name":"Betty",
      "gender":"F"
    },
    {
      "name":"Lisa",
      "gender":"F"
    },
    {
      "name":"Sandra",
      "gender":"F"
    },
    {
      "name":"Helen",
      "gender":"F"
    },
    {
      "name":"Ashley",
      "gender":"F"
    },
    {
      "name":"Donna",
      "gender":"F"
    },
    {
      "name":"Kimberly",
      "gender":"F"
    },
    {
      "name":"Carol",
      "gender":"F"
    },
    {
      "name":"Michelle",
      "gender":"F"
    },
    {
      "name":"Emily",
      "gender":"F"
    },
    {
      "name":"Amanda",
      "gender":"F"
    },
    {
      "name":"Melissa",
      "gender":"F"
    },
    {
      "name":"Deborah",
      "gender":"F"
    },
    {
      "name":"Laura",
      "gender":"F"
    },
    {
      "name":"Stephanie",
      "gender":"F"
    },
    {
      "name":"Rebecca",
      "gender":"F"
    },
    {
      "name":"Sharon",
      "gender":"F"
    },
    {
      "name":"Cynthia",
      "gender":"F"
    },
    {
      "name":"Kathleen",
      "gender":"F"
    },
    {
      "name":"Ruth",
      "gender":"F"
    },
    {
      "name":"Anna",
      "gender":"F"
    },
    {
      "name":"Shirley",
      "gender":"F"
    },
    {
      "name":"Amy",
      "gender":"F"
    },
    {
      "name":"Angela",
      "gender":"F"
    },
    {
      "name":"Virginia",
      "gender":"F"
    },
    {
      "name":"Brenda",
      "gender":"F"
    },
    {
      "name":"Catherine",
      "gender":"F"
    },
    {
      "name":"Nicole",
      "gender":"F"
    },
    {
      "name":"Christina",
      "gender":"F"
    },
    {
      "name":"Janet",
      "gender":"F"
    },
    {
      "name":"Samantha",
      "gender":"F"
    },
    {
      "name":"Carolyn",
      "gender":"F"
    },
    {
      "name":"Rachel",
      "gender":"F"
    },
    {
      "name":"Heather",
      "gender":"F"
    },
    {
      "name":"Diane",
      "gender":"F"
    },
    {
      "name":"Joyce",
      "gender":"F"
    },
    {
      "name":"Julie",
      "gender":"F"
    },
    {
      "name":"Emma",
      "gender":"F"
    }
  ]);

  var items = _.shuffle([
	
	{
  "item": "aquarium",
  "contextsentence": "Here are aquariums with starfish, jellyfish, and seahorses in them.",
  "noun": "aquariums",
  "fixedorder": ["seahorses","jellyfish","starfish"],
  "content1" : "starfish",
  "content2" : "jellyfish",
  "content3" : "seahorses",
  "content0" : "crabs"
}	,
  {
  "item": "bottle",
  "contextsentence": "Here are bottles with stars, crowns, and hearts in them.",
  "noun": "bottles",
  "fixedorder" : ["hearts","crowns","stars"],
  "content1" : "stars",
  "content2" : "crowns",
  "content3" : "hearts",
  "content0" : "squares"
},
  {
  "item": "garage",
  "contextsentence": "Here are garages with skateboards, scooters, and bikes in them.",
  "noun": "garages",
  "fixedorder" : ["bikes","scooters","skateboards"],
  "content1" : "skateboards",
  "content2" : "scooters",
  "content3" : "bikes",
  "content0" : "cars"
}, 
  {
  "item": "house",
  "contextsentence": "Here are houses with clowns, batmen, and genies in them.",
  "noun": "houses",
  "fixedorder": ["clowns","batmen","genies"],
  "content1" : "clowns",
  "content2" : "batmen",
  "content3" : "genies",
  "content0" : "spidermen"
},
  {
  "item": "jar",
  "contextsentence": "Here are jars with staplers, pencils, and rulers in them.",
  "noun": "jars",
  "fixedorder": ["pencils","rulers","staplers"],
  "content1" : "staplers",
  "content2" : "pencils",
  "content3" : "rulers",
  "content0" : "erasers"
} 
  ]);//.slice(0,36);

  function makeStim(i) {
    var quantifiers = _.shuffle(["Some","All","None"]);
    var sentence_type = _.shuffle(["true","false"]);
    //get item
    var name_data = names[i];
    var name = name_data.name;
    var gender = name_data.gender;
    var item = items[i];
    var item_id = item.item;
    var contextsentence = item.contextsentence;
    var order = item.fixedorder;
    var imgs = [];
    imgs.push(item.item+"_100.jpeg");
    imgs.push(item.item+"_100.jpeg");
    imgs.push(item.item+"_100.jpeg");
    imgs.push(item.item+"_100.jpeg");
    imgs.push(item.item+"_100.jpeg");
    imgs.push(item.item+"_110.jpeg");
    imgs.push(item.item+"_110.jpeg");
    imgs.push(item.item+"_110.jpeg");
    imgs.push(item.item+"_111.jpeg");
    imgs.push(item.item+"_111.jpeg");

    for (var j=0; j<sentence_type.length;j++) {
      var sentence_start = [name, "says: "];
      // var contents = _.shuffle(["content1","content2","content3"]);

      if (sentence_type[j] == "true") {
        if (quantifiers[j] == "All") {
          sentence = sentence_start.concat(["All", "of", "these", item.noun, "have", order[0], "in", "them"]);
        } else {
          if (quantifiers[j] == "Some") {
            sentence = sentence_start.concat(["Some", "of", "these", item.noun, "have", order[1], "in", "them"]);
          } else {
            sentence = sentence_start.concat(["None", "of", "these", item.noun, "have", item.content0, "in", "them"]);
          }
        }
      } else {
        if (sentence_type[j] == "false") {
          if (quantifiers[j] == "All") {
            sentence = sentence_start.concat(["All", "of", "these", item.noun, "have", item.content0, "in", "them"]);
          } else {
            if (quantifiers[j] == "Some") {
              sentence = sentence_start.concat(["Some", "of", "these", item.noun, "have", item.content0, "in", "them"]);
            } else {
              sentence = sentence_start.concat(["None", "of", "these", item.noun, "have", order[0], "in", "them"]);
            }
          }
        }
      }     
  exp.all_stims.push( {
      "item": item_id,
      "noun" : item.noun,
      "contextsentence": contextsentence,
      "sentence": sentence,
      "name": name,
      "gender": gender,
      "imgs": _.shuffle(imgs),
      "sentence_type" : sentence_type[j],
      "quantifier" : quantifiers[j]
    });
}
     exp.all_stims.push( {
      "item": item_id,
      "noun" : item.noun,
      "contextsentence": contextsentence,
      "sentence": sentence_start.concat(["Some","of","these",item.noun,"have",order[0],"in","them"]),
      "name": name,
      "gender": gender,
      "imgs": _.shuffle(imgs),
      "sentence_type" : "underinformative",
      "quantifier" : "Some"
    });
      exp.all_stims.push( {
      "item": item_id,
      "noun" : item.noun,
      "contextsentence": contextsentence,
      "sentence": sentence_start.concat(["Some","of","these",item.noun,"have",order[2],"in","them"]),
      "name": name,
      "gender": gender,
      "imgs": _.shuffle(imgs),
      "sentence_type" : "atypical",
      "quantifier" : "Some"
    }); 
  }
  exp.all_stims = [];
  for (var i=0; i<items.length; i++) {
    makeStim(i);
  }

  exp.trials = [];
  exp.catch_trials = [];
  exp.condition = {}; //can randomize between subject conditions here
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "practicetrial", "sprtrial", 'subj_info', 'thanks'];
  
  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined
  $(".nQs").html(exp.nQs);

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

  exp.go(); //show first slide
}
