# Mixed effects logistic regression
# created by jdegen on May 16, 2017
setwd("/Users/titlis/cogsci/projects/stanford/projects/LINGUIST245/")
library(lme4)
library(languageR)

str(dative)

m = glmer(RealizationOfRecipient ~ PronomOfRec + AnimacyOfRec + LengthOfRecipient + AccessOfTheme + (1|Speaker) + (1|Verb), data=dative, family="binomial")
summary(m)

d = read.csv("data/tvj-qud.csv")
head(d)

# CONTINUE HERE: FIND DIFFERENT DATASET (WITH MORE DATA) -- USE THE SCALAR IMPLICATURE CORPUS DATASET AND BIN DATA INTO SI/NO-SI

# What's the distribution of true/false responses?
table(d$Response)
prop.table(table(d$Response))

# Recall that R by default interprets factor levels in alphanumeric order:
contrasts(d$Response)

# We start with a simple model. The syntax is the same as in the linear model, but we use the function glmer(). The only difference is the outcome variable and the family (assumed noise distribution) now is binomial.
m = glmer(Response ~ (1|workerid), family="binomial", data=d)
summary(m)

m = glmer(Response ~ QUD + (1|workerid), family="binomial", data=d)
summary(m)

m = glmer(Response ~ QUD+SetSize + (1|workerid), family="binomial", data=d)
summary(m)

# 1. What is the interpretation of the coefficients?

# If we want to instead get the intercept for the grand mean, we need to center frequency first:
source("code_sheets/helpers.R")
centered = cbind(lexdec,myCenter(lexdec[,c("Frequency","NativeLanguage","FamilySize")]))
head(centered)
summary(centered)

m = glmer(Correct ~ cFrequency + (1|Subject) + (1|Word), family="binomial", data=centered)
summary(m)

# We can add additional predictors just as in the linear model
m = glmer(Correct ~ Frequency * NativeLanguage + FamilySize + (1|Subject) + (1|Word), family="binomial", data=lexdec)
summary(m)

m = glmer(Correct ~ cFrequency * cNativeLanguage + cFamilySize + (1|Subject) + (1|Word), family="binomial", data=centered)
summary(m)
