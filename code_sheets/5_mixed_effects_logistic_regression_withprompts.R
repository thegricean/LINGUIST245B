# Mixed effects logistic regression
# created by jdegen on May 25, 2017
# modified by jdegen on May 23, 2018

library(tidyverse)
library(lme4)
library(languageR)

# The dative alternation dataset from Bresnan et al. 2007
data(dative)
summary(dative)
names(dative)

# What's the distribution of true/false responses?
table(dative$RealizationOfRecipient)
prop.table(table(dative$RealizationOfRecipient))

# Recall that R by default interprets factor levels in alphanumeric order, so the model will predict the log odds of the recipient being realized as a PP (prepositional object) over an NP
contrasts(dative$RealizationOfRecipient)

# We start with a simple logistic regression model (no random effects). The syntax is the same as in the linear model, but we use the function glm(). The only difference is that the assumed noise distribution is binomial.
m.norandom = glm(RealizationOfRecipient ~ 1, data=dative, family="binomial")
summary(m.norandom)

# 1. What is the interpretation of the intercept coefficient?


# What if we want to convert this back into probability space? First we define the function that takes a log odds ratio and turns it into a probability.
logit2prop <- function(l){
  exp(l)/(1+exp(l))
  }

# 2. Use the logit2prop function to find out the probability of a PP realization


# Let's add a random effect (verb intercept). There is clearly a lot of by-verb variability:
table(dative$Verb,dative$RealizationOfRecipient)

# Note the use of glmer() instead of glm() for mixed effects. We again specify the binomial noise distribution.
m = glmer(RealizationOfRecipient ~ 1 + (1|Verb), data=dative, family="binomial")
summary(m)

# 3. How does the overall intercept change? Convert this back into probability space. What was the effect of adding random by-verb variability?


# Let's add a predictor.
table(dative[,c("AnimacyOfRec","RealizationOfRecipient")])
prop.table(table(dative[,c("AnimacyOfRec","RealizationOfRecipient")]),mar=c(1))

m = glmer(RealizationOfRecipient ~ AnimacyOfRec + (1|Verb), data=dative, family="binomial")
summary(m)

# 4. What is the interpretation of the coefficients?


# If we want to get the intercept for the grand mean, we need to center animacy first:
source("helpers.R")
centered = cbind(dative,myCenter(dative[,c("AnimacyOfRec","LengthOfRecipient")]))
head(centered)
summary(centered)

m.c = glmer(RealizationOfRecipient ~ cAnimacyOfRec + (1|Verb), data=centered, family="binomial")
summary(m.c)

# We can add additional predictors just as in the linear model
m.c = glmer(RealizationOfRecipient ~ cAnimacyOfRec + cLengthOfRecipient + (1|Verb), data=centered, family="binomial")
summary(m.c)

# To get model predictions
dative$PredictedRealization = predict(m)
head(dative)

# Let's turn the predictions into probabilities
dative$PredictedProbRealization = logit2prop(dative$PredictedRealization)
head(dative)

# Now let's turn them into actual categorical predictions
dative$PredictedCatRealization = ifelse(dative$PredictedProbRealization < .5, "NP", "PP")
head(dative)

# How well do predicted and actual realization match?
head(dative[,c("RealizationOfRecipient","PredictedCatRealization")],70)
prop.table(table(dative[,c("RealizationOfRecipient","PredictedCatRealization")]))

# Compute the proportion of correctly predicted cases
dative$Prediction = ifelse(dative$RealizationOfRecipient == dative$PredictedCatRealization,"correct","incorrect")
table(dative$Prediction)
prop.table(table(dative$Prediction))

