---
layout: post
title: 'Considerations When Choosing a File Organization'
date: '2017-03-14T20:39:00.000-07:00'
author: Jonathan Gill
tags:
- computer science
- os theory
---

File organization is a oft overlooked aspect of our modern operating systems. It may seem like the folder and file structure hierarchy is simply common sense organization, but in fact the way in which we put together disparate data is a matter of somewhat larger complexity.

The text Operating Systems: Internals and Design Principles (Stallings, 2015) describes file organization as "the logical structuring of the records as determined by the way in which they are accessed." The criteria of note to consider when weighing different file organization schemes are that:

* Any particular file has short access time (speed cost)
* The scheme is easily able to be updated (additions, updates, removals)
* Storage is economical (size cost)
* Maintenance is relatively simple
* The organization method is reliable

While some file organization systems may prioritize or add to this list in their own unique ways, the base criteria should hold true for any well developed and widely accepted system in use today.

With the development paths and methodologies instanced in operating system architecture today, it may not be surprising that each goes about their file organization in slightly different ways. While there are many different schemes available and more proposed all the time, most alternative file organization schemes fall into one of five different classifications; pile, sequential, indexed-sequential, indexed, and hashed.

The pile organization is probably one of the simpler schemes available. Data in this scheme is collected and organized in the order which they arrive in. The pile file organization is notable for its simplicity, efficiency, and the ease in which it can update. The weakness of this method is that due to the lack of structure present, data retrieval can be cumbersome, as each record and field within a file must be searched individually until a given result is found.

The sequential organization is a scheme in which all records are given the same size and field format and in which fields are sorted in particular order. Since all files and their fields are the same size only the values contained in each field need be stored. In this file organization a key field is implemented to differentiate one record from another. A sequential organization is best suited to applications where a large batch or whole file of records are updated at once. This is due to its linear presorted layout. The same thing that gives sequential organization its power also feeds its weaknesses though. This method is poorly suited for applications in which individual records or fields may need to be accessed regularly, since the time to access each element may vary widely between files of different sizes.

The indexed-sequential file organization is largely an attempt to shore up the weaknesses of the sequential organization method. While similar to the sequential one in format and structure, the addition of an index (hence the name) and overflow file provide additional functionality to the indexed version of this organization. By adding an index field records can be accessed with ease and speed not present in the method it improves upon. Unfortunately this extra functionality comes at an increase in complexity as well. Each new level of indexing, while increasing the ease and speed with which information can be accessed, increases the overhead in both complexity and storage cost.

In the indexed file organization is perfect for applications in which flexibility is needed in the ability to search attributes. This method strips all the sequential structure from the previously detailed indexed sequential one and capitalizes on the indexing behavior entirely. This alteration allows the indexed file organization to circumvent the issues with additions to files and memory hierarchy present in its predecessors. Although the indexed method's access time is much faster for a particular record or field, due to its abandonment of the linear ordered structure of the sequential methods, it also is much worse at processing large or exhaustive files need processing.

Finally, we come to the direct file organization method, also known as hashed organization. In this method files are referenced by their memory location on disk. A hash is created of the key value and provides extremely fast access to elements of the file. The direct file organization method is best suited to applications where single records are accessed at a time.

Reference:

Stallings, W. (2015) Operating Systems Internals and Design Principles. Upper Saddle River, NJ: Pearson Education Inc.
