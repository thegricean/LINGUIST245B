# Data wrangling in the R tidyverse
# Created by jdegen on May 11, 2017
# Modified by jdegen on May 14, 2020
# Modified by jdegen on May 15, 2021

# Set working directory to directory of script
this.dir <- dirname(rstudioapi::getSourceEditorContext()$path)
setwd(this.dir)

#Load necessary packages
library(tidyverse)
library(lme4)

# This code sheet includes only a tiny fraction of all the powerful functions for reshaping and summarizing data included in the tidyverse. For tidy overviews, see the comprehensive tidyverse cheat sheets: https://rstudio.com/resources/cheatsheets/ The most relevant for data wrangling is the one on "Data Transformation with dplyr": https://github.com/rstudio/cheatsheets/raw/master/data-transformation.pdf

# Load datasets. R will automatically read the contents of these files into tibbles (which are tidyverse versions of data.frames).
wide = read_csv("../data/lexdec_wide.csv")
head(wide)
summary(wide)

wordinfo = read_csv("../data/wordinfo.csv")
head(wordinfo)
summary(wordinfo)

# If your data isn't comma-separated, you can use read_delim() instead
wd = read_delim("../data/wordinfo.csv",delim=",")
head(wd)

# In order to conduct our regression analysis, we need to
# a) get wide into long format
# b) add word info (frequency, family size).

# We can easily switch between long and wide format using the pivot_longer() and pivot_wider() functions from the tidyr package. See the data import cheat sheet: https://github.com/rstudio/cheatsheets/raw/master/data-import.pdf
# Note: instead of gather(), consider using pivot_longer(), and instead of sprea(), pivot_wider()
long = wide %>%
  pivot_longer(cols=!c("Subject","Sex","NativeLanguage"),names_to="Word",values_to="RT") %>%
  arrange(Subject)
View(long)

# We just sorted the resulting long format by Subject. Sort it by Word instead:
long = wide %>%
  pivot_longer(cols=!c("Subject","Sex","NativeLanguage"),names_to="Word",values_to="RT") %>%
  arrange(Word)
View(long)


# To convert back to wide format
newwide = long %>%
  pivot_wider(names_from = "Word", values_from="RT")
head(newwide)

# We can add word level information to the long format using left_join(), see the data transformation cheat sheet: https://github.com/rstudio/cheatsheets/raw/master/data-transformation.pdf
lexdec = left_join(long,wordinfo,by=c("Word"))
head(lexdec)
nrow(lexdec)

# Are we sure the data.frames got merged correctly? Let's inspect a few cases.
wordinfo[wordinfo$Word == "almond",]
lexdec[lexdec$Word == "almond",]

# Convince yourself that the information got correctly added by testing a few more cases:



# Turn Subject and Word into factor variables rather than character variables
lexdec = lexdec %>%
  mutate(Subject = as.factor(Subject),Word = as.factor(Word))

# If we want to turn all character variables into factors:
lexdec = lexdec %>%
  mutate_if(is.character,as.factor)

# Success! We are ready to run our mixed effects models. What should the random effects structure look like for the following fixed effects?
m = lmer(RT ~ Frequency*NativeLanguage +  (1+Frequency|Subject) + (1+NativeLanguage|Word) , data=lexdec, REML=F)
summary(m)

# How do we handle these error messages?
#- de-correlate random effects
#- center fixed effects
#- drop random effects terms
# More information under ?convergence or here: https://bbolker.github.io/mixedmodels-misc/glmmFAQ.html#convergence-warnings

# De-correlate random effects:
m = lmer(RT ~ Frequency*NativeLanguage + (1|Subject)  + (0+Frequency|Subject) + (1|Word) + (0+NativeLanguage|Word) , data=lexdec, REML=F)
summary(m)

# Center predictors:
lexdec = lexdec %>%
  mutate(cFrequency = Frequency - mean(Frequency),cNativeLanguage = as.numeric(NativeLanguage) - mean(as.numeric(NativeLanguage)))

m.c = lmer(RT ~ cFrequency*cNativeLanguage + (1|Subject)  + (0+cFrequency|Subject) + (1|Word) + (0+cNativeLanguage|Word) , data=lexdec, REML=F)
summary(m.c)


# Often, we'll want to summarize information by groups. For example, if we want to compute RT means by subject:
subj_means = lexdec %>%
  group_by(Subject) %>%
  summarize(Mean = mean(RT))
subj_means

# Compute RT means by Word instead:
subj_means = lexdec %>%
  group_by(Word) %>%
  summarize(Mean = mean(RT))
subj_means

# Compute RT means only for the non-native group:
subj_means = lexdec %>%
  filter(NativeLanguage == "Other") %>%
  group_by(Subject) %>%
  summarize(Mean = mean(RT),SD = sd(RT))
subj_means


# Sometimes we want to save data.frames/tibbles or R console output to a file. For example, we might want to save our newly created lexdec dataset:
write_csv(lexdec,path="../data/lexdec_long.csv")

# We can also save the console output to a file (for example, if you've run a particularly time-consuming regression analysis you may want to save the model results). 
out = capture.output(summary(m))
out
cat("My model results","","", out, file="../data/modeloutput.txt", sep="\n")

# If you want to save the model directly for future use:
save(m,file="../data/mymodel.RData")

# You can later reload the model using load()
load("../data/mymodel.RData")

# Why was "mymodel.RData" a poorly chosen name for the file? Choose a better name.

