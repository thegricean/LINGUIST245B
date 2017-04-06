# git/github tutorial

This code sheet demonstrates the basics of how to clone into a repository, add / change files, and merge those changes back into the repository.

## Common commands

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

Read the error message you got and we'll got from there :)

**BIG WORD OF WARNING: DON'T EVER UPLOAD NON-ANONYMIZED DATA!** The best way to avoid accidentally doing this is by specifying a .gitignore file and consistently naming data files that have non-anonymized data in them.