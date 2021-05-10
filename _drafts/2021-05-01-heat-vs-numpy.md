---
layout: post
title: "Heat vs Numpy, a review"
author: Leonardo Ayala
date: 2021-05-01 08:00:00 -0000
categories: data science
tags: numpy, heat, mpi, parallel computing
permalink: heat-vs-numpy
image:
comments: true
---

To address:
1. Printing a big array takes long for heat: `heat.random.rand(1000,100,100)`
2. Heat incorporates usefult things like being able to call `a.median()`
3. Heat is faster compared to numpy in the array mentioned in (1)
4. Computing the median takes a lot longer for heat compared to numpy
5. calling split=0 on array and then computing median makes the computation super slow

{% if page.comments == true and site.disqus.shortname %}
    {% include disquss.html %}
{% endif %}