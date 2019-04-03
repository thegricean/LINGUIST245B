# Software installation for Linguist 245 (Spr 2018)

## Install Python 2 & Java

In this course we will not directly program in Python or Java, but some software we use depends on them, so make sure you [have installed Python 2](https://www.python.org/downloads/release/python-2714/) (**even if you have installed Python 3, as it is not backward compatible!**).
Type in the terminal `python`. It should open an interactive interpreter and you can see the  version of Python. If it shows Python 3, it might be because you have both versions installed, in which case type in the terminal `python2` instead of `python` (type `exit()` to close the interpreter first).

As for Java, download and install Java Runtime Environment (JRE) from: http://www.oracle.com/technetwork/java/javase/downloads/index.html  
(You need to install JAVA 8 or above)

After installation, type in the terminal `java -version` to make sure that everything is working.

## Amazon MTurk Setup

Amazon Mechanical Turk (MTurk) is a crowdsourcing platform well suited for running web-based experiments.

1.    Create an Amazon Web Services (AWS) account at https://aws-portal.amazon.com/gp/aws/developer/registration/index.html (create an individual account)
2.    Sign up for an Amazon Mechanical Turk Requester account at the https://requester.mturk.com/.
3.    Now you will link your AWS Account and your MTurk Requester Account. Open https://requester.mturk.com/developer, and click `Link your AWS Account`. Then sign-in with your AWS Root user email address and password.
4. Repeat the above two steps to create and link
 a MTurk sandbox account
 https://requestersandbox.mturk.com/
(This is where you test your experiments)
5. Go to https://aws.amazon.com/ and log into your AWS account.
Click on your name and then `My Security Credentials`.
Click on `Get started wih IAM Users`.
Click on `Add User`.
6. Set up a user name and check `programmatic access`, and click `Next:Permissions`
7. Create a new group (e.g., name it `MTurk`), and check `AdministratorAccess` (Under `Policy name`)
8. Review and finish, in the end you should see a created user with an Access key ID and a
Secret access key (click `show`). Save them in a safe place. (**Important: Treat them as any other account numbers and passwords. Do NOT save them in a GitHub repo or anywhere publicly accessible!!!**)

1.    Download and unzip Amazon Mechanical Turk Command Line Tools from https://requester.mturk.com/developer/tools/clt

2.  Now there should be a folder `aws-mturk-clt-...`. Find the `/bin` directory inside this folder and there should be a file called `mturk.properties`. Open this file in a text editor.
3.  There should be lines
```
access_key=[insert your access key here]
secret_key=[insert your secret key here]
```
Paste the keys from the previous step in the place of the placeholders.

4. Save the file. (**Important: This file now contains your secret key, and anyone having this file can post HITs in your name. Do NOT save this in a GitHub repo or anywhere publicly accessible. For maximum security, it might be reasonable to remove the keys once you're done and generate new keys when you do your next experiment.**)

## Git & GitHub

Git is a version-control system and GitHub is a platform to host your projects.

1. [Install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). You can read the rest of the linked tutorial to learn more about git.
2. [First time Git setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup): The main thing is to configure `user.name` and `user.email`
3. [Sign up for a GitHub account](https://github.com/)

(For better organization, from now on you may want to create a folder (e.g., `ling245all`) to place all the relevant course material.)

1. Open the terminal and cd into `ling245all`. Execute  
```
git clone https://github.com/feste/Submiterator.git
```

2. There should now be a folder `Submiterator`.
Open the `example.config` file inside it, make sure there is a line saying `"liveHIT":"no",`, and then change line  
`"experimentURL":"https://www.stanford.edu/~you/path/to/experiment.html",` into   `"experimentURL":"https://ciyang.github.io/experiment_template",`.  
Save and close the file.

3. Run the following commands:
```
export MTURK_CMD_HOME=PATH_WHERE_YOU_HAVE_UNZIPPED_AWS_CLT/aws-mturk-clt-1.3.4
export JAVA_HOME=PATH_OF_YOUR_JAVA_RUNTIME_ENVIRONMENT
```

The first one tells the Python script where to look for the AWS Command Line Tools, the second one makes sure the Java programs contained in it can be executed (you may find this useful https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/).

3. Open the command line and navigate into the `Submiterator` directory. Run the following command (or use `python2` explicitly)
```
    python submiterator.py posthit example
```
This will return a message giving the URL to the experiment on MTurk, and generate a bunch of files.
The script stores the HIT's ID in the `example.success` file, so make sure not to delete this one before you have downloaded the results. If you're running an expensive experiment, it might make sense to backup this file.
The name after `posthit` must match the name of the `.config` file that you created previously.

4. It should tell you where the HIT is. Go and work on the HIT in the workersand box. (For the first time, you may need to do some registration.)

4. To get the results:
```
    python submiterator.py getresults example
```

5. To get a list of results by trials, run
```
    python submiterator.py reformat example
```

6. (N.B. This will only work on unix.)
If you want, you can make submiterator a system-wide command, so you can just type (for example):  
```
submiterator posthit example
submiterator getresults example
submiterator reformat example
```
To do this, run the following command:
```
chmod u+x submiterator.py
```
Then make a directory called "bin" in your home folder and make sym-links to the Submiterator file:  
```
cd ~
mkdir bin
cd bin
ln -s [PATH_TO_SUBMITERATOR_DIRECTORY]/submiterator.py submiterator
```
Then open up or create the file .bash_profile or .bashrc in your home directory and add the following line:
```
PATH=$PATH:~/bin
```
Then once you open up a new terminal, you should be able to use the submiterator command as above.


## Install R & RStudio

R is a programming language widely used for statistical computing.
RStudio is a powerful IDE (Integrated Development Environment) we will be working with
in this course.

1. [Install R](https://cran.cnr.berkeley.edu/)
2. [Install RStudio](https://www.rstudio.com/products/rstudio/download/)
3. Install the `tidyverse` package: Lauch RStudio and run in the console: `install.packages("tidyverse")`  
**(Note that quotes are needed when you install packages)**
4. You need to load the package before you can use it:
`library(tidyverse)`  
**(Note that there are NO quotes when you load packages)**  
If you see a list of attached packages (including `ggplot2`, `dplyr` etc) then everything is good. (Don't worry about the conflicts printed afterwards.)

# Using submiterator-batch with Unique Turker

1. Clone the submiterator-batch repo
```
git clone https://github.com/mhtess/submiterator-batch
```
and follow the instructions in its README file. Crucially, make sure that
you have submiterator as a system-wide command (i.e., check whether you can use `submiterator posthit [yourexperimentconfigfilename]`) properly).

2. You can use submiterator-batch to post batches of HITs, but if you want to prevent people from taking multiple HITs, you will need to another service called Unique Turker. On its web page https://uniqueturker.myleott.com/, fill in the Unique identifier you want to use (e.g., [name-myexperimentname]), leave `Max # HITs / worker` as 1, and then click on `Get Script`. You will see a block of JavaScript code, where there is a line `var ut_id = "[the-Unique identifier-you-chose]";`
Copy this Unique identifier for the next step.

3. Open the JavaScript file of your experiment, copy the following code to the beginning of the definition of `init()` (i.e., the line below `function init() {`)
```
repeatWorker = false;
(function(){
  var ut_id = "[the-Unique identifier-you-chose]";  // remember to replace this!
  if (UTWorkerLimitReached(ut_id)) {
    $('.slide').empty();
    repeatWorker = true;
    alert("You have already completed the maximum number of HITs allowed by this requester. Please click 'Return HIT' to avoid any impact on your approval rating.");
  }
})();
```
Remember to change the line `var ut_id = [the-Unique identifier-you-chose]` to what you got in Step 2.
4. In your HTML file, add the following code in between the `<head>` tags.
```
<script src="../shared/js/uniqueturker.js"></script>
```
(Make sure that this actually the right path to `uniqueturker.js` as you might have put or called things differently, e.g., you might have a `_shared/` folder instead.)
5. Now you should be all set, but **make sure to test everything in the sandbox before you post the real HITs**!
6. As long as you use the same Unique identifier, nobody can do the experiment again. If you are starting a completely different experiment, just go get another Unique identifier (note that you must click on `Get Script` for the id to take effect).  