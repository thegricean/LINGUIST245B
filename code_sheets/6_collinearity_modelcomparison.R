# Collinearity & model evaluation
# created by jdegen on Jun 1, 2017
# modifiied by jdegen on Jun 4, 2020

library(tidyverse)
library(lme4)
library(languageR)
library(MuMIn)

source("helpers.R")

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

## DEALING WITH COLLINEARITY

# Good news: estimates are only problematic for the collinear predictors
# If collinearity is in the control/nuisance predictors, nothing needs to be done
# Somewhat good news: if collinear predictors are of interest but we’re not interested in effect direction, we can use model comparison to decide which predictor, if any, to include
# If collinear predictors are of interest and we are interested in direction of effect, we need to reduce collinearity

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


## REDUCING COLLINEARITY
# 3 options:
# - center predictors
# - re-express variable based on conceptual considerations (not always applicable)
# - residualize -- regress collinear predictor against (combination of) correlated predictor(s)

# Case study 2: Use centering to handle collinearity between Length and Frequency
m = lmer(RT ~ Length * Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m)
vif.mer(m)

pairscor.fnc(lexdec[,c("RT","Length","Frequency")])

lexdec = cbind(lexdec, myCenter(lexdec[,c("Length","Frequency")]))
summary(lexdec)

m = lmer(RT ~ cLength * cFrequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m)

# Is significance of main effects in main-effects-only model impacted by centering?
m.1 = lmer(RT ~ cLength + cFrequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.1)

m.2 = lmer(RT ~ Length + Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.2)

#######################################

# Model validation
lexdec$Fitted = fitted(m.full)

ggplot(lexdec, aes(x=Fitted,y=RT)) +
  geom_point() +
  geom_smooth()

# overall correlation between predicted and actual RTs:
cor(lexdec$Fitted,lexdec$RT)

# To compute marginal R^2 (variance explained by fixed effects) and conditional R^2 (variance explained by fixed and random effects):
r.squaredGLMM(m) 
# marginal R^2 (variance explained by fixed effects): .06
# conditional R^2 (variance explained by fixed and random effects jointly): .49
