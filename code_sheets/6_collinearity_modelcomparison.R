# Collinearity & model evaluation
# created by jdegen on Jun 1, 2017

setwd("/Users/titlis/cogsci/projects/stanford/projects/LINGUIST245/")
library(lme4)
library(languageR)
library(lmerTest)
data(lexdec)
source("code_sheets/helpers.R")

#######################################
# An extreme example of collinearity:

# No significant effect of meanSize on RTs
m = lmer(RT ~ meanSize + (1|Word) + (1|Subject), data=lexdec, REML=F)
summary(m)

# No significant effect of meanWeight on RTs either
m = lmer(RT ~ meanWeight + (1|Word) + (1|Subject), data=lexdec, REML=F)
summary(m)

# If both are included in the model, there are large and highly significant counter-directed effects of the two predictors:
m = lmer(RT ~ meanWeight + meanSize + (1|Word) + (1|Subject), data=lexdec, REML=F)
summary(m)

# If we also include frequency, the effect disappears again
m = lmer(RT ~ meanWeight + meanSize + Frequency + (1|Word) + (1|Subject), data=lexdec, REML=F)
summary(m)

# Test for collinearity: 
# 1. Inspect correlation matrix -- if below .4, all is good
# 2. Compute variance inflation factor (VIF) -- if < 4, all is good
vif.mer(m) # ...we have a problem

# Let's investigate.
pairscor.fnc(lexdec[,c("RT","meanWeight","meanSize","Frequency")])

# The two predictors are highly correlated!
cor(lexdec$meanWeight,lexdec$meanSize)

# Let's visualize
ggplot(unique(lexdec[,c("meanWeight","Frequency","Word")]), aes(x=meanWeight,y=Frequency)) +
  geom_text(aes(label=Word))

#######################################

# Model comparison for dealing with collinearity
# Case study 1: Do model comparison for the models with meanWeight, meanSize, and Frequency (and sub-models), to determine which model is best.
m.full = lmer(RT ~ meanWeight + meanSize + Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.full)

m.1a = lmer(RT ~  meanSize + Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.1a)

m.1b = lmer(RT ~  meanWeight + Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.1b)

anova(m.1a, m.full)
anova(m.1b, m.full)

m.2 = lmer(RT ~  Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.2)

anova(m.2,m.1a) # the model with meanSize and frequency is better than the one with just frequency
anova(m.2,m.1b) # the model with meanWeight and frequency is better than the one with just frequency
# But we can't directly decide between the two!

summary(m.1a)$AICtab
summary(m.1b)$AICtab

# Case study 2: Use centering to handle collinearity between Length and Frequency
m = lmer(RT ~ Length * Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m)
vif.mer(m)

pairscor.fnc(lexdec[,c("RT","Length","Frequency")])

lexdec = cbind(lexdec, myCenter(lexdec[,c("Length","Frequency")]))
summary(lexdec)

pairscor.fnc(lexdec[,c("RT","Length","Frequency","cLength","cFrequency")])

m = lmer(RT ~ cLength * cFrequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m)

m.1 = lmer(RT ~ cLength + cFrequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.1)

m.2 = lmer(RT ~ Length + Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.2)

#######################################

# Model validation
lexdec$Fitted = fitted(m.full)
(cor(lexdec$RT,lexdec$Fitted))^2 # simple, but not quite correct way of computing R^2 value for mixed effects model (does not take into account structure introduced by random effects -- see also this blog post https://jonlefcheck.net/2013/03/13/r2-for-linear-mixed-effects-models/)

# To compute marginal R^2 (variance explained by fixed effects) and conditional R^2 (variance explained by fixed and random effects):
install.packages("piecewiseSEM")
library(piecewiseSEM)

sem.model.fits(m.full) # Conditional R^2 is somewhat lower than R^2 computed without taking into account random effects



