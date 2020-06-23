---
title: State Space Algorithm
date: 2020-06-19
description: A tutorial over the state space algorithm, with code written using Racket.
mainImage: /img/spiral-galaxy.jpg"
mainImageAltText: NASA's Hubble space telescope image of NGC 1672 which is a barred spiral galaxy located in the constellation Dorado
useMathJax: True
---
Recently, I implemented the state space algorithm in [Racket](https://racket-lang.org/). It's a simple algorithm that can find a goal state in n-dimensional [Euclidean space](https://en.wikipedia.org/wiki/Euclidean_space). All one needs is a computable function, a starting domain, and a goal value.

## How does it work?

For example, let's say we want to find an input for cosine that gives us one of the zeros for the domain 0 to 2π. Of course, there's no need to use the algorithm in this case. We could look at a [unit circle](https://en.wikipedia.org/wiki/Unit_circle) and find that applying cosine with the value 3π/2 gives us zero. Alternatively, the value of π/2 works just as well. Shortly, we'll discover how the algorithm will nondeterministically return one of these two zeros--and in this case, we don't favor either state. Any zero will do.

The main idea of the algorithm is to tighten the domain around a state that satisfies the goal. This process is done iteratively. Every crank, the code will generate K random guesses for a goal-satisfying state within the current domain. The K parameter has to be any positive integer, but you get to choose it. I recommend trying different values for K to see how that affects the outcome.

The best state out of the set of K--i.e. the guess that gives an output closest to the goal--will be set aside. This guess is selected by finding the K range value that minimizes the formula below. Note that *y* is the guess and *y<sub>g</sub>* is the goal value.

$$|y - y_g|$$

Obviously, in the beginning, the best state is likely far off from the goal state. The chance to generate a satisfiable guess increases as the domain shrinks around a goal-satisfying state, which happens every iteration. 

To get this new domain, there are a few steps to follow. First, let's find the average of the absolute values of the differences of the K range values and the goal value, which we'll call *u*.

$$u = \sum_{i=0}^{K} | y_i - y_g |$$

Next, we'll need a so-called epsilon value to scale our new domain. To compute it, use the following formula:

$$\epsilon = \frac{|y - y_g|}{u}$$

The numerator is the absolute value of the difference of the best K range value and the goal--which we computed earlier. The denominator is the *u* we just computed. So, you should only be plugging in numbers here.

Finally, insert our prerequisite work into this formula to generate the new domain. Note that the *x* is the best state out of the set of K states. The *b* is the end value of the current domain; the *a* is the beginnning of the domain.

$$x \pm \epsilon \frac{b - a}{2}$$

The algorithm will thus generate K range values and use the best one to create the new domain for the next iteration. We'll continue this process until one of the generated guesses is within an error bound that we choose. 

## Conclusion

Astute readers may have noticed that this is a variation of a beam search. According to Wikipedia, [beam search](https://en.wikipedia.org/wiki/Beam_search) is a heuristic search algorithm that explores a graph by expanding the most promising node in a limited set. In this case, our "graph" is the domain. Thus, we are working over a continuous space rather than a discrete space; however, since we can effectively reduce the search space, the algorithm works. Well, works is fudgey term. I believe that the algorithm can sometimes fail to find a solution since it isn't mathematically guarenteed to converge the domain around a goal-sastifying state. Increasing the K parameter should help--more guesses increases the chance of one them being good.

Here is the code for my complete solution. As a reminder, the algorithm is looking for a zero of the cosine function for the domain 0 to 2π. To note, K is set to 3, and the error bound is set to .01.

<script src="https://gist.github.com/froggermtp/694ea127181205157f27261dd4508c57.js"></script>

For a single run, I got a state value of about 1.566, which is close to π/2. Since π/2 is one of the valid zeros, the algorithm's outcome is what we expected. You should keep in mind that it's possible to get a state value near 3π/2, the other zero. Consider running the algorithm multiple times to get a feel for how things work.