---
layout: post
title: 'What is Concurrency?'
date: '2015-08-04T18:53:00.000-07:00'
author: Jonathan Gill
tags:
- computer science
---

Concurrency is the ability to make progress in two or more threads at once. According to The Haskell Programming Language website (2014):
>"The term Concurrency refers to techniques that make program more usable. Concurrency can be implemented and is used a lot on single processing units, nonetheless it may benefit from multiple processing units with respect to speed. If an operating system is called a multi-tasking operating system, this is a synonym for supporting concurrency. If you can load multiple documents simultaneously in the tabs of your browser and you can still open menus and perform more actions, this is concurrency." (para 2)

"Wait a minute," you may interpose, "Then what is the difference between concurrency and parallelism? Don't both allow two things to run at once?" While parallelism is related to concurrency, they are in fact very different ideas. Andrew Gerrand describes this distinction in his blog post aptly named Concurrency is Not Parallelism, in which he states: "Concurrency is the composition of independently executing processes, while parallelism is the simultaneous execution of (possibly related) computations. Concurrency is about dealing with lots of things at once. Parallelism is about doing lots of things at once." Another great way to describe it is by looking at the application of each in programming. Joe Armstrong, author of Programming Erlang: Software for a Concurrent World, describes concurrency as "Two queues and one coffee machine." He continues to draw a simple image of the distinction by relating parallelism to "Two queues and two coffee machines." No matter how you look at it, while the two concepts are similar and are certainly related, even cooperative ideas, they are in fact distinct from one another.

Concurrency is a core part of three major areas of OS design; multiprogramming, multiprocessing, and distributed processing (Stallings, 2015). Concurrency is relevant in many different scenarios for each of the aforementioned areas listed. You could use it in the communication between processes for instance, or to allocate processor time among ready processes, or to share resources and synchronize multiple processes that may be in competition (Stallings, 2015).

The basic requirement for the execution of concurrent processes is called mutual exclusion, or the power to lock other processes out of a particular action while one process is allowed access (Stallings, 2015). This allows the safe access of resources and memory by way of restricting access to only one process at a time. Without such a requirement situations such as deadlock and livelock would be much more prominent issues to deal with.

For more on concurrency and parallelism I strongly recommend [this talk by Rob Pike](https://img2.blogblog.com/img/video_object.png) (Video Source: Pike, 2012) and if you have the time, check out a Scaleconf talk by Shai Rosenfeld entitled [Such Blocking, Very Concurrency, Wow](http://shairosenfeld.com/concurrency.html)

References:

Andrew, G. (2013). Concurrency is not Parallelism. Retrieved on 08/04/2015 from: https://blog.golang.org/concurrency-is-not-parallelism

Armstrong, J. (2013). Concurrent and Parallel Programming. Retrieved on 08/04/2015 from: https://joearms.github.io/2013/04/05/concurrent-and-parallel-programming.html

Parallelism vs. Concurrency. (2014). Retrieved on 08/04/2015 from: https://wiki.haskell.org/Parallelism_vs._Concurrency

Pike, R. (2012). Concurrency is Not Parallelism (it's better). Retrieved on 08/04/2015 from: https://youtu.be/cN_DpYBzKso?t=4m21s

Stallings, W. (2015) Operating Systems Internals and Design Principles. Upper Saddle River, NJ: Pearson Education Inc.
