### Simple bot check

Follow the instructions below to add a simple bot check (written by Elisa Kreiss) to your experiment.

Participants will read a sentence and answer a super simple question. If they give the wrong answer more than three times, the button to start the experiment will dissappear and participants won't be able to complete to experiment. 


add the "bot" slide to your html file:

```
<div class="slide" id="bot">
	<h3>Are you a bot?</h3>
	<p id="s"></p>
	<p id="q"></p>
	<input type="text" id="text_box"/>
	<br><br><br>
	<div class="err_msg" id="err1">
		<p2>Failing this question two more times will disqualify you from this study.</p2>
	</div>
	<div class="err_msg" id="err2">
		<p2>Failing this question one more time will disqualify you from this study.</p2>
	</div>
	<div class="err_msg" id="disq">
		<p2>You failed the question and you are disqualified.</p2>
	</div>
	<div class="button">
		<button onclick="_s.button()">Continue</button>
	</div>
</div>
```

and the "bot" slide to your js file:

```
slides.bot = slide({
name: "bot",
start: function () {
  $('.err_msg').hide();
  exp.speaker = _.shuffle(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"])[0];
  exp.listener = _.shuffle(["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Margaret"])[0];
  exp.lives = 0;
  var story = exp.speaker + ' says to ' + exp.listener + ': "It\'s a beautiful day, isn\'t it?"'
  var question = 'Who does ' + exp.speaker + ' talk to?';
  document.getElementById("s").innerHTML = story;
  document.getElementById("q").innerHTML = question;
},
button: function () {
  var textInput = document.getElementById("text_box").value;
  var listenerLowerCase = exp.listener.toLowerCase();
  var textInputLowerCase = textInput.toLowerCase();

  exp.data_trials.push({
    "slide_number_in_experiment": "bot_check",
    "stim": exp.lives,
    "response": textInput
  });

  if ((exp.lives < 3) && (textInputLowerCase === listenerLowerCase)) {
    exp.go();
  }
  else {
    $('.err_msg').hide();
    switch (exp.lives) {
      case 0:
        $('#err1').show();
        break;
      case 1:
        $('#err2').show();
        break;
      case 2:
        $('#disq').show();
        $('.button').hide();
        break;
      default:
        break;
    }
    exp.lives++;
  }
},
});
```

and this slide to the beginning of your experiment (in js file):

```
  exp.structure=["bot","i0", "instructions", "one_slider", 'subj_info', 'thanks'];
```
