---
title: Simulated Annealing
date: 2020-06-05
description: Simulated annealing tutorial, with a code example written in R
mainImage: /sheet-metal.jpg
mainImageAltText: Sheet metal texture
---

Sometimes, a problem doesn't have a known, efficient, deterministic algorithm. This hiccup isn't necessarily a big deal because often we only care about getting an answer that is close enough. One algorithm that can give approximate values for hard to solve problems is simulated annealing. Before jumping into the R code, let's look at a motivating example.

## Motivation
The traveling salesman problem doesn't have a polynomial-time deterministic algorithm and thus is a good candidate for us to explore. The problem name itself nearly gives away the details. Imagine a map with some fixed number of randomly placed cities. We now want to hire a salesperson—let's name her Sally—who needs to visit every city, without revisiting any city, to sell some product.

When the number of cities is small, we can use brute force techniques to try every possible permutation of city orderings. Of course, for a relatively large amount of cities, trying to find the route this way will be intractable. We aren't completely doomed though. Do we care if Sally takes the most optimal route? For this situation, not really. While we want Sally to take a fast route, it doesn't have to be the fastest route. Luckily, it turns out that simulated annealing can tractably generate fast routes.

## How does it work?
The traveling salesman problem is a little complicated, so let's set up a toy problem instead. For this demonstration, we are going to find the global minimum of the sine function for the domain [0, 2π]. For the mathematically inclined, you could use techniques from calculus class to find that the answer is -1. Thus, if our algorithm's answer is not in the same ballpark as -1, then we know something went wrong.

### State Spaces
Simulated annealing searches through a state space iteratively. An iterative algorithm begins with an initial guess. This guess is then potentially upgraded every iteration of the algorithm to produce a better approximation. For our demonstration, we'll end the algorithm after a fixed number of iterations.

Taking care of the initial guess is easy--just choose a random valid state. From the initial guess, we'll need to find it's neighboring states and check to see if they're better. Disappointingly, there is no single method to derive neighboring states. We'll have to come up with a method specific to our problem.

Here, I want to keep things simple. The implementation below adds a random number from the range [-0.1, 0.1] to the current state to generate the successor. I also wrap the new state value around if it exceeds the range [0, 2π]. 

<script src="https://gist.github.com/froggermtp/8b9e5b6e999b5d77ef0acaadb1092a69.js"></script>

Of course, you can experiment on your own. For example, try thinking of new ways to generate neighboring states.

### Temperature Schedule Go Brrr
This temperature idea is what gives simulated annealing its name. The temperature value of the algorithm is analogous to the role of temperature when annealing metal. To anneal metal, the metal is first heated and then slowly cooled over time. This cooling process allows the metal to have improved ductility and reduced brittleness. By enduring a long cooling period, the metal is improved. Similarly, the rate at which the "heat" of the algorithm is decreased determines the accuracy of the approximation.

The "heat" of the algorithm affects the probability that it will make a bad move on purpose. Surprisingly, the algorithm sometimes needs to make bad moves to reach the global optimum. Why? There is a chance that it might get stuck on a local optimum. By making bad moves, the algorithm can potentially stumble its way out of local optimum (but this isn't guaranteed).

You can choose any number to be the initial temperature. The temperature schedule then determines how the temperature value will decrease every iteration. Like choosing neighboring states, there is no right way to decrease the temperature. The only rule of thumb is that the slower the temperature is dropped, the better the approximation will be. The tradeoff is that you'll have to wait longer to get an answer. Thus, choose something that short enough for your attention span and long enough to get a good answer. 

For our toy example, I choose to subtract an arbitrary number every iteration. 

<script src="https://gist.github.com/froggermtp/cbae4d7960586428dd77b3514f444b1a.js"></script>

Once again, feel free to get creative and try different initial values and schedules for your implementation.

### Probabilistically Making Moves
Every iteration a neighboring state is generated. The algorithm will always replace the current state with the new state if it's better. As we just discussed, the new state may be worse--dragging us further away from an optimum. Yet, we want to randomly make some bad moves with some probability. The key to simulated annealing is that this probability is not constant. Rather, it on average decreases over time.

The probability of choosing the new state is defined as the following formula:

$$\exp(\frac{\bigtriangleup E}{T})$$

Two parameters affect the probability The "change in E" parameter is the difference between the function applied with the potential new state and the function applied with the current state. The bigger this difference, the smaller the probability. The next parameter is the temperature value, which we've already seen. Obviously, for every iteration of the algorithm, the temperature value will decrease--causing the probability to decrease slowly.

As the temperature gets closer to zero, the probability of choosing a bad move will also get closer to zero. Towards the end, the algorithm will mostly take greedy moves towards better states. Once the temperature hits zero, then the algorithm is done. We can get our answer and go home.

## Put Everything Together
We've covered all the important parts of this algorithm. Let's put everything together and see it in action. Here is the full code for my solution.

<script src="https://gist.github.com/froggermtp/bc36402fa41ec7733e6758e1e6a241e6.js"></script>

I decided to capture the state for every iteration and graph the result. As you can see, the initial state is nowhere near -1. As the algorithm progresses, it begins to slowly converge. Towards the end, the probability of choosing bad moves is near 0, which is why the downward slope for later iterations is steep.

![Simulated annealing plot](/assets/images/simulated_annealing_plot.svg)

For this run, I got a final state of 4.703329. The corresponding sine value is -0.9999590, which is close to -1. These two values match what we expected.