// First, initialize jsPsych using the `initJsPsych()` function.
// A few parameters can optionally be passed as arguments to this function
// that will globally affect how the experiment runs. One of these for example
// is adding a progress bar, which we've done below. We can also use the 
// `on_finish` parameter to display that CSV-style data object at the end
// of the experiment, which is useful for debugging. This page includes a list
// of other things you might want to do here:
// https://www.jspsych.org/7.3/reference/jspsych/#initjspsych
const jsPsych = initJsPsych({
    show_progress_bar: true,
    on_finish: function () {
        proliferate.submit({"trials": data.values()});
      }
  });


// Define an empty array called 'timeline'. This is where the experiment
// logic will live. At the end of this script, we tell JsPsych to run 
// through the trials in `timeline` (in the same order they're pushed).
let timeline = [];

// If you're using any media (audio, images, video) , it's a good idea
// to load them in advance, which prevents the experiment from lagging
// while it's running. To do this, just generate an array with each 
// media path and supply that to the `jsPsychPreload` plugin:
// https://www.jspsych.org/7.3/plugins/preload/
const preload_array = ['audio/Violin.wav', 'audio/Bologna.wav'];

const preload_trial = {
    type: jsPsychPreload,
    audio: preload_array
};
// After a trial object is constructed, we need to push it to the
// timeline array. This can be done individually or in groups.
timeline.push(preload_trial);

// The first trial a participant interacts with should include a consent
// form. Included here is the standard department protocol. It's a good 
// idea to do this with the `jsPsychHtmlButtonResponse` plugin, where the 
// `stimulus` parameter is given the consent form in html format. The 
// `jsPsychHtmlButtonResponse` is documented here:
// https://www.jspsych.org/7.3/plugins/html-button-response/
const irb = {
    type: jsPsychHtmlButtonResponse,
    stimulus: '<p><font size="3">We invite you to participate in a research study on language production and comprehension. Your experimenter will ask you to do a linguistic task such as reading sentences or words, naming pictures or describing scenes, making up sentences of your own, or participating in a simple language game. <br><br>There are no risks or benefits of any kind involved in this study. <br><br>You will be paid for your participation at the posted rate.<br><br>If you have read this form and have decided to participate in this experiment, please understand your participation is voluntary and you have the right to withdraw your consent or discontinue participation at anytime without penalty or loss of benefits to which you are otherwise entitled. You have the right to refuse to do particular tasks. Your individual privacy will be maintained in all published and written data resulting from the study. You may print this form for your records.<br><br>CONTACT INFORMATION: If you have any questions, concerns or complaints about this research study, its procedures, risks and benefits, you should contact the Protocol Director Meghan Sumner at (650)-725-9336. If you are not satisfied with how this study is being conducted, or if you have any concerns, complaints, or general questions about the research or your rights as a participant, please contact the Stanford Institutional Review Board (IRB) to speak to someone independent of the research team at (650)-723-2480 or toll free at 1-866-680-2906. You can also write to the Stanford IRB, Stanford University, 3000 El Camino Real, Five Palo Alto Square, 4th Floor, Palo Alto, CA 94306 USA.<br><br>If you agree to participate, please proceed to the study tasks.</font></p>',
    choices: ['Continue']
};

// We can also have participants advance with a keyboard response rather 
// than by clicking a button. Use the `jsPsychHtmlKeyboardResponse` plugin
// and enter the valid key responses as an array of strings.
// https://www.jspsych.org/7.3/plugins/html-keyboard-response/
const gen_instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "In the first part of this experiment, you will hear a series of words. If it's your first time hearing the word, press 'D' for NEW. If you've already heard the word during the task, press 'K' for OLD. Try to respond as quickly and accurately as you can.<br><br>When you're ready to begin, press the space bar.",
    choices: [" "]
}

// Don't forget to push trials to the timeline!
timeline.push(irb, gen_instructions)

// Now we get to the actual experiment. For a recognition memory experiment,
// we want participants to hear a single token and make a keyboard response 
// in each trial. A good plugin for this is `jsPsychAudioKeyboardResponse`:
// https://www.jspsych.org/7.3/plugins/audio-keyboard-response/
// 
// As in the above trial, we can provide the valid responses in the `choices` 
// parameter. The 'stimulus' parameter is given the path to the audio file. 
// Many plugins also use the `prompt` parameter, which displays a string of
// html format on the participant's window. This can be used for example to 
// remind participants of which key is associated with which response.
// 
// At the end of the experiment, you'll get a csv-style output with all your 
// data. Importantly, the only things that will show up there are the default 
// data (trial type, time elapsed, trial index, etc.) and plugin-specific data 
// (RT, response, etc.). Any custom data you want to record has to be specified 
// in the `data` parameter, which takes another object as its argument. This is 
// useful for recording anything that is relevant to your experiment but isn't
// included in jsPsych out of the box (condition codes, correct responses, etc.)
// 
// Sometimes we also want jsPsych to behave dynamically, for example to provide
// feedback on responses in a practice round. Some parameters are often given 
// functions as arguments in order to facilitate this behavior, for example the
// `on_finish` parameter, which executes at the end of a trial. In this case, we 
// want to know how to categorize each response, so we use an anonymous function
// to call `evaluate_reponse` from the `util.js` file. That function just looks
// at the participant's key press, categorizes it, and then records it to the
// `data` object under the parameter name `result`. Even though neither is 
// defined within jsPsych, the output file will include columns both for `correct`
// and for `result` because we included them in the `data` object.
// https://www.jspsych.org/7.3/overview/dynamic-parameters/

// It's burdensome to manually define every single trial, 
// especially when most of the parameters are repeated. To get around this,
// you can use `timeline_variables` to define chunks of experiment logic and
// loop through that with e.g. a different auditory stimulus each time.
// Here's more info on that:
// https://www.jspsych.org/7.3/overview/timeline/#timeline-variables

let tv_array = create_tv_array(trial_objects);
tv_array = set_trial_order(tv_array)

const trials = {
    timeline: [
        {
            type: jsPsychAudioKeyboardResponse,
            choices: ['d', 'k'],
            stimulus: jsPsych.timelineVariable('stimulus'),
            response_allowed_while_playing: false,
            trial_duration: 4000,
            prompt: `<div class=\"option_container\"><div class=\"option\">NEW<br><br><b>D</b></div><div class=\"option\">OLD<br><br><b>K</b></div></div>`,
            on_finish: function(data) {
                evaluate_response(data);
            },
            data: jsPsych.timelineVariable('data')
        },
        {
            type: jsPsychHtmlKeyboardResponse,
            choices: [""],
            stimulus: "",
            response_ends_trial: false,
            trial_duration: 1000
        }
    ],
    timeline_variables: tv_array,
}
timeline.push(trials)

// The last thing to do is to create a questionnaire to get more info about 
// our participants and how the experiment worked. There are two main ways 
// to do this. The traditional way is with the `jsPsychSurveyHtmlForm` plugin.
// There, you basically just write up a survey in html and provide that to
// the html parameter. That is implemented below, but commented out.
// https://www.jspsych.org/7.3/plugins/survey-html-form/
// 
// There is also a newer, substantially slicker, but still-in-beta way using
// the `jsPsychSurvey` plugin. The main parameter here is called 'pages',
// which accepts an array of arrays of objects, where each object reflects
// a question. Note that this plugin requires a special CSS file, which we
// loaded on line 16 in the html file.
// https://www.jspsych.org/7.3/plugins/survey/

const quest_intstructions = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: "That's the end of the experiment! Thank you for your responses. To help us analyze our results, it would be helpful to know know a little more about you. Please answer the following questions. <br><br>"
}

// const questionnaire = {
//     type: jsPsychSurveyHtmlForm,
//     preamble: 'Please answer the following questions.',
//     html: '<form><p>Did you read the instructions and do you think you did the task correctly?</p><input type="radio" id="correct-yes" name="correct" value="Yes"><label for="correct-yes">Yes </label><input type="radio" id="correct-no" name="correct" value="No"><label for="correct-no">No</label>  <input type="radio" id="correct-confused" name="correct" value="I was confused"><label for="correct-confused">I was confused</label><br><br><br><br><label for="gender">What is your gender?</label><br><select name="gender" id="gender"><option value="Female">Female</option><option value="Male">Male</option><option value="Other">Other</option></select><br><br><label for="age">What is your age?</label><br><input type="text" id="age" name="age"><br><br><label for="education">What is your level of education?</label><br><select name="education" id="education"><option value="some_hs">Some high school</option><option value="hs">Graduated high school</option><option value="some_col">Some college</option><option value="col">Graduated college</option><option value="grad">Hold a higher degree</option></select><br><br><label for="language">Native language? (the language spoken at home when you were a kid.)</label><br><input type="text" id="language" name="language"><br><br><label for="fair-pay">Do you think the level of payment was fair?</label><br><select name="fair-pay" id="fair-pay"><option value="fair">The payment was fair</option><option value="too-low">The payment was too low</option></select><br><br><label for="enjoyment">Did you enjoy the experiment?</label><br><select name="enjoyment" id="enjoyment"><option value="worse">Worse than the average experiment</option><option value="average">Average for an experiment</option><option value="better">Better than the average experiment</option></select><br><br><label for="comments">We would be interested in any comments you have about this experiment. Please type them here:</label><br><input type="text" id="comments" name="comments" size="100"><br><br></form>'
// }

const questionnaire = {
    type: jsPsychSurvey,
    pages: [
        [
            {
                type: 'html',
                prompt: "Please answer the following questions:"
            },
            {
                type: 'multi-choice',
                prompt: 'Did you read the instructions and do you think you did the task correctly?', 
                name: 'correct', 
                options: ['Yes', 'No', 'I was confused']
            },
            {
                type: 'drop-down',
                prompt: 'Gender:',
                name: 'gender',
                options: ['Female', 'Male', 'Non-binary/Non-conforming', 'Other']
            },
            {
                type: 'text',
                prompt: 'Age:',
                name: 'age',
                textbox_columns: 10
            },
            {
                type: 'drop-down',
                prompt: 'Level of education:',
                name: 'education',
                options: ['Some high school', 'Graduated high school', 'Some college', 'Graduated college', 'Hold a higher degree']
            },
            {
                type: 'text',
                prompt: "Native language? (What was the language spoken at home when you were growing up?)",
                name: 'language',
                textbox_columns: 20
            },
            {
                type: 'drop-down',
                prompt: 'Do you think the payment was fair?',
                name: 'payment',
                options: ['The payment was too low', 'The payment was fair']
            },
            {
                type: 'drop-down',
                prompt: 'Did you enjoy the experiment?',
                name: 'enjoy',
                options: ['Worse than the average experiment', 'An average experiment', 'Better than the average experiment']
            },
            {
                type: 'text',
                prompt: "Do you have any other comments about this experiment?",
                name: 'comments',
                textbox_columns: 30,
                textbox_rows: 4
            }
        ]
    ]
}

const thanks = {
    type: jsPsychHtmlButtonResponse,
    choices: ['Continue'],
    stimulus: "Thank you for your time! Please click 'Continue' and then wait a moment until you're directed back to Prolific.<br><br>"
}

timeline.push(quest_intstructions, questionnaire, thanks);

// Finally, we run it.
jsPsych.run(timeline);