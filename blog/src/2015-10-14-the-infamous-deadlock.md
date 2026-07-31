---
layout: post
title: 'The Infamous Deadlock'
date: '2015-10-14T11:48:00.002-07:00'
author: Jonathan Gill
tags:
- computer science
- os theory
---

A deadlock occurs when a set of threads or processes is waiting for a resource that will never become available. Suppose that a process, which we will call Process A, is waiting on a resource to free up which another process, say we call this one Process B, controls at the moment. If Process B in turn is waiting for the resource that Process A controls we have a deadlock as neither will stop waiting and neither will release the resource from control.

Whether a deadlock can or has occurred can be shown mathematically. We accomplish this though the use of a resource allocation graph (Breecher, 2007). If we have a graph (G) that contains nodes and edges (V,E), and we say that (V) nodes contain processes and resources ({P1,P2,P3, ... } {R1, R2, ... }) and the (E) edges are represented as (Pi, Rj) or (Ri, Pj). We can then use arrows drawn from (P) processes to (R) resources when a process is requesting a resource ( (P) requests (R) ) but use the opposite when a resource has been allocated to a process ( (P) allocates (R) ). With this setup we can see if there are any deadlocked processes by determining if there are any cycles where the path of control returns to the original process through common resources. This in and of itself does not automatically mean we have a deadlock though. It simply determines if one is possible. To find if a deadlock has occurred we must go one level deeper, where if there is a cycle present we ask if the resources have multiple instances or if the resource has a single instance. If there is more instances of resources present then a deadlock may have occurred. In the case where a resource has only one instance, a deadlock has most certainly occurred. We know this because to create a cycle, which we determined we most definitely have by this point, we must have at least two processes, and two processes in a cycle with one resource means someone is missing out.

In the June 1971 journal ACM Computing Surveys E.G. Coffman Jr. et al. shows that four conditions must hold true for there to be a deadlock:
>"This deadlock situation has arisen only because all of the following general conditions were operative:
   1) Tasks claim exclusive control of the resources they require ("mutual exclusion" condition).
   2) Tasks hold resources already allocated to them while waiting for additional resources ("wait for" condition).
   3) Resources cannot be forcibly removed from the tasks holding them until the resources are used to completion ("no preemption" condition).
   4) A circular chain of tasks exists, such that each task holds one or more resources that are being requested by the next task in the chain ("circular wait" condition). The existence of these conditions effectively defines a state of deadlock." (p 71)

These key elements of deadlock creation have not changed over the years since Coffman and his colleagues wrote about them. Deadlocks today occur for the same reasons that they did 44 years ago. In order for these to be possible though there are three other elements which must be present. Those elements are the lack of preemption, the inclusion of mutual exclusion, and the the proclivity for a process to hold and wait (Stallings, 2015). Without these three elements in conjunction deadlock cannot occur.

References:

Breecher, J. (2007). Operating Systems Deadlocks [PDF file]. Retrieved on 08/06/2015 from http://web.cs.wpi.edu/~cs3013/c07/lectures/Section07-Deadlocks.pdf

Coffman, E.G., Elphick, M. & Shoshani, A. (1971). System Deadlocks. Journal ACM Computing Surveys, 2, 67-78.

Stallings, W. (2015) Operating Systems Internals and Design Principles. Upper Saddle River, NJ: Pearson Education Inc.
