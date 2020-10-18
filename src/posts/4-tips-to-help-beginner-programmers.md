---
title: 4 Tips to Help Beginner Programmers
date: 2020-06-27
description: 4 high-level tips to help beginner programmers, based on my college and internship coding experiences
mainImage: /wisdom-of-the-universe.jpg
mainImageAltText: A painting representing the wisdom of the universe via a flowering tree and a dove
useMathJax: True
---
For this post, I am assuming you already have some programming skills, but feel stuck. There is a lot of stuff you could potentially learn. Yet, this diversity of options makes decision making difficult. What will give you the best bang for your buck, so to speak? Well, I am going to try giving some advice here. Some of this advice will be obvious, but sometimes we need to repeatedly hear common sense truths for them to sink into our psyche. Thus, programmers with years of experience may not find much value in this post, but my early college self would have eagerly absorbed the knowledge--maybe you'll find the tips useful too.

To start, I'm going to emphasize mastering the fundamentals. When in doubt, reviewing and strengthing your knowledge of the basics is never a bad idea. Hard problems are often combinations of simple problems. It will be easier to solve the monstrosities if we're not bellyflopping through the basic stuff.

## Data Structures

Data structures are necessary to code much of anything--but it may be worth revisiting these building blocks. I find myself reusing the same ones over and over again. This repetitiveness isn't necessarily bad. If it's not broke, why fix it? Yet, there may be new levels to this ish if we dig a little deeper. For starters, make sure you've mastered the basics. You will never run out of reasons to use arrays, linked lists, sets, hash tables, trees, graphs, heaps, etc. For the various structures, it may be worth reviewing the properties and time-complexities for their operations. You should be able to compare their pros and cons. For example, why use an array over a linked-list? Or vice-versa? Sure, knowing about data structures is cool; however, it's important you also know how to utilize them effectively in real-world applications.

## Algorithms

Of course, once you know a bunch of data structures, you need to make use of them. Thus, let's bring on the algorithms. While investing time learning and implementing new algorithms is worth it, I would encourage you to learn [algorithmic patterns](https://cs.lmu.edu/~ray/notes/algpatterns/). Some of the new problems you run into will look like problems you've already seen. Be smart and leverage that knowledge instead of reinventing the wheel.

In addition, you should already be familiar with measuring the runtime and space complexity of an algorithm using [asymptotic analysis](http://www.cs.cornell.edu/courses/cs312/2004fa/lectures/lecture16.htm). Asymptotic analysis gives a machine-independent way of measuring performance. It's useful to say that mergesort has an \\(O(n \log n)\\) worse case running time, which is superior to bubble sort's \\(O(n^2)\\) worse case running time. If this notation looks like hieroglyphics to you, consider brushing up on this topic.

I would also recommend people get comfortable using [recursion](https://www.cs.cmu.edu/~adamchik/15-121/lectures/Recursions/recursions.html). Yes, it's not always useful and can sometimes make the code more convoluted. It can also have the opposite effect. Look at the recursive algorithm to solve the [Tower of Hanoi game](https://en.wikipedia.org/wiki/Tower_of_Hanoi#Iterative_solution)--and then compare it to the iterative version. There are just some problems in the world that lend themselves to recursive solutions. Plus, it will help expand your mind. Challenging yourself is worth it in the long run.

## Learn a New Language Paradigm

With a few exceptions here or there, most people are introduced to programming nowadays via an imperative, object-oriented language. This, once again, isn't necessarily bad. Examples include Java, JavaScript, Python, C++, C#, and Ruby. There's nothing wrong with any of these languages, and you could probably start your career by learning any of them. 

Yet, in my journey so far, I have found it insightful to learn new language paradigms. This could mean learning a whole new programming language or discovering previously unknown abilities in your current favorite language. Before I go any further, I should probably define some terms. After all, what do I mean by language paradigms?

Language paradigms are a way to classify programming languages based on their features. To note, languages can fit into multiple paradigms--they need not be mutually exclusive.

Object-oriented is an example of a paradigm. Most readers are probably already familiar with the notion of creating objects and defining the relationships between them. Yet, not all languages are object-oriented. It's worth it to explore. I recommend people try learning either a functional language or a logical language. 

An example of a functional language would include [Racket](https://racket-lang.org/). If Racket's syntax doesn't terrify you, [consider checking out some of the code examples elsewhere on my website](/state-space-algorithm/). To note, functional languages place a lot of emphasis on applying and composing functions--and often make use of immutable data structures and recursion. Keeping in mind some of my earlier recommendations, you could knock many birds with one stone.

Honestly, I've haven't done much with logical languages. It's on my list of things I might learn one day. You, however, can one-up me by diving into one of these languages. An example would include [Prolog](https://en.wikipedia.org/wiki/Prolog)--but there are others. These languages solve problems using formal logic so be prepared to brush up on some math.

There are many other language paradigms, and I am not going to attempt to mention all of them here. You could, for example, explore the difference between dynamically-typed languages and statically-typed languages. It's worth thinking about why type systems are useful in the first place. Another set of interesting paradigms would include imperative languages vs. declarative languages. I've already mentioned imperative languages. They allow the programmer to explicitly set the program's state using statements. You're telling the computer what to do--step by step. In contrast, a programmer using a declarative language only tells the computer what they wanted to be computed, typically within the restraints of some problem domain. The computer then figures out how to solve the problem. Examples of this kind of language would include [Prolog](https://en.wikipedia.org/wiki/Prolog) and [SQL](https://en.wikipedia.org/wiki/SQL).

## Master Your Tools

I often overlook this one. Investing some time into mastering the tools and programs we use every day can pay dividends later on. It could be as simple as learning a few keyboard shortcuts. You should at the very least be comfortable in your favorite text editor--maybe use Google to try to find useful features you've overlooked. I would also recommend figuring out how to use a version control system, such as [Git](https://git-scm.com/). If you know how to setup remote branches, fork projects, handle merge conflicts, and rebase, you may know more than many fresh computer science graduates. Trust me, I have stories. Bored of my suggestions so far? You can always just try new software. Download a new editor and mess around. Use a new framework. You'll probably learn something useful.

## Conclusion

I'm going to end the post here, but there are obviously many other skills to work on. This list isn't meant to be complete. I mostly tackled topics I either covered in college or felt familiar with. Also, many of these sections are intentionally sparse. I am going to leave it up to you to do some research on your own. Hopefully, in the future, I can expand on some of these ideas in future posts.