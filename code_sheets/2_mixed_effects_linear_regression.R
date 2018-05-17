# Mixed effects linear regression
# Created by jdegen on Sep 16, 2016

library(languageR)
library(lme4)

# Let's run our first mixed effects linear regression model! We start by running the simplest linear regression model for predicting RTs (only frequency predictor) with by-subjects random intercepts.
m = lmer(RT ~ Frequency + (1|Subject), data=lexdec)
summary(m)

# Let's look at the R^2 -- this is much higher compared to the simple linear model! 
cor(fitted(m),lexdec$RT)^2

# 1. What was the linear model's R-squared? Re-compute it here.
m.s = lm(RT ~ Frequency, data=lexdec)
cor(fitted(m.s),lexdec$RT)^2

# 2. How would we add random by-item intercepts? (What counts as an item?)
m = lmer(RT ~ Frequency + (1|Subject) + (1|Word), data=lexdec)
summary(m)

# Let's look more closely at the random effects:
ranef(m)
mean(ranef(m)$Subject[[1]])
head(ranef(m)$Subject[1])
max(ranef(m)$Subject[1])
min(ranef(m)$Subject[1])

mean(ranef(m)$Word[[1]])
head(ranef(m)$Word[1])
max(ranef(m)$Word[1])
min(ranef(m)$Word[1])

# Let's add random by-subject slopes for frequency.
m = lmer(RT ~ Frequency + (1 + Frequency|Subject) + (1|Word), data=lexdec)
summary(m)

# There are now two adjustment columns by subject, one for the intercepts and one for the slopes. We can see using summary() that there is greater variance in the intercepts than in the slopes. 
head(ranef(m)$Subject)
summary(ranef(m)$Subject)

# What does that correlation of -.92 mean?
plot(ranef(m)$Subject)

# How do we get p-values? The lmer authors make various suggestions here:
?pvalues

# To compute p-values for fixed effects via model comparison:
m.0 = lmer(RT ~ (1|Subject) + (1|Word), data=lexdec)
summary(m.0)

m.1 = lmer(RT ~ Frequency + (1|Subject) + (1|Word), data=lexdec)
summary(m.1)

anova(m.0,m.1)

m.2 = lmer(RT ~ Frequency + NativeLanguage + (1|Subject) + (1|Word), data=lexdec)
summary(m.2)

anova(m.1,m.2)

# To compute p-values for fixed effects via lmerTest:
install.packages("lmerTest")
m.3 = lmerTest::lmer(RT ~ Frequency + NativeLanguage + (1|Subject) + (1|Word), data=lexdec)
summary(m.3)



