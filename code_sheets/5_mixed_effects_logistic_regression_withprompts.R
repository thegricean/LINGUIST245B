# Mixed effects logistic regression
# created by jdegen on May 25, 2017
# modified by jdegen on May 25, 2023

library(tidyverse)
library(lme4)
library(languageR)
library(brms)

# set working directory to directory of script
setwd(dirname(rstudioapi::getSourceEditorContext()$path))

# The dative alternation dataset from Bresnan et al. 2007
data(dative)
summary(dative)
names(dative)

# What's the distribution of responses?
table(dative$RealizationOfRecipient)
prop.table(table(dative$RealizationOfRecipient))

# Recall that R by default interprets factor levels in alphanumeric order, so the model will predict the log odds of the recipient being realized as a PP (prepositional object) over an NP
contrasts(dative$RealizationOfRecipient)

# We start with a simple logistic regression model (no random effects). The syntax is the same as in the linear model, but we use the function glm(). The only difference is that the assumed noise distribution is binomial.
m.norandom = glm(RealizationOfRecipient ~ 1, data=dative, family="binomial")
summary(m.norandom)

# 1. What is the interpretation of the intercept coefficient?


# What if we want to convert this back into probability space? First we define the function that takes a log odds ratio and turns it into a probability. 
logit2prob <- function(l){
  exp(l)/(1+exp(l))
  }

# 2. Use the logit2prob function to find out the probability of a PP realization. You can also use the built-in plogis() function.


# Let's add a random effect (verb intercept). There is clearly a lot of by-verb variability:
table(dative$Verb,dative$RealizationOfRecipient)

# Note the use of glmer() instead of glm() for mixed effects. We again specify the binomial noise distribution.
m = glmer(RealizationOfRecipient ~ 1 + (1|Verb), data=dative, family="binomial")
summary(m)

# 3. How does the overall intercept change? Convert this back into probability space. What was the effect of adding random by-verb variability?


# Let's test whether animacy of the recipient affects its realization. First, get an intuitive sense of the distribution as a function of recipient animacy:
table(dative[,c("AnimacyOfRec","RealizationOfRecipient")])
prop.table(table(dative[,c("AnimacyOfRec","RealizationOfRecipient")]),mar=c(1))

m = glmer(RealizationOfRecipient ~ AnimacyOfRec + (1|Verb), data=dative, family="binomial")
summary(m)

# 4. What is the interpretation of the coefficients?


# If we want to get the intercept for the grand mean, we need to center animacy first:
dative = dative %>%
  mutate(numAnimacyOfRec = as.numeric(AnimacyOfRec)) %>%
  mutate(cAnimacyOfRec = numAnimacyOfRec - mean(numAnimacyOfRec),cLengthOfRecipient = LengthOfRecipient - mean(LengthOfRecipient))
summary(dative)

m.c = glmer(RealizationOfRecipient ~ cAnimacyOfRec + (1|Verb), data=dative, family="binomial")
summary(m.c)
# How would you report this result? 

# We can conduct multivariate regression (add additional predictors) just as in the linear model
m.c = glmer(RealizationOfRecipient ~ cAnimacyOfRec + cLengthOfRecipient + (1|Verb), data=dative, family="binomial")
summary(m.c)

# To get model predictions
dative$PredictedRealization = predict(m)
head(dative)

# Let's turn the predictions into probabilities
dative$PredictedProbRealization = plogis(dative$PredictedRealization)
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

# You could report the result of the model in line 66 as: "There was a main effect of animacy (beta=1.44, SE=0.16, p<.0001) such that inanimate recipients were more likely to be realized as PPs than animate recipients."

# Trouble-shooting: You may get model convergence warnings. You can look for guidance on convergence within RStudio by typing ?convergence in the console. Here is an external trouble-shooting guide: https://rstudio-pubs-static.s3.amazonaws.com/33653_57fc7b8e5d484c909b615d8633c01d51.html

# And, as ever, we can run the same models the Bayesian way:
m.b = brm(RealizationOfRecipient ~ cAnimacyOfRec + cLengthOfRecipient + (1|Verb), 
          data=dative, 
          family=bernoulli(link = "logit"),
          cores=4)
summary(m.b)
plot(m.b)
