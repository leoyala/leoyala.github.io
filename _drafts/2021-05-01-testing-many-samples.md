---
layout: post
title: "Statistical sampling of many samples"
author: Leonardo Ayala
date: 2021-05-01 08:00:00 -0000
categories: data science
tags: statistical testing, python, many samples
permalink: testing-many-samples
image: 
comments: true
---


This post <!--first-word--> is about something that is ignored or overlooked in many cases during statistical testing of a big number of 
samples. For this purpose we will analyse the effect of sample size on the _p-values_ of several statistical tests.

## Wilcoxon rank test


```python
import scipy.stats as stats
import matplotlib.pyplot as plt
import numpy as np
from tqdm import tqdm

pvals = []
statistics = []
sizes = np.arange(10, 10000, 10)
for size in tqdm(sizes):
    x = np.random.normal(size=size)
    y = np.random.normal(size=size)
    s = stats.wilcoxon(x,y)
    pvals.append(s.pvalue)
    statistics.append(s.statistic)

plt.plot(sizes, pvals)
plt.show()
```

