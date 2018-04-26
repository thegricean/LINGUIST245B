# R basics and linear regression
# Created by jdegen on Sep 16, 2016
# Updated by jdegen on Apr 25, 2018

# Load the `languageR` package. If it's not yet installed you'll get an error saying "Error in library(languageR) : there is no package called ‘languageR’". To install the package, first type and execute `install.packages("languageR")`. (This generalizes to any package, using the name of the package instead of "languageR".)
library(languageR)

# This will also load the lexical decision time dataset from Baayen et al (2006), which we will be modeling extensively. To see two different summaries of the dataset and the first few lines:
summary(lexdec)
str(lexdec)
head(lexdec)
View(lexdec)

# To get information about the dataset provided by the authors:
?lexdec

# We are interested in modeling response times (coded in the data frame as 'RT'). The first step is always to understand some basic things about your data.

# 1. How many data points are there? 
# Hint: use the nrow() function.


# 2. How many unique participants are there? 
# Hint: Use the length() and unique() functions.


# 3. What is the mean, minimum, maximum, and standard deviation of the response times?
# Hint: Use the mean(), min(), and sd() functions.


# Let's run our first linear regression model! We start by asking whether frequency has a linear effect on log RTs:
m = lm(RT ~ Frequency, data=lexdec)
summary(m)


# 5. Extend the simple model to include an additional predictor for morphological family size. 
# Hint: Predictors are added to formulae with '+'
# Hint: If you don't remember the name of the family size column in the model, use the `names` command.


# 6. Extend the model to include a predictor for participants’ native language (English vs other). By default R dummy-codes categorical predictors. It assigns 0 and 1 to the predictors in alphabetical order. If you're not sure how a predictor is coded (or if you want to change the default coding), you can use the `contrasts()` function. What is the reference level for the NativeLanguage predictor?


# Let's extend the model to include the interaction between frequency and native language. These are two equivalent ways of doing that:
m = lm(RT ~ Frequency + FamilySize + NativeLanguage + Frequency:NativeLanguage, data=lexdec)
m = lm(RT ~ FamilySize + Frequency*NativeLanguage, data=lexdec)
summary(m)


