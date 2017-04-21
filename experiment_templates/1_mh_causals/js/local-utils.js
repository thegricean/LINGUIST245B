// general function for replacing all instances of TERM with prompt
var replaceTerms = function(stim, label){
  var prompt = stim[label];
  return prompt.replace(/CATEGORY/g,
     stim.category).replace(/EXEMPLAR/g,
       stim.exemplar).replace(/TREATMENT/g,
         stim.treatment).replace(/TARGET/g,
           stim.target).replace(/QUERY/g,
             stim.query).replace(/UNIT/g,
               stim.unit).replace(/PAST/g,
                 stim.past).replace(/SPECIAL/g,
                 stim.targetTreatment)
};

// make first letter uppercase (i.e., "capitalize")
var jsUcfirst = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
