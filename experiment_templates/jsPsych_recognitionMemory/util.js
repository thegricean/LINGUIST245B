// This file just serves to show how we might use a separate js file
// to define helper functions. This can be useful to keep the main
// js script from getting too cluttered and prevent ourselves from 
// repeating too much code. 

function evaluate_response(data) {
    if (data.response == 'd' & data.correct == 'NEW') {
        data.result = "correct_rejection"
    } else if (data.response == 'k' & data.correct == 'NEW') {
        data.result = "false_alarm"
    } else if (data.response == 'd' & data.correct == 'OLD') {
        data.result = "miss"
    } else  {
        data.result = "hit"
    }
}

function create_tv_array(json_object) {
    let tv_array = [];
    for (let i = 0; i < json_object.length; i++) {
        obj = {};
        obj.stimulus = json_object[i].stimulus;
        obj.data = {};
        obj.data.correct = json_object[i].correct;
        tv_array.push(obj)
    }
    return tv_array;
}

function shuffle_array(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function set_trial_order(trial_array) {
    trial_array = shuffle_array(trial_array);
    let used_words = [];
    for (let i = 0; i < trial_array.length; i++) {
        if (used_words.includes(trial_array[i].stimulus)) {
            trial_array[i].data.correct = "OLD";
        } else {
            trial_array[i].data.correct = "NEW";
            used_words.push(trial_array[i].stimulus);
        }
    }
    return trial_array;
}