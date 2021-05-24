# Collinearity & model evaluation
# created by jdegen on Jun 1, 2017
# modifiied by jdegen on Jun 4, 2020
# modifiied by jdegen on May 24, 2021

library(tidyverse)
library(lme4)
library(languageR)
library(MuMIn)

this.dir <- dirname(rstudioapi::getSourceEditorContext()$path)
setwd(this.dir)

source("helpers.R")

#######################################
# COLLINEARITY

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

#######################################
# DEALING WITH COLLINEARITY

# Good news: estimates are only problematic for the collinear predictors
# If collinearity is in the control/nuisance predictors, nothing needs to be done
# Somewhat good news: if collinear predictors are of interest but we’re not interested in effect direction, we can use model comparison to decide which predictor, if any, to include
# If collinear predictors are of interest and we are interested in direction of effect, we need to reduce collinearity

#######################################
# MODEL COMPARISON FOR DEALING WITH COLLINEARITY
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

#######################################
# REDUCING COLLINEARITY
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
# MODEL VALIDATION

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

#######################################
# CONVERGENCE ISSUES

m = lmer(RT ~ Length * Frequency * NativeLanguage + (1+Length * Frequency|Subject) + (1+NativeLanguage|Word), data=lexdec, REML=F)
summary(m)

# Uh-oh -- model failed to converge! Why, and what do we do about it?
# 1. Large differences in the scales of parameters often lead to problems (especially with calculating standard deviations of fixed effects). Centering and scaling (dividing a predictor's values by its standard deviation) can help. The scale() function does both -- if you want to just center, or just scale, set one of the parameters to FALSE. Note: scale() doesn't work for factors, so you'll have to convert them to numeric() first manually, which we'll do for NativeLanguage.
lexdec = lexdec %>% 
  mutate(numNativeLanguage = as.numeric(NativeLanguage)) %>% 
  mutate(sLength = scale(Length), sFrequency = scale(Frequency), sNativeLanguage = scale(numNativeLanguage))
summary(lexdec)

m = lmer(RT ~ sLength * sFrequency * sNativeLanguage + (1+sLength * sFrequency|Subject) + (1+sNativeLanguage|Word), data=lexdec, REML=F)
summary(m)

# That got rid of the first convergence error, but now we're dealing with a singular fit! This means that some of the constrained parameters of the random effects parameters are on the boundary (equal to zero, or very very close to zero, say <10−6). Simply put, this means the random effects structure is likely too complex. 

tt = getME(m,"theta") # get the lower bounds on random effects parameters
tt
ll = getME(m,"lower") # get the lower bounds on random effects parameters
min(tt[ll==0]) # this is a very low theta value for the length by frequency random by-subject slope, so we proceed by simplifying the random effects structure to not include this term

m = lmer(RT ~ sLength * sFrequency * sNativeLanguage + (1+sLength + sFrequency|Subject) + (1+sNativeLanguage|Word), data=lexdec, REML=F)
summary(m)
# Solved!

# There are lots of other convergence warnings you may get. You can look for guidance on convergence within RStudio by typing ?convergence in the console. And here is an external trouble-shooting guide: https://rstudio-pubs-static.s3.amazonaws.com/33653_57fc7b8e5d484c909b615d8633c01d51.html



