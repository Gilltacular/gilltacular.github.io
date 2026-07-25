---
layout: post
title: 'Quick Sort VS. Merge Sort'
date: '2015-09-02T18:42:00.001-07:00'
author: Jonathan Gill
tags:
- computer science
- os theory
---

To speak on the topic of which of any two sorting algorithms are better for a given situation, we must first understand how each works so that we can list appropriate strengths and weaknesses in a given scenario.

A quick sort is classified as a comparison sort; a sort algorithm that reads elements comparing them against a single defined comparison operation. Quick sort accomplishes this by way of a divide and conquer methodology, in which a large problem is broken down into smaller problem subsets and recursively unwinds to sort the elements. In a quick sort algorithm a pivot point is chosen and then the array is restructured placing all elements smaller than the pivot to the left of its index and all elements larger than the pivot to the right of its index. This operation ensures that the pivot index chosen is in its final sorted location. Then a recursive call is made which does the exact same thing for the larger right-side sub array as well as the lesser left-side sub array. When the recursion unwinds, the final result is a sorted array. If you are having trouble picturing this operation take a look at [video1] linked at the end of this post.

In a merge sort, the same tactic of divide and conquer is used to divide the entire array or list of elements up into some amount of single-element sublists. These sublists are compared and sorted in turn, placing each element in order and resulting in a final single sorted list when the recursion unwinds. To get a visual idea of how this works, take a look at [video2] linked at the end of this post.

Now that we know how each of these sorts works, we can better identify which is better for what circumstances in a given situation. Merge sort has a worst case performance of O(n log n) and quick sort a worst case performance of O(n^2) with a more common average of O(n log n). Many factors such as how a pivot is selected and how many of the same elements are present within the unsorted list play into how a quick sort performs. Merge sort on the other hand, while performing a similar amount of steps, takes up two times the memory locations due to its sorting behavior (note: strategies can be employed to limit this memory usage such as in-place sorting). These strengths lend themselves to different uses ‘in the wild’.

Quick sort is a great choice when unique or unrelated data needs to be sorted in large quantity. Cases such as the one it was originally developed for when Tony Hoare (the creator) needed to sort inputs for a machine translation project so that they would easily be compared in a similar order to that of a sorted Russian to English dictionary.

Merge sort on the other hand is useful when data should be read sequentially. When a bottleneck such as writing to disk is in play, this can drastically increase the overhead that a quick sort would experience. A merge sort is what is known as a stable sort and therefore its order will not change when values have the same key. Merge sort is also better when linked lists are in play as the data structure. This is because merge sort does not need additional memory, while a quick sort is not sequential.

Sorting Algorithm Further Reading:
Animated sorting algorithm visual aid: http://www.sorting-algorithms.com/

[video1] Quick-sort with Hungarian (Küküllőmenti legényes) folk dance: https://www.youtube.com/watch?v=ywWBy6J5gz8&amp;index=6&amp;list=FLdUzMPf_pBhVqa9VLnqBCrQ

[video2] Merge-sort with Transylvanian-saxon (German) folk dance: https://www.youtube.com/watch?v=XaqR3G_NVoo&amp;index=5&amp;list=FLdUzMPf_pBhVqa9VLnqBCrQ

Princeton Algorithms(4th ed.) “QuickSort”: http://algs4.cs.princeton.edu/23quicksort/
