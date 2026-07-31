---
layout: post
title: 'What is a Linked List?'
date: '2015-10-06T15:33:00.001-07:00'
author: Jonathan Gill
tags:
- computer science
- data structures
---

A linked list is one way in which we can store data of the same type together. Like an array, the data is traversable from beginning to end and contains elements, which we instead call nodes, of the data type specified upon creation. Unlike arrays though, there is no need for a max size restriction as each node is created at a free location in memory independently of other nodes. This freedom of max size restriction is a powerful boon to program efficiency, but does not come without its drawbacks.

Due to the seemingly random allocation of each node of a linked list in memory it would be nearly impossible to access a particular node if needed. This is one of main reasons linked list nodes are actually two parted in nature. One part of the node holds the data of the linked list type, while the other part holds the location of the node that follows it in memory. In this way we have a linear path through the list and can track our position and find a particular node within it. While an array would be faster for small data sets as the blocks of memory are contiguous, it must also undergo a costly copy and reallocate procedure if it is ever to be expanded. When a linked list needs to be expanded the new node is created and simply inserted into the list changing the memory location of the nodes around it accordingly.

The linear traversal of a linked list means that finding a particular element within the list is more costly than that of an array. As linked list are not referenceable without traversing them till the data is found. This means that in the worst case a linked list will have to traverse the whole list in order to get to the last element, while an array would be able to simply ‘jump’ to the last node in the list. With this in mind, you would want to use a linked list when elements are often added to the list and a max size definition may need to be exceeded multiple times, but not necessarily in a situation where the cost of traversing the list is higher than the cost of reordering and adding new elements.

An example of linked list application can be found in things such as dictionary traversal or catalogues where data is frequently reshuffled and new elements are added. The power of linked lists in these scenarios fits perfectly with the requirements of the task. They do not excel in areas where reverse traversal is necessary or similar situations where additional memory is needed to store location or other information about the node. While there are linked list implementations that allow for this functionality (double linked lists, circular linked lists, etc.), the cost scales higher due to the additional memory needed to store more information with each node.

You may have asked yourself, “Why not just use an array?” when you are setting up the basic structure of your program. Arrays and lists have many advantages and disadvantages associated with their use. One disadvantage of using an array is if you need to insert a new item to the beginning or middle of the list, it takes an amount of time which scales with the length of the array because when you insert a new item any items around it must be relocated through iteration to make room for the newly added item. If we had a starting array like this:

Say we wanted to add an integer 3 to the third element of our array:
'''//starting array
int array1[5] = { 5, 15, 2, 30, null };
//insert int 3 into element 3
// int 3 is added which pushes previous occupant of element three to
// element four
// finished array
int array1[5] = { 5, 15, 2, 3, 30 };'''

This process is not terribly expensive on a small array like the example here, but can quickly get out of hand when needing to relocate many integers due to an addition to the array.

Another disadvantage of an array is that it must have a fixed length. In the example above an array who has filled itself cannot add new elements and therefore does not scale well.

Enter the linked list: a list made up of data structures called nodes, which store both an item and a reference to the next node in the list. A list structure could look something like this:

What you see here are 5 linked nodes with data members 1, 2, 3, 4, and 5. In code this would look like this:
'''struct node
{
  int someInt;
  node *next;
};'''

What this does is create a structure that contains the descriptors of our node. Each node that is created has an integer value and a pointer to the next node. If a node is the last node, its value is null. With this very basic structure we can start creating our linked list.

To create the linked list we first need to create a node with the integer data in it. We can do this like so:
'''// create a new node
n = new node;

// populate the node with int data
data = 1;

// temp * points to same node as n
temp = n;

// head * points to the head node
head = n;

// create another new node
n = new node;
n & data = 2;

// initialize t (node 1) to point to node 2
temp & next = n;

// initialize temp to equal the next node (node 2)
temp = temp &;
next;'''

This code would continue on in the same fashion to create all five elements of the node we show in the example above. Each time a new node is created we make the next variable equal to temp’s current location and then make temp equal to the next node’s location. The head variable keeps track of the beginning of our list and the null value at the end shows where the end of our linked list is.

While we are emulating elements with data much the same way that an array does, we do not need to create the start and end point at run time. This allows us to scale our entries (nodes) for whatever amount of data we need. We do not have to use up a large amount of memory to store a large “worst case scenario array” that may never be filled or constrain ourselves to only so many elements in our program. Due to the nature of the structure we created we may also add other elements to the node in order to easily access a particular spot by reference; like a key. These things make linked lists a very powerful tool in development of our programs.

References:

Deitel, P., & Deitel, H. (2014). Custom Templatized Data Structures. In Johnson, T., & Snyder, C. (9th ed.), C++ How to Program (pp. 780-781). Upper Saddle River, NJ: Pearson Education Inc.

Paul Programming. (2012). How to Create a Linked List: C++ Introduction to Linked Lists [Video File]. Retrieved from: https://www.youtube.com/watch?v=o5wJkJJpKtM
