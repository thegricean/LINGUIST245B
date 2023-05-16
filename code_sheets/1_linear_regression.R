# R basics and linear regression
# Created by jdegen on Sep 16, 2016
# Updated by jdegen on May 15, 2023

# Load the `languageR` and `brms` packages. If they're not yet installed you'll get an error saying "Error in library(languageR) : there is no package called ‘languageR’". To install the package, first type and execute `install.packages("languageR")`. (This generalizes to any package, using the name of the package instead of "languageR".)
library(languageR)
library(tidyverse)
library(brms)

# This will also load the lexical decision time dataset from Baayen et al (2006), which we will be modeling extensively. To see two different summaries of the dataset and the first few lines:
summary(lexdec)
str(lexdec)
head(lexdec)
View(lexdec)

# To get information about the dataset provided by the authors:
?lexdec

# We are interested in modeling response times (coded in the data frame as 'RT'). The first step is always to understand some basic things about your data.

# 1. How many data points are there?
nrow(lexdec)

# 2. How many unique participants are there?
length(levels(lexdec$Subject))
length(unique(lexdec$Subject))

# 3. What is the mean, minimum, maximum, and standard deviation of the response times?
mean(lexdec$RT)
min(lexdec$RT)
sd(lexdec$RT)

# Let's recode the language background variable from "NativeLanguage" to "LanguageBackground", and its levels from "English" & "Other" to "English" & "Non-English"
lexdec = lexdec %>% 
  rename("LanguageBackground"="NativeLanguage") %>% 
  mutate(LanguageBackground = fct_recode(LanguageBackground, "Non-English"="Other"))

# 4. How many data points are in the English and Non-English groups?
table(lexdec$LanguageBackground)


# Frequentist stats
# Let's run our first linear regression model! We start by asking whether language background has a linear effect on log RTs:
m.f = lm(RT ~ LanguageBackground, data=lexdec)
summary(m.f)

# Bayesian stats
# Let's run the exact same model the Bayesian way! We haven't specified a prior, so the model will assume weakly informative default priors.
m.b = brm(RT ~ LanguageBackground, data=lexdec)
summary(m.b)

# 5. Extend the simple model to include an additional predictor for frequency. If you don't remember the name of the frequency column in the dataset, use the names() function.

# Frequentist: 
m.f = lm(RT ~ LanguageBackground + Frequency, data=lexdec)
summary(m.f)

# Bayesian:
m.b = brm(RT ~ LanguageBackground + Frequency, data=lexdec)
summary(m.b)


# 6. Let's extend the model to include the interaction between frequency and language background. In order to interpret interaction terms, we need to know how predictors are coded. By default, R dummy-codes categorical predictors. It assigns 0 and 1 to the predictors in alphabetical order. If you're not sure how a predictor is coded (or if you want to change the default coding), you can use the contrasts() function. What is the reference level for the LanguageBackground predictor?

contrasts(lexdec$LanguageBackground)

# These are two equivalent ways of adding the interaction between frequency and language background to the model:

# Frequentist: 
m.f = lm(RT ~ Frequency + LanguageBackground + Frequency:LanguageBackground, data=lexdec)
summary(m.f)
m.f = lm(RT ~ Frequency*LanguageBackground, data=lexdec)
summary(m.f)

# Bayesian: 
m.b = brm(RT ~ Frequency + LanguageBackground + Frequency:LanguageBackground, data=lexdec)
summary(m.b)
m.b = brm(RT ~ Frequency*LanguageBackground, data=lexdec)
summary(m.b)


# Extra: To get a sense for whether the linear modeling assumptions of homoscedasticity and normality of residuals are met, let's run a model with untransformed RTs and frequencies to contrast with:
lexdec$rawRT = exp(lexdec$RT)
lexdec$rawFrequency = exp(lexdec$Frequency)

m.raw = lm(rawRT ~ rawFrequency, data = lexdec)
summary(m.raw)

# Create histograms of residuals to apply the "interocular" test for normality (i.e., look at the distributions).
lexdec$residual = residuals(m)
lexdec$rawResidual = residuals(m.raw)

# Normality of residuals assumption met (reasonably well) for log RTs:
ggplot(lexdec, aes(x=residual)) +
  geom_histogram()

# Normality of residuals assumption not met for raw RTs:
ggplot(lexdec, aes(x=rawResidual)) +
  geom_histogram()

# Create plots of residuals against frequency to apply interocular test for homoscedasticity.

# Homoscedasticity assumption met for log RTs:
ggplot(lexdec, aes(x=Frequency,y=residual)) +
  geom_point()

# Homoscedasticity assumption NOT met for raw RTs:
ggplot(lexdec, aes(x=rawFrequency,y=rawResidual)) +
  geom_point()



