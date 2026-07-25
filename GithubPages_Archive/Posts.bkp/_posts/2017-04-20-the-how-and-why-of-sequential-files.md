---
layout: post
title: 'The How and Why of Sequential Files'
date: '2017-04-20T07:42:00.000-07:00'
author: Jonathan Gill
tags:
- computer science
- c++
---

To explain the how and why of creating sequential files, we must first understand what a sequential file is. A sequential file is a collection of data stored on a disk (like a cd, dvd, flashdrive, hard drive, etc.). Each file ends with an end-of-file marker or at a specific byte number recorded in an operating system maintained, administrative data structure. Other than those mentioned previously, sequential files contain no additional structure. Any additional structure has to be given by the program using the file.

Files in C++ are structureless by default. Therefore the need for the sequential file comes into scope. In order to create a sequential file, we first need access to the C++ headers iostream and fstream. The fstream header gives us the definitions we need for functions such as file input, file output, as well as character input from files. After the header, the next thing we must do is open the file for reading and writing to. We do this by creating an ofstream object. We then pass in two arguments to the ofstream object’s constructor; the name of the file and the file open mode. File open mode can be set to either output data to a file or to append data to the end of a file. We complete these operations with the parameters ios::out and ios::app respectively. If no parameter is specified for the file open mode, then the default is set to ios::out. The main difference between an output and an append operation is that an output operation discards all data previously in the file; replacing it with data that you are outputting to it. In an append operation, the data is sent to the end of the file, keeping the rest of the file intact and unchanged. The following is an example in code of the information up to this point:

```
#include <iostream>
#include <fstream>

  int main()
  {
    /*the ofstream object is created opening the file and outputting information to it the ios::out parameter will cause all data that may be in the file to be truncated and replaced by new information being output.*/
    std ofstream fileOne(“file_one.txt”, std::ios::out);

    /*the ofstream object is created opening the file and outputting information to it the ios::app parameter will cause all data that may be in the file to be retained and add any output information to the end of the file.*/

    std::ofstream fileTwo(“file_two.txt”,std::ios::app);
  }
```

  After we open a file, we can test if we were successful in our operation by using a simple if statement with an overloaded operator. The following is an example of our code with this check implemented:

```
  #include <iostream>
  #include <fstream>
    int main()
    {
      std::ofstream fileOne(“file_one.txt”,std::ios::out);
      std::ofstream fileTwo(“file_two.txt”,std::ios::app);
      if(!fileOne || !fileTwo)
      {
        std::cerr “ERROR:File could not be properly opened. Please check the file name and try again.”;
        std::endl;
      }
```
  In the above example, use the ! operator prepended to the file handle to check is the open operation succeeded.

  In the case that the file is opened successfully, we can then begin any operations we want to with the file. This is accomplished in the same way passing information to cout and cin is accomplished. We use the string insertion and string extraction operators to extract and insert information to the file. As long as we prepend it with the name of out ofstream object it works exactly the same way.

```
  #include <iostream>
  #include <fstream>
    int main()
    {
      std::ofstream fileOne(“file_one.txt”, std::ios::out);
      std::ofstream fileTwo(“file_two.txt”, std::ios::app);
      if(!fileOne || ! fileTwo )
      {
        std::cerr “ERROR:File could not be properly opened. Please check the file name and try again.”
        std::endl;
      }
      familyName, surName;
      int age, sSnum, weight;
      std::cout “Please enter your first and last name, age, social security number, and weight.”
      std::endl;
      while(std::cin surName familyName age sSNum  weight)
      {
        fileOne “First name: “surName “\n” “Last name: familyName “\n” “Social Security Number: “sSNum “\n” “Weight: “weight “\n” endl;
      }
```
  As you can see, this is a powerful tool for keeping data persistent and being able to reference it when needed in a program. With the power of sequential file creation we can create databases of records holding any sort of information we need anything from medical information to error logs are possible.

  Reference:

  Deitel, P.,& Deitel, H. (2014). File Processing: Reading Data from a Sequential File. In Johnson, T., & Snyder, C. (9th ed.), C++ How to Program (pp. 600-611). Upper Saddle River, NJ: Pearson Education Inc.

  Sethi, S. (nd). Intro to File Input/Output in C++. Retrieved from : http://www.cs.bu.edu/faculty/homer/112/labs/streams.html
