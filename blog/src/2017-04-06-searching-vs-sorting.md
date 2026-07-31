---
layout: post
title: 'Searching Versus Sorting'
date: '2017-04-06T12:57:00.000-07:00'
author: Jonathan Gill
tags:
- computer science
---

Searching and sorting while very different principles are in fact similar in how they go about achieving their operations. The best way to show these similarities is to visualize how each works to achieve its end result.

When we sort something, typically we are taking an input that is unsorted and iterating over it. We make a comparison with every iteration until the list is sorted according to whatever order we determine we need. So in the case of the following set of numbers:

100, 59, 63, 2, 17, 8

We would start with iterating on the list comparing values until it looked something like this:

100, 59, 63, 2, 17, 8 ←- Starting unsorted input

59, 100, 63, 2, 17, 8

59, 63, 100, 2, 17, 8

59, 63, 2, 100, 17, 8

59, 2, 63, 100, 17, 8

2, 59, 63, 100, 17, 8

2, 59, 63, 17, 100, 8

2, 59, 17, 63, 100, 8

2, 17, 59, 63, 100, 8

2, 17, 59, 63, 8, 100

2, 17, 59, 8, 63, 100

2, 17, 8, 59, 63, 100

2, 8, 17, 59, 63, 100 ←- Final sorted result

In a search we are essentially doing the same exact thing. We decide what we want and then iterate over each element to compare the value to what we want. If they are the same then we have found it, if not then we continue. A simple search would look something like this:

100, 59, 63, 2, 17, 8 ←- Starting input searching for int 2

is 100 == 2?

no- continue

is 59 == 2?

no- continue

is 63 == 2?

no- continue

is 2 == 2?

yes- return result

The main difference is that in a search you only need to iterate once, unless the input or item to find is changed. A sort will often need to iterate multiple times. Both use comparisons and iteration to achieve their end results.
