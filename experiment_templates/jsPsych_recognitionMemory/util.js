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