# Software installation for Linguist245B (Spr 2020)
We use some tools to run our web-based experiments on Amazon Mechanical Turk. Follow the steps below to set up the pipeline.

## Preparation
1. Get CITI certification by completing the [CITI Tutorial](https://about.citiprogram.org/en/homepage/).

2.  We will not directly program in Python, but some of the tools we use depend on it, so make sure you have installed [Python 3](https://www.python.org/downloads/).
	
	To test if the right version of Python is installed: go to Terminal, type `python3`. It should open an interactive window, type `exit()` to close the interpreter. Now see if your default Python command is Python2 or Python3 by typing `python -V`. If your default Python command is python2, make sure to run `pip3` instead of pip in the next step.

3. Install the `boto3` and the `xmltodict` packages.
 
```
pip install boto3
pip install xmltodict
```

## Amazon MTurk Setup
Amazon Mechanical Turk (MTurk) is a crowdsourcing platform well suited for running web-based experiments.

1.    Create an Amazon Web Services (AWS) account at https://aws-portal.amazon.com/gp/aws/developer/registration/index.html (create an individual account)
2.    Sign up for an Amazon Mechanical Turk Requester account at https://requester.mturk.com/.
3.    Now you will link your AWS Account and your MTurk Requester Account. Open https://requester.mturk.com/developer, and click `Link your AWS Account`. Then sign-in with your AWS Root user email address and password.
4. Repeat the above two steps to create and link
 a MTurk sandbox account https://requestersandbox.mturk.com/
(This is where you test your experiments)
5. Go to https://aws.amazon.com/ and log into your AWS account.
Click on your name and then `My Security Credentials`.
Click on `Get started wih IAM Users`.
Click on `Add User`.
6. Set up a user name and check `programmatic access`, and click `Next:Permissions`
7. Create a new group (e.g., name it `MTurk`), and check `AdministratorAccess` (Under `Policy name`)
8. Review and finish. In the end you should see a created user with an access key id and a secret access key (click `show`). Save them in a safe place. (**Important: Treat them as any other account numbers and passwords. Do NOT save them in a GitHub repo or anywhere publicly accessible!!!**)
9. Go to your bash profile (from Terminal: `open ~/.bash_profile` on most Macs), add the following two environment variables with your MTurk access key id and MTurk secret access key:

```
export MTURK_ACCESS_KEY=<YOUR MTURK ACCESS KEY>
export MTURK_SECRET=<YOUR MTURK SECRET>
```

## Git & GitHub
Git is a version-control system and GitHub is a platform to host your projects.

1. [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). You can read the rest of the linked tutorial to learn more about git.
2. [First time Git setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup): The main thing is to configure `user.name` and `user.email`
3. [Sign up for a GitHub account](https://github.com/)

### Experiment Template

1. Go to https://github.com/leylakursat/my_project and click on fork to have a fork of the `my_project` repository.
4. Open Terminal. 
5. For better organization, create a folder (e.g., `ling245b`) to place all the relevant course material. Cd into this folder `cd ling245b` and execute `git clone https://github.com/YOUR-USERNAME/my_project`. Now you have a a local clone of your fork (you should have a `my_project` folder inside your `ling245b` folder). 

This folder contains a simple experiment and will serve as an example to help you organize your experiment(s) and relevant files. 

### Putting your Experiment on the Web
In order to have your experiment as a frame within Mechanical Turk Window, it first has to be on the web. You can either host it on your Stanford Webspace or Github Pages. 

If you are just testing the setup and haven't made any changes to the experiment you can skip this step and use the following public HTTPS URL: https://leylakursat.github.io/my_project/experiments/01_experiment/experiment/index.html in the next step.

**To upload it to your Stanford Webspace** 

1. Open terminal. Type `ssh YOUR_SUNET_ID@cardinal` and hit enter. Go through the authentication procedure.  
2. Execute `ls WWW`. Unless you have already put things in your webspace, nothing should show up. If an error message appears, execute `mkdir WWW`.   
3. Open a new command line tab and go to the directory that contains your experiment `cd my_project/experiments/01_experiment`  
4. Execute `scp -r experiment YOUR_SUNET_ID@cardinal:~/WWW/` and go through the authentication procedure again.   
5. Now open `http://stanford.edu/~YOUR_SUNET_ID/experiment` in your browser. The experiment should show up!!    
	
**To host it on Github Pages** 
 
1. Open `https://github.com/USER_NAME/my_project` in your browser and click on Settings. Under GitHub Pages, change Source to `master branch` from `none`. 
2. Open `https://USERNAME.github.io/my_project/experiments/01_experiment/experiment/index.html`on your browser. The experiment should show up!

### Supersubmiterator
We use a tool called [supersubmiterator](https://github.com/sebschu/Submiterator) to post experiments to Amazon Mechanical Turk (written by Sebastian Schuster, original [submiterator](https://github.com/erindb/Submiterator) written by Dan Lassiter and Erin Bennett). Follow these steps to incorporate this tool into your experiment. 

1. From terminal, cd into your class folder `cd ling245b`
2. Execute `git clone https://github.com/sebschu/Submiterator.git`
3. If your default Python command is python2, change the first line of `supersubmiterator.py` to `#!/usr/bin/env python3`.)

Read the readme.md file in `Submiterator` to learn more about how supersubmiterator works and different options the tool supports. 

Follow the instructions in the readme.md file to make supersubmiterator a system wide command. This is important because you might want to run multiple experiments and this way you won't need to copy supersubmiterator.py everytime and you can run commands from any directory that contains a .config file.

## Testing in Sandbox

1. Go to the `01_experiment` folder inside your experiment template `cd my_project/experiments/01_experiment` and create a new folder called mturk `mkdir mturk`.
2. Go back to `Submiterator` folder and copy the `example.config` file to the new `mturk` folder you created
3. Cd into the mturk folder and open the `example.config` file
 - Make sure there is a line saying `"liveHIT":"no"`
 - Change line `"experimentURL":"https://www.stanford.edu/~you/path/to/experiment.html",` to the public HTTPS URL where your experiment is located.
 - Save and close the file.

2. Run the following command:

```
    supersubmiterator.py posthit example
```
This will return a message giving the URL to the experiment on MTurk, and generate a bunch of files in `mturk`.
The script stores the HIT's ID in the `example.success` file, so make sure not to delete this one before you have downloaded the results. If you're running an expensive experiment, it might make sense to backup this file.    
The name after `posthit` must match the name of the `.config` file that you created previously.

2. Go and work on the HIT in the workersand box by opening the URL on a browser. (For the first time, you may need to do some registration.)

3. To get the results run:  

```
    supersubmiterator.py getresults example   
```


## Unique Turker 

If you want to prevent people from taking multiple HITs, you will need a service called Unique Turker. 

1. On its web page https://uniqueturker.myleott.com/, fill in the Unique identifier you want to use (e.g., [name-myexperimentname]), leave `Max # HITs / worker` as 1, and then click on `Get Script`. You will see a block of JavaScript code, where there is a line `var ut_id = "[the-Unique identifier-you-chose]";`
Copy this Unique identifier for the next step.

2. Open the JavaScript file of your experiment, copy the following code to the beginning of the definition of `init()` (i.e., the line below `function init() {`)

```
 $(document).ready(function(){
   var ut_id = "<UNIQUE_TURKER_ID>";
   if (UTWorkerLimitReached(ut_id)) {
     $(".slide").hide();
     $("body").html("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
}});
```
Remember to change the line `var ut_id = "<UNIQUE_TURKER_ID>"` to what you got in Step 2.

3. In your HTML file, add the following code in between the `<head>` tags.
```
<script src="../shared/js/uniqueturker.js"></script>
```
(Make sure that this actually the right path to `uniqueturker.js` as you might have put or called things differently, e.g., you might have a `_shared/` folder instead.)
4. Now you should be all set, but **make sure to test everything in the sandbox before you post the real HITs**!
5. As long as you use the same Unique identifier, nobody can do the experiment again. If you are starting a completely different experiment, just get another Unique identifier (note that you must click on `Get Script` for the id to take effect).


## Install R & RStudio

R is a programming language widely used for statistical computing.
RStudio is a powerful IDE (Integrated Development Environment) we will be working with in this course.

1. [Install R](https://cran.cnr.berkeley.edu/)
2. [Install RStudio](https://www.rstudio.com/products/rstudio/download/)
3. Install the `tidyverse` package: Lauch RStudio and run in the console: `install.packages("tidyverse")`  
**(Note that quotes are needed when you install packages)**
4. You need to load the package before you can use it:
`library(tidyverse)`  
**(Note that there are NO quotes when you load packages)**  
If you see a list of attached packages (including `ggplot2`, `dplyr` etc) then everything is good. (Don't worry about the conflicts printed afterwards.)

# YOU ARE DONE WITH THE SET-UP!!!


## When coding your actual experiment..

1. Test your experiment locally by opening the .html file in a browser and making modifications to the html and js as needed. 
	- Use the Developer console for debugging (shortcut on Mac in Chrome: Cmd+option+j)
	- Make sure everything you want to record is getting recorded in the `log_responses` function. If you're not sure whether everything is getting recorded, you can click through to the end of the experiment and a gray box with all the information that will get sent to MTurk will be displayed. If you don't want to click all the way through, you can type `exp.go()` in the Developer console to get to the next block of the experiment (as specified in `exp.structure`).
2. Push your changes periodically to github.
3. Once satisfied with the experiment, push it to github.

## Running your experiment on MTurk

**Only do this once you're absolutely certain that your experiment runs and that you're recording all the information you need for your analyses!**

1. Load sufficient funds onto your MTurk requester account. Remember there's a 20% Amazon fee.
2. Change `liveHIT` from `no` to `yes` in your `.config` file and make sure that the `reward` and `numberofassignments` is set correctly.
3. Run the same series of `supersubmiterator` commands as above.

That's it!!

## MTurk-related things to keep in mind

- Post HITs on weekdays in the early morning to avoid noisy data.
- Sign up for accounts at Turkernation and/or Turkopticon to interact with Turkers or see how you are being rated.
- Generally try to make Turkers comfortable:
	- Include a progress bar in your experiment for a sense of how long the experiment will take. (By default the template comes with a built-in progress bar, but you'll have to make sure that `exp.nQs`, specified in the js file, is the right length, ie the length of the experiment in total number of trials, including instruction slides.)
	- Pay fairly.
	- Include clear (but concise) instructions. Turkers don't like to read a lot. 
