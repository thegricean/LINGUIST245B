# Mixed effects linear regression
# Created by jdegen on Sep 16, 2016
# Updated by jdegen on Feb 28, 2024

library(languageR)
library(tidyverse)
library(lme4)
library(MuMIn)
library(brms)

theme_set(theme_bw())

# Preliminaries: Let's recode the language background variable and then create a column with centered predictors.
lexdec = lexdec %>% 
  rename("LanguageBackground"="NativeLanguage") %>% 
  mutate(LanguageBackground = fct_recode(LanguageBackground, "Non-English"="Other"))

lexdec = lexdec %>% 
  mutate(cFrequency = Frequency - mean(Frequency),
         cLanguageBackground = as.numeric(as.factor(LanguageBackground)) - mean(as.numeric(as.factor(LanguageBackground))))

# Let's run our first mixed effects linear regression model! We start by running the simplest linear regression model for predicting RTs from centered fixed effects of frequency, language background, and their interaction, with by-participant random intercepts.
m = lmer(RT ~ cFrequency*cLanguageBackground + (1|Subject), data=lexdec, REML=F)
summary(m)

# Let's look more closely at the random effects. What do the numbers represent?
ranef(m)

# Let's add by-participant random slopes for frequency:
m = lmer(RT ~ cFrequency*cLanguageBackground + (1+cFrequency|Subject), data=lexdec, REML=F)
summary(m)

# Let's look more closely at the random effects. What do the numbers represent?
ranef(m)

# What does the correlation between the random by-participant intercept and slope adjustment mean?
re = tibble(intercept=ranef(m)$Subject[1][,c("(Intercept)")],slope_freq=ranef(m)$Subject[2][,c("cFrequency")])

ggplot(re, aes(x=intercept,y=slope_freq)) +
  geom_hline(yintercept=0,linetype="dashed",alpha=.5) +
  geom_vline(xintercept=0,linetype="dashed",alpha=.5) +
  geom_smooth(method='lm') +
  geom_point()

# How much variance is explained by the model?
r.squaredGLMM(m)

# Marginal R^2 (variance explained by fixed effects): .16
# Conditional R^2 (variance explained by fixed and random effects jointly): .45


# Let's add by-item random effects.
m = lmer(RT ~ cFrequency*cLanguageBackground + (1+cFrequency|Subject) + (1+cLanguageBackground|Word), data=lexdec, REML=F)
summary(m)

# To de-correlate random effects, use the "||" syntax
m = lmer(RT ~ cFrequency*cLanguageBackground + (1+cFrequency || Subject) + (1+cLanguageBackground || Word), data=lexdec, REML=F)
summary(m)

ranef(m)

# Replot random slope against random intercepts
re_participant = tibble(intercept=ranef(m)$Subject[,c("(Intercept)")],slope=ranef(m)$Subject[,c("cFrequency")],type="participant")

re_item = tibble(intercept=ranef(m)$Word[,c("(Intercept)")],slope=ranef(m)$Word[,c("cLanguageBackground")],type="item")

re = bind_rows(re_participant,re_item)

ggplot(re, aes(x=intercept,y=slope)) +
  geom_hline(yintercept=0,linetype="dashed",alpha=.5) +
  geom_vline(xintercept=0,linetype="dashed",alpha=.5) +
  geom_smooth(method='lm') +
  geom_point() +
  facet_wrap(~type)


# Let's run the same model the Bayesian way:
m.b = brm(RT ~ cFrequency*cLanguageBackground + (1+cFrequency|Subject)  + (1+cLanguageBackground|Word), 
          data=lexdec,
          cores=4)
summary(m.b)


# Hypothesis-testing. What is the Bayes Factor and the probability of the frequency main effect being greater than 0?
h <- hypothesis(m.b, "cFrequency < 0")
print(h, digits = 4)

# Hypothesis-testing. What is the Bayes Factor and the probability of the language background main effect being greater than 0?
h <- hypothesis(m.b, "cLanguageBackground > 0")
print(h, digits = 4)

# Hypothesis-testing. What is the Bayes Factor and the probability of the interaction between frequency and language background being smaller than 0?
h <- hypothesis(m.b, "cFrequency:cLanguageBackground < 0")
print(h, digits = 4)

# To compute R^2 (https://github.com/jgabry/bayes_R2/)
bayes_R2(m.b)


# How do we get p-values in frequentist models? The lmer authors make various suggestions here:
?pvalues

# To compute p-values for fixed effects via model comparison:
m.0 = lmer(RT ~ (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.0)

m.1 = lmer(RT ~ Frequency + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.1)

anova(m.0,m.1)

# To compute p-values for fixed effects via Satterthwaite approximations (uses the lmerTest package):

# Run the following two commands if you haven't installed the packages:
#
# install.packages("lmerTest")

library(lmerTest)
m.3 = lmer(RT ~ Frequency + LanguageBackground + (1|Subject) + (1|Word), data=lexdec, REML=F)
summary(m.3)
