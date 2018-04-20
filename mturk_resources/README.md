# Mechanical Turk Resources

We will use Submiterator to link our experiments to Mechanical Turk, retrieve results from Mechanical Turk, and reformat the results to analyze in R. Follow the instructions [here](https://github.com/erindb/Submiterator) for installation instructions. Make sure to set up `submiterator` as a system-wide command.

## Getting your experiment into the sandbox

### Prerequisites

1. Set up AWS account.
2. Set up Mechanical Turk requester account.
3. Install Mechanical Turk command line tools.
4. Install Submiterator and set `submiterator` up as system-wide command.

### Getting your experiment ready to test

1. Code up your experiment in html/javascript by modifying (and renaming, if you feel like it) the following files in your project directory:
	- html/template_minimal.html
	- js/template_minimal.js
2. Test your experiment locally by opening the .html file in a browser and making modifications to the html and js as needed. 
	- Use the Developer console for debugging (shortcut on Mac in Chrome: Cmd+option+j)
	- Make sure everything you want to record is getting recorded in the `log_responses` function. If you're not sure whether everything is getting recorded, you can click through to the end of the experiment and a gray box with all the information that will get sent to MTurk will be displayed. If you don't want to click all the way through, you can type `exp.go()` in the Developer console to get to the next block of the experiment (as specified in `exp.structure`).
3. Push your changes periodically to github.
4. Once satisfied with the experiment, push it to github. If you are using the directory structure we set up in class, the URL to the experiment should be `https://USERNAME.github.io/PROJECTNAME/practice/html/template_minimal.html`, where you need to replace `USERNAME` with your github user name and `PROJECTNAME` with the name of your forked repo (if you named it `ling245exp` change it to something more intuitive). For instance, my experiment URL is `https://thegricean.github.io/bottnoveck2004/practice/html/template_minimal.html`.

### Testing your experiment in the MTurk sandbox

**Always test your experiment in the sandbox before running it for real on MTurk!**

1. Inside the `practice` folder, create a folder called `mturk`. This folder will contain all MTurk related files and can really live anywhere on your computer, but it's good practice to keep it close to the actual experiment you're running. If you type `git status` you'll notice that the folder does not get recognized by `git`. That's intentional, to prevent the accidental uploading of confidential Worker IDs to the web. Have a look at the contents of the file `.gitignore` in the root folder of your forked repository to see how we're ignoring these files. Note: if you call this folder anything other than `mturk`, it will not get ignored!
2. Inside the `mturk` folder, create a file `experiment.config`, which will contain all the information that's relevant for `submiterator` to appropriately load your experiment onto MTurk. You may want to work off of a copy of the file `LINGUIST245/mturk_resources/example_config.txt`. Make sure your file has the extension `.config` rather than anything else (eg, `.txt` will not work).
3. Modify each of the fields for your purposes. 
	- Most importantly, add the `experimentURL` from above.
	- **Make sure to keep `liveHIT` set to `no` while you are testing!**
	- When calculating payment, try to pay at a rate of $10/hour. Do the experiment pretending you're a real participant to get an estimate of how long it will realistically take.
4. When you are satisfied with the contents of the `.config` file, navigate to the `mturk` directory in your Terminal and type `submiterator posthit experiment`. If your experiment was successfully loaded into the sandbox, you should see something like this:
[](successfulhitpost.png)
5. Paste the outputted URL in your browser to see your experiment in the Sandbox. Eg, in the above screenshot, the relevant URL is `https://workersandbox.mturk.com/mturk/preview?groupId=3940TVN5B54IN1GB327XPZEC4JOEOP`.
6. Click through the experiment.
7. To retrieve your results, type `submiterator getresults experiment` in the Terminal while in the `mturk` folder. If your results were successfully retrieved, you should see something like this:
[](successfulhitretrieval.png)
8. To reformat the generated results file `experiment.results`, which contains the information in the one-participant-per-row format, type `submiterator reformat results`. This will create a file `experiment.csv`, which contains the information in the one-datapoint-per-row format. Note: this will only work if you logged responses in a variable `response` in the `log_responses()` function. If the command completes successfully, you should see something like this:
[](successfulreformat.png)
9. Load the data into R. Run your visualization/analysis code on the data to make sure you're recording everything you need.

### Running your experiment on MTurk

**Only do this once you're absolutely certain that your experiment runs and that you're recording all the information you need for your analyses!**

1. Load sufficient funds onto your MTurk requester account. Remember there's a 20% Amazon fee (40% if you run more than 9 people per HIT). Use Michael Henry Tessler's [batch submiterator](https://github.com/mhtess/submiterator-batch) script for running more than 9 people but avoiding the extra fee. So if you're paying participants $1.00, you'll need to calculate $1.20 for every participant you run (and $1.40 if you run more than 9 people and don't want to use the batch submiterator).
2. Change `liveHIT` from `no` to `yes` in your `.config` file and make sure that the `reward` and `numberofassignments` is set correctly.
3. Run the same series of `submiterator` commands as above.

That's it!!


## MTurk-related things to keep in mind

- Post HITs on weekdays in the early morning to avoid noisy data.
- Sign up for accounts at Turkernation and/or Turkopticon to interact with Turkers or see how you are being rated.
- Generally try to make Turkers comfortable:
	- Include a progress bar in your experiment for a sense of how long the experiment will take. (By default the template comes with a built-in progress bar, but you'll have to make sure that `exp.nQs`, specified in the js file, is the right length, ie the length of the experiment in total number of trials, including instruction slides.)
	- Pay fairly.
	- Include clear (but concise) instructions. Turkers don't like to read a lot. 
	



















- Monitor your email while HIT is running.
- Turkers communicate. Check out Turkernation and Turkopticon.