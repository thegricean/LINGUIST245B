# MTurk steps

### Code up experiment 

For example, use this template or this one to build off of. 

Remember to use the developer console to help in debugging. This is useful, for example, if nothing happens when you open your html file in the browser, or if something isn't working as it should. You can get to the console in Chrome on a Mac with the keyboard shortcut Cmd-option-j or by clicking on View > Developer > Console.

### Upload experiment to your Stanford web space

You can either do this in the console or via a desktop application like [Fetch](https://uit.stanford.edu/software/fetch). [Here](https://uit.stanford.edu/service/afs/file-transfer/macintosh) are the official Stanford configuration instructions for Fetch.

```scp -r XXX jdegen@cardinal.stanford.edu:./XXX'''

### Test experiment in the MTurk sandbox

Set up your MTurk infrastructure by following the steps under "Preparation" [here](https://cocolab.stanford.edu/mturk-tools.html). Then follow the instructions under "Running your Experiment" (or just directly the ones from the [submiterator github page](https://github.com/feste/Submiterator)). 

Make sure to put all files related to putting the experiment on MTurk in a special "mturk" directory in your project directory. Then update (or create) the .gitignore file in your project directory with the following content, which ensures that you won't accidentally put files containing subject information on the web:

```
*.config
*.input
*.properties
*.question
*.results
*.success
*_invoice.csv
*.Rhistory
*.DS_Store*
*catch_trials.csv
*subject_information.csv
*system.csv
*trials.csv
*mturk.csv
*mturk/
'''

Create a config file (e.g., experiment.config) just like the one shown on the [submiterator github page](https://github.com/feste/Submiterator)). Modify it to your purposes, but leave "liveHIT" set to "no". Once you run the following command from within the mturk directory, you should see output that includes a URL where you will be able to see your experiment in the MTurk Sandbox.

```submiterator posthit experiment'''

Follow the URL to your experiment. Run through it. Did the data submit successfully to MTurk? If so, it will say so on the MTurk website and you should be able to run the following command:

```submiterator getresults experiment'''

This will generate a file called experiment.results. The format will be messy. To convert it to something useful you can load into R (or view in Excel), run

```submiterator reformat experiment''' 

### Test that you are recording the right information

It is good practice to make sure that you're recording the information you need by running a mock analysis on the test data. That is, load the results file experiment.csv into R and run the visualization and analysis code you intend to run on the real dataset. Is everything being recorded that you need to run your analyses? If not, update your experiment, re-upload, re-test.

### Run the experiment on MTurk

Make sure you add enough money to your requester account to cover the experiment costs. There's a 20% fee for HITs with fewer than 10 assignments, and 40% for HITs with more than 10 assignments. If you want to circumvent the 40% fee, you can use Michael Henry Tessler's batched submiterator code, an example of which is shown [here](https://github.com/mhtess/mturk-demo) (this is not entirely straightforward, so don't worry about this until you're actually ready to run the experiment).

When you're ready, set "liveHIT" to "yes" in the experiment.config file, run ```submiterator posthit experiment''', and it's on the web for all to participate in!