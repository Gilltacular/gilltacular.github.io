---
layout: post
title: 'Requirements of Memory Management'
date: '2017-05-11T13:02:00.000-07:00'
author: Jonathan Gill
tags:
- computer science
- os theory
---

Memory management is intended to satisfy particular requirements, namely relocation, protection, sharing, logical organization, and physical organization (Stallings, 2015). Each of these requirements are key to the fundamental designs of the systems we use and how information is stored.

Relocation is the descriptor used to define the problem of addressing within memory allocation schema. Since it is difficult to know where a particular program may be placed in memory, due to swapping characteristics and behavior, we need a way in which addresses of particular memory blocks and their data can be referenced. Therefore the processor and OS must take memory addresses and their contents and be able track their location, even through changes like swapping, within the system.

The protection requirement of memory management makes sure that a data is not accessed by unwanted processes. As data is referenced and used unintentional calls may be made to unwanted processes or variables the calling process or instruction should not have access to. The processor must have the capability to check if data is accessed correctly at the time of execution.

Sharing is the access of a specific portion of memory by more than one process. As described by Stallings (2015),"Processes that are cooperating on some task may need to share access to the same data structure." Perhaps a bunch of processes are being used within a single program, for instance. Memory management must therefore include some way in which resources can be accessed between multiple sources without conflict and without limiting the requirements of security.

Most programs are modular, being pieces of a larger part, each with their own access permissions. A program may have parts that are only able to be accessed through certain classes but not through others, for instance. Or a program's permissions may be set as read-only to protect it from modification. The memory management requirement of logical organization must account for exactly those kinds of scenarios.

Physical organization deals with moving data from the temporary main memory to the secondary persistent storage. If we have a running program, for instance, we would likely have much of that program's instructions in main memory. If we want to save data for use between different runs of that program however, we need to utilize secondary memory to store it, so as not to lose it when the program or system closes. The organization of the path of information from main memory to persistent storage is the essence of physical organization.

Reference:

Abdel-Wahab, H. (2015). Main Memory. Retrieved on 08/10/2015 from: http://www.cs.odu.edu/~cs471w/spring11/lectures/MainMemory.htm

Boukari, K. (2013). SAP Shared Memory Objects for Frequently Accessed Data. Retrieved 08/10/2015 from: http://www.focus-itoutsourcing.com/sap-shared-memory-objects-a-solution-for-sharing-frequently-accessed-quasi-static-data/

Roy, P. (2008). Chapter Seven Memory Management [Powerpoint]. Retrieved on 08/10/2015 from: http://slideplayer.com/slide/1507394/

Stallings, W. (2015) Operating Systems Internals and Design Principles. Upper Saddle River, NJ: Pearson Education Inc.
