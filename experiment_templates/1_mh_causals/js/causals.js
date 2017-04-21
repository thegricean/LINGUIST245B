function make_slides(f) {
  var slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
    start: function() {
      $(".err").hide();
      $("#total-num").html(exp.nTrials);
     },
    button : function() {
        exp.go();
    }
  });

  slides.main_task = slide({
    name: "main_task",

    present : exp.stims,
    //this gets run only at the beginning of the block
    present_handle : function(stim) {
      var prompt, utt;

      // hide prior question and prior dependent measure
      $(".question0").hide();
      $("#slider_table0").hide();
      $("#prior_number").hide();
      // hide listener/speaker question
      $(".question2").hide();
      $(".task_prompt").hide();
      // hide listener task dependent measure
      $("#listener_number").hide();
      $("#slider_table2").hide();
      // hide speaker task dependent measure
      $("#speaker_choices").hide();
      // "uncheck" radio buttons
      $('input[name="speaker"]').prop('checked', false);

      // hide error message
      $(".err").hide();

      // show "data"
      $(".data").show();

      // get index number of trial
      this.trialNum = exp.stimscopy.indexOf(stim);

      // record trial start time
      this.startTime = Date.now();

      // replace CATEGORY, EXEMPLAR, TREATMENT, PAST from stimuli
      var story = replaceTerms(stim, "storyline")

      // display story
      $(".data").html("You are on planet " + stim.planet +
      ". " + story + " " +
      replaceTerms(_.extend(stim, {preamble}), "preamble"));

      // which "experiment" is not yet finished?
      this.missing = _.sample([1,2,3,4,5,6,7,8,9]);
      this.experimentNames = ["A","B","C","D","E","F","G","H","I","J","K"];

      stim.data.splice(this.missing, 0, "?");

      for (var i=0; i<=stim.data.length; i++){
        $("#h" + i).html(stim.treatment + " " + this.experimentNames[i])
        $("#h" + i).css({"font-size":"13px", "border":"1px dotted black"})
        $("#d" + i).css({"padding":"10px", "font-weight":"bold", "border":"1px solid black"});
        $("#d" + i).html(stim.data[i]);
        $("#d" + i + "a").html("100")
        $("#d" + i + "a").css({"border":"1px dotted black"});
      };
      $("#d-1").css({"border":"1px solid black","font-size":"14px", "font-weight":"bold", "width":"20%"});
      $("#d-1").html(stim.unit + " " + stim.past);
      $("#d-1a").css({"border":"1px dotted black"});

      stim.targetTreatment = stim.treatment+ " " + this.experimentNames[this.missing]

      if (exp.condition == "prior"){

        utils.make_slider("#single_slider0", this.make_slider_callback(0))

        $(".question0").html("The experiment using "+ stim.targetTreatment + " is not finished yet.<br>When it finishes, how many of the attempted 100 "+stim.unit + " will be successfully " + stim.past + "?");

        $(".question0").show();
        $("#slider_table0").show();
        $("#prior_number").html("---");
        $("#prior_number").show();

      } else if (exp.condition == "speaker") {

        utils.make_slider("#single_slider1", this.make_slider_callback(1))

        $(".question2").html(replaceTerms(stim, "prompt"));
        $(".task_prompt").show();
        $(".question2").show();

        prompt = replaceTerms(stim, "prompt");
        prompt +=  "<br>" + replaceTerms(stim, "frequencyStatement") + " <strong>" +
        stim.frequency + "</strong>"
        utt = 'Your colleague asks you: <strong>"' + replaceTerms(stim, "question")+ '"</strong>';

        $("#speaker_choices").show();
        $(".task_prompt").html(prompt);
        $(".question2").html(utt);

      } else if (exp.condition == "listener") {

        $(".question2").html(replaceTerms(stim, "prompt"));
        $(".task_prompt").show();
        $(".question2").show();

        utils.make_slider("#single_slider2", this.make_slider_callback(2))

        prompt = replaceTerms(stim, "prompt");
        utt = 'Your colleague tells you: <strong>"' + jsUcfirst(replaceTerms(stim, "utterance")) + '"</strong><br>' + replaceTerms(stim, "question");

        $("#listener_number").html("---");
        $("#listener_number").show();
        $("#slider_table2").show();
        $(".task_prompt").html(prompt);
        $(".question2").html(utt);

      }

      exp.sliderPost = -1;
      this.stim = stim;
    },

    init_sliders : function(i) {
      utils.make_slider("#single_slider" + i, this.make_slider_callback(i));
    },
    make_slider_callback : function(i) {
      return function(event, ui) {
        exp.sliderPost = ui.value;
        (i==0) ? $("#prior_number").html(Math.round(exp.sliderPost*100)+"") :
        (i==2) ? $("#listener_number").html(Math.round(exp.sliderPost*100)+"") : null
      };
    },

    button : function() {
      var speakerResponse = $('input[name="speaker"]:checked').val();
      var prompt, utt;
      console.log(speakerResponse)
      var error = 0;
      if (exp.condition == "speaker") {
        if (!speakerResponse) {
          error = 1;
        }
      } else {
        if (exp.sliderPost==-1) {
          error = 1;
        }
      }
      if (error == 1) {
        $(".err").show();
      } else {
        this.rt = Date.now() - this.startTime;
        this.log_responses();
        _stream.apply(this);
      }
    },

    log_responses : function() {
      if (exp.condition == "speaker") {
        var response = $('input[name="speaker"]:checked').val() == "Yes" ?  1 : 0;
      } else {
        var response = exp.sliderPost
      }
      exp.data_trials.push({
        "trial_type" : "prior_and_posterior",
        "condition": exp.condition,
        "trial_num": this.trialNum,
        "response" : response,
        "rt":this.rt,
        "frequency": this.stim.frequency,
        "category": this.stim.category,
        "story": this.stim.story,
        "distribution": this.stim.distribution,
        "treatment":this.stim.treatment,
        "unit":this.stim.unit,
        "target":this.stim.target,
        "planet": this.stim.planet,
        "query": this.stim.query,
        "missing":this.missing
      });
    }
  });

  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      exp.subj_data = {
        language : $("#language").val(),
        enjoyment : $("#enjoyment").val(),
        asses : $('input[name="assess"]:checked').val(),
        age : $("#age").val(),
        gender : $("#gender").val(),
        education : $("#education").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val(),
        comments : $("#comments").val()
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

  repeatWorker = false;
  (function(){
      var ut_id = "mht-causals-20170222";
      if (UTWorkerLimitReached(ut_id)) {
        $('.slide').empty();
        repeatWorker = true;
        alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
      }
  })();

  exp.trials = [];
  exp.catch_trials = [];

  exp.condition = _.sample(["prior","speaker","speaker","speaker","speaker","listener"])
  // exp.condition = "speaker"
  exp.nTrials = stories.length;

  exp.stims = [];
  var shuffledDists = _.shuffle(distributions);
  var frequencies = _.shuffle(tasks.speaker.frequencies);
  var labels = _.shuffle(creatureNames);
  var planets = _.shuffle(["X137","A325","Z142","Q681"])

  for (var i=0; i<stories.length; i++) {
    var f;
    if (exp.condition == "speaker"){
      f = {
        frequency: frequencies[i],
        category: labels[i].category,
        exemplar: labels[i].exemplar,
        prompt: tasks.speaker.prompt,
        utterance: tasks.speaker.utterance,
        question: tasks.speaker.question,
        frequencyStatement: tasks.speaker.frequencyStatement,
        planet: planets[i]
      };
      } else {
      f = {
        category: labels[i].category,
        exemplar: labels[i].exemplar,
        prompt: tasks.listener.prompt,
        utterance: tasks.listener.utterance,
        question: tasks.listener.question,
        planet: planets[i]
      }
    }
    exp.stims.push(
      _.extend(stories[i], shuffledDists[i], f)
    )
  };

  exp.stims = _.shuffle(exp.stims);
  exp.stimscopy = exp.stims.slice(0);

  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };

  //blocks of the experiment:
   exp.structure=[
     "i0",
     "instructions",
     "main_task",
     "subj_info",
     "thanks"
   ];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

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
