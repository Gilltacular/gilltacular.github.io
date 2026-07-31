---
layout: post
title: 'The Differences between Stacks and Queues'
date: '2017-03-14T20:40:00.001-07:00'
author: Jonathan Gill
tags:
- computer science
- data structures
---

A stack is a type of list that must make all modifications (insertion, deletion, etc.) from one end. This is called a Last in First out data structure (LIFO). What this functionality allows is for ordered execution based on insertion order. In example, upon booting an operating system there will inevitably be processes which require other system processes to be started in order to function correctly; you may need to load a device driver before you try to access the device for example. When shutting down you would not want to clear out the main operating system process before other processes have shut down or you may get unexpected results. In this instance, a LIFO data structure like a stack would be beneficial as it would insert running processes starting with processes that needed to be loaded before others and delete processes in reverse order, ensuring that drivers were loaded/unloaded before/after processes that require them. This of course is only an abstract view of how operating system architecture is applied, but provides an idea of a use case scenario all the same.

A queue on the other hand, is a type of First in First out (FIFO) data structure. In a queue modifications are added to one end and removed from another, requiring that the first thing added also be the first thing deleted. In this way we can set up priority for items by adding them in the order which they should be used. In our example of an operating system, the queue may be used to define what should be loaded first and then once filled execute that load order. Similarly it may do the same for what should be killed first when shutting down.
