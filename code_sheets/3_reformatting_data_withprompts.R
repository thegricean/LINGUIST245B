# Data wrangling in the R tidyverse
# Created by jdegen on May 11, 2017

setwd("/Users/titlis/cogsci/projects/stanford/projects/LINGUIST245/")
install.packages("tidyverse")
library(tidyverse)

# Load datasets. R will automatically read the contents of these files into data.frames.
wide = read.csv("data/lexdec_wide.csv")
head(wide)
wordinfo = read.csv("data/wordinfo.csv")
head(wordinfo)

# If your data isn't comma-separated, you can use read.table() instead
wi = read.table("data/wordinfo.csv",sep=",",header=T)
head(wi)

# In order to conduct our regression analysis, we need to
# a) get wide into long format
# b) add word info (frequency, family size).

# We can easily switch between long and wide format using the gather() and spread() functions from the tidyr package.
long = wide %>%
  gather(Word,RT,-Subject,-Sex,-NativeLanguage) %>%
  arrange(Subject)
head(long)

# 1. We just sorted the resulting long format by Subject. Sort it by Word instead.
...

# To convert back to wide format
newwide = long %>%
  spread(Word,RT)
head(newwide)

# We can add word level information to the long format using inner_join() -- see also the data transformation cheat sheet: https://github.com/rstudio/cheatsheets/raw/master/source/pdfs/data-transformation-cheatsheet.pdf
lexdec = inner_join(long,wordinfo,by=c("Word"))
head(lexdec)
nrow(lexdec)

# Are we sure the data.frames got merged correctly? Let's inspect a few cases.
wordinfo[wordinfo$Word == "almond",]

# 2. Convince yourself that the information got correctly added by testing a few more cases.
...

# Success! We are ready to run our mixed effects models.
m = lmer(RT ~ Frequency*NativeLanguage + FamilySize + (1 + Frequency + FamilySize | Subject) + (1 + NativeLanguage | Word), data=lexdec)
summary(m)

# Often, we'll want to summarize information by groups. For example, if we want to compute RT means by subject:
subj_means = lexdec %>%
  group_by(Subject) %>%
  summarize(Mean = mean(RT))

# 3. Compute RT means by Word instead.
...

# Sometimes we want to save data.frames or R console output to a file. For example, we might want to save our newly created lexdec dataset:
write.csv(lexdec,file="data/lexdec_long.csv")

# 4. Using the R help, figure out how to suppress the row.names and the quotes in the output and re-write the file.
...

# We can also save the console output to a file (for example, if you've run a particularly time-consuming regression analysis you may want to save the model results). 
out = capture.output(summary(m))
out
cat("My awesome results","","", out, file="data/modeloutput.txt", sep="\n")

# If you want to save the model directly for future use:
save(m,file="data/mymodel.RData")

# You can later reload the model using load()
load("data/mymodel.RData")

# 5. Why was "mymodel.RData" a poorly chosen name for the file? Choose a better name.
...