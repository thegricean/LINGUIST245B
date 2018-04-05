# git/github tutorial

This code sheet demonstrates the basics of how to create a github repository, clone it, add / change files, and merge those changes back into the repository.

## Common commands

For better organization, you may want to place all the relevant course material in a folder (e.g., `ling245all`. If you have followed the software installation guide, this is the folder where Submiterator is.)

```
cd /PATH_TO_WHERE_THE_FOLDER_IS/ling245all
```


Clone into the LINGUIST245 repo. (You only need to do this once.)

```
git clone https://github.com/thegricean/LINGUIST245.git
```

Navigate into the repo.

```
cd LINGUIST245
```

What's there so far?

```
ls
```

Create a project directory to put your documents in. I'll name mine "judith". Inside the project directory, create a README.md file with a brief description of what the directory contains.

Check the status of the files in your directory.

```
git status
```

Add your new file to the git tree so it gets tracked.

```
git add judith/README.md
```

Or, to add everything in the current directory:

```
git add .
```

Check the status of the files in your directory again.

```
git status
```

The file is now in the staging area (i.e., git is aware it exists). Commit your change. Always provide an intuitive commit message!

```
git commit judith/README.md -m "added project readme"
```

Your change is now committed and is ready to be pushed. But first, let's make another change. In your project directory, create new directories named "data" and "experiment". Include a README.md in each one that includes information on what the directory contains. Add and commit your files.

You've made a lot of changes. Have a look at what you did.

```
git log
```

Check the status of the files in your directory again.

```
git status
```

You have a number of files ready to be merged into the master branch. Do it!

```
git push
```

Read the error message you got and we'll go from there :)

**BIG WORD OF WARNING: DON'T EVER UPLOAD NON-ANONYMIZED DATA!** The best way to avoid accidentally doing this is by specifying a .gitignore file and consistently naming data files that have non-anonymized data in them.

## Forking

If you do not have permission to edit a repo, then you will not be able to push your changes to GitHub.
In this case, you should fork the repo, which means you are making your own copy on GitHub. This allows you to maintain any further changes separately. (And if you want the owner of the original repo to integrate some of your changes, you can submit a pull request, but we will not need this for the course.)

For example, you can make use of the experiment template as a starting point to build your own experiment.

1. Go to https://github.com/Ciyang/experiment_template
and click on the "Fork" button on the top right corner.
After a while, you should see that you now have a copy as your own repo.

2. Go to "settings," change the name to ling245exp, and click "rename".

3. Go to "settings" again, scroll down to the "GitHub Pages" section, choose "master branch" as Source.

4. It will tell you `"Your site is ready to be published at https://[your-github-username].github.io/ling245exp/"`
However, if you click on the link right away, you will likely see a 404 error. Don't worry, try `https://[your-github-username].github.io/ling245exp/index.html` instead. If you can see the experiment, everything is fine. (Using GitHub Pages is just an easy way to have a publicly accessible place to host your experiment, since you are probably using GitHub for version control anyways. However, you can also use your Stanford web space or anything else that works for you.)

5. Now, clone this repo to your computer (again, under ling245all: use `pwd` to check where you are and `cd` into the ling245all folder before executing the command)  
`git clone https://github.com/[your-github-username]/ling245exp.git`  
Now there should be a new folder called ling245exp


**Do not make any changes to any existing files.** Next week we will create our own HTML/CSS/Javascript files for our projects.
