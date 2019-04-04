# git/github tutorial

This code sheet demonstrates the basics of how to clone and fork a github repository, add / change files, and merge those changes back into the repository.

## Common commands

For better organization, you may want to place all the relevant course material in a folder (e.g., `ling245b`. 

```
cd /PATH_TO_WHERE_THE_FOLDER_IS/ling245b
```


Clone into the LINGUIST245B repo. (You only need to do this once.)

```
git clone https://github.com/thegricean/LINGUIST245B.git
```

Navigate into the repo.

```
cd LINGUIST245B
```

What's there?

```
ls
```

If you do not have permission to edit a repo, then you will not be able to push your changes to GitHub. For your project, you'll want to have a separate folder, parallel to LINGUIST245B. But you probably don't want to start coding your entire experiment from scratch, so we're providing an experiment template and a project directory structure that works for organizing files. You'll want to **fork** the example project repo we're providing. This means you are making your own copy on GitHub. This allows you to maintain any further changes separately. (And if you want the owner of the original repo to integrate some of your changes, you can submit a pull request, but we will not need this for the course.)

Go to https://github.com/thegricean/my_project
and click on the "Fork" button on the top right corner. This will generate a copy of the repo under your own account.

Go to the new repo under your own account, go to "Settings," change the name to whatever you want your project to be named (e.g., "fine_replication"), and click "Rename".

Now, clone this repo to your computer parallel to the LINGUIST245B repo (use `pwd` to check where you are):  
`git clone https://github.com/[your-github-username]/[your-project-name].git`  

There should now be a new folder called [your-project-name]. Navigate into that directory


Check the status of the files in your directory.

```
git status
```

In your favorite editor, create a new file `README.md` that briefly describes what is in this folder.

Add your new file to the git tree so it gets tracked.

```
git add README.md
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
git commit -m "added project readme"
```

Your change is now committed and is ready to be pushed. 

Whenever you want to see what changes you made:

```
git log
```

You have a file ready to be merged into the master branch. Do it:

```
git push
```

Congratulations, your first change is officially pushed to your github repo!

**BIG WORD OF WARNING: DON'T EVER UPLOAD NON-ANONYMIZED DATA!** The best way to avoid accidentally doing this is by specifying a .gitignore file and consistently naming data files that have non-anonymized data in them.


# Publishing your experiment as a github website

Go to "Settings" in your project repo, scroll down to the "GitHub Pages" section, choose "master branch" as Source.

It will tell you `"Your site is ready to be published at https://[your-github-username].github.io/[your-project-name]/"`
However, if you click on the link right away, you will likely see a 404 error. Don't worry, try `https://[your-github-username].github.io/[your-project-name]/index.html` instead. If you can see the experiment, everything is fine. (Using GitHub Pages is just an easy way to have a publicly accessible place to host your experiment, since you are probably using GitHub for version control anyways. However, you can also use your Stanford web space or anything else that works for you.)









