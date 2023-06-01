# Mixed effects ordinal regression (the Bayesian way)
# created by jdegen on May 31, 2023

library(tidyverse)
library(brms)

this.dir <- dirname(rstudioapi::getSourceEditorContext()$path)
setwd(this.dir)

source("helpers.R")
cbPalette <- c("#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2", "#D55E00", "#CC79A7") 
theme_set(theme_bw())

# load the dataset collected by Degen (2015)
d <- read_tsv("https://raw.githubusercontent.com/thegricean/corpus_some/master/data/some_database.csv") %>% 
  mutate_if(is.character,as.factor)
view(d)
nrow(d) #13630 rows

contrasts(d$Partitive)
contrasts(d$Subjecthood)

table(d$Partitive)
table(d$Subjecthood)

d = d %>% 
  mutate(cPartitive = as.numeric(Partitive) - mean(as.numeric(Partitive)),
         cSubjecthood = as.numeric(Subjecthood) - mean(as.numeric(Subjecthood)))

# cumulative link model
m.logit = brm(Rating ~ cPartitive*cSubjecthood + (1|Item) + (1|workerid),
        data=d,
        family=cumulative(),
        cores=4)
summary(m.logit)

# adjacent category model
m.acat = brm(Rating ~ cPartitive*cSubjecthood + (1|Item) + (1|workerid),
              data=d,
              family=acat(),
              cores=4)
summary(m.acat)
# marginal_effects(m.acat)

# In the context of model selection, an LOOIC difference greater than twice its corresponding standard error can be interpreted as suggesting that the model with the lower LOOIC value fits the data substantially better, at least when the number of observations is large enough
loo(m.logit,m.acat)


# Plot proportions of responses by partitive
agr = d %>% 
  select(Rating,Partitive,Subjecthood) %>% 
  mutate(One = case_when(Rating == 1 ~ 1,
                       TRUE ~ 0),
         Two = case_when(Rating == 2 ~ 1,
                         TRUE ~ 0),
         Three = case_when(Rating == 3 ~ 1,
                           TRUE ~ 0),
         Four = case_when(Rating == 4 ~ 1,
                          TRUE ~ 0),
         Five = case_when(Rating == 5 ~ 1,
                          TRUE ~ 0),
         Six = case_when(Rating == 6 ~ 1,
                         TRUE ~ 0),
         Seven = case_when(Rating == 7 ~ 1,
                           TRUE ~ 0)) %>% 
  pivot_longer(cols = One:Seven, names_to=c("Response"), values_to=c("Value"))

agr_part = agr %>% 
  group_by(Partitive,Response) %>% 
  summarize(Mean = mean(Value), CILow=ci.low(Value), CIHigh = ci.high(Value)) %>% 
  ungroup() %>% 
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>% 
  mutate(Rating = as.numeric(as.character(fct_recode(Response, "1"="One", "2"="Two","3"="Three","4"="Four","5"="Five","6"="Six","7"="Seven"))))

dodge=position_dodge(.9)

ggplot(agr_part, aes(x=Rating,y=Mean,color=Partitive)) +
  geom_point() +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.1) +
  ylab("Response proportion") +
  scale_color_manual(values=cbPalette) +
  scale_x_continuous(breaks=seq(1,7,by=1))

# Plot proportions of responses by subjecthood
agr_subj = agr %>% 
  group_by(Subjecthood,Response) %>% 
  summarize(Mean = mean(Value), CILow=ci.low(Value), CIHigh = ci.high(Value)) %>% 
  ungroup() %>% 
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>% 
  mutate(Rating = as.numeric(as.character(fct_recode(Response, "1"="One", "2"="Two","3"="Three","4"="Four","5"="Five","6"="Six","7"="Seven"))))

dodge=position_dodge(.9)

ggplot(agr_subj, aes(x=Rating,y=Mean,color=Subjecthood)) +
  geom_point() +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.1) +
  ylab("Response proportion") +
  scale_color_manual(values=cbPalette) +
  scale_x_continuous(breaks=seq(1,7,by=1))


# Plot proportions of responses by partitive and subjecthood
agr_partsubj = agr %>% 
  group_by(Subjecthood,Partitive,Response) %>% 
  summarize(Mean = mean(Value), CILow=ci.low(Value), CIHigh = ci.high(Value)) %>% 
  ungroup() %>% 
  mutate(YMin=Mean-CILow,YMax=Mean+CIHigh) %>% 
  mutate(Rating = as.numeric(as.character(fct_recode(Response, "1"="One", "2"="Two","3"="Three","4"="Four","5"="Five","6"="Six","7"="Seven"))))

dodge=position_dodge(.9)

ggplot(agr_partsubj, aes(x=Rating,y=Mean,color=Partitive)) +
  geom_point() +
  geom_errorbar(aes(ymin=YMin,ymax=YMax),width=.1) +
  facet_wrap(~Subjecthood) +
  ylab("Response proportion") +
  scale_color_manual(values=cbPalette) +
  scale_x_continuous(breaks=seq(1,7,by=1))

d_items = d %>% 
  group_by(Item,Partitive) %>% 
  summarize(Mean=mean(Rating))

ggplot(d_items, aes(x=Mean,fill=Partitive)) +
  geom_histogram(alpha=.5,position="identity") +
  scale_fill_manual(values=cbPalette) +
  scale_x_continuous(name="Mean by-item rating",breaks=seq(1,7,by=1))

d_items = d %>% 
  group_by(Item,Subjecthood) %>% 
  summarize(Mean=mean(Rating))

ggplot(d_items, aes(x=Mean,fill=Subjecthood)) +
  geom_histogram(alpha=.5,position="identity") +
  scale_fill_manual(values=cbPalette) +
  scale_x_continuous(name="Mean by-item rating",breaks=seq(1,7,by=1))
