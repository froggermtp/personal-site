---
title: Everybody Hates Recursion
date: 2020-07-11
description: A tutorial covering recursion and tail call optimization, with code examples written in PHP
mainImage: recursive-hand-painting.jpg
smallImage: recursive-hand-painting-small.jpg
mainImageAltText: A painting showing hands painting other hands
---
Everybody hates recursion. Well, maybe I'm exaggerating but the technique is often dismissed as useless and complicated. You may be thinking: "I'll just keep my loops please." And there's nothing wrong with that. In many situations, loops or higher-order functions are the natural solution. Not to mention, some languages have poor support for recursion—but I'll dive into that part later.

## But Why?

So, why should you even bother with the esoteric technique? I'll list a few reasons. For one, some problems can easily be expressed recursively—the [Tower of Hanoi](https://en.wikipedia.org/wiki/Tower_of_Hanoi) puzzle quickly comes to mind. Second, some programming languages emphasize recursion as a key language feature. This is true for many functional programming languages. For example, it is one of the things that tripped me up when learning [Racket](https://racket-lang.org/), a modern implementation of Scheme. The language has no looping constructs, so you're often forced into using recursion. Finally, I think it's good to learn new things. Why stay stagnant? The world is worth exploring.

## Explain It Please

To solve a problem using recursion, it must take on a pattern, which I'll describe here. For one, the technique assumes that the problem can be broken down into smaller versions of the same problem. At some point, the breakdown process can no longer continue because an axiomatic form of the problem is reached. We'll call this fully simplified form a base case. These base cases—there can be more than one—are hardcoded by the programmer. Every recursive function needs at least one base case. Otherwise, it's as if you wrote an infinite loop. Of course, you also need a self call—i.e., you call the function within the same function's body. Usually, the self call will grapple with a reduced version of the problem—this should obviously tie into the work on a smaller problem idea. Once the recursive function is called with a state corresponding to a base case, the function returns some special value, and the chain of function calls is finitely capped.

## Factorials

I am going to interrupt our train of thought to inject an example. So, let’s stare at this code representing the [factorial function](https://en.wikipedia.org/wiki/Factorial). For contingency reasons, in case your highschool math teacher failed you, I’ll explain this super quick. Say we want to compute one factorial. Well, that’s just one--and hint, it’s one of the base cases. But what if you want to compute 2 factorial. Then, you simply take 2 * 1. Following the pattern, three factorial is 3 * 2 * 1. Yeah, there's not much to this. The formal definition is that the factorial of a positive integer *n*, denoted by *n!*, is the product of all positive integers less than or equal to *n*. As an aside, we randomly assign that zero factorial is equal to one--this is the other base case. Ok, some code stuff.

```php
function factorial($n) {
    if ($n < 0) {
        throw new Exception("\$n parameter cannot be negative");
    }
    else if($n <= 1) {
        // base cases
        return 1;
    }
    else if($n > 1) {
        // self call; note how the problem is reduced
        return $n * factorial($n - 1);
        // also, the multiplication is the last operation
        // this is not tail recursive
    }
}

assert(factorial(0) === 1);
assert(factorial(1) === 1);
assert(factorial(2) === 2);
assert(factorial(11) === 39916800);
```

Hopefully, the base case and the self call are obvious. If you're confused about how the code works, I recommend getting out a sheet of paper and tracing out what happens for different inputs. Also, please note that the $n parameter must be greater than zero. Otherwise, everything will break because the factorial sequence is only defined for positive values and zero.

## The Call Stack

It's important to note that each time a function is called, information about it must be pushed onto the [call stack](https://en.wikipedia.org/wiki/Call_stack). For the uninitiated, I'll briefly explain this process. To start, there's nothing special about this [stack](https://en.wikipedia.org/wiki/Stack_(abstract_data_type))--we are still pushing and popping. In this case, we are pushing frames onto the stack that contain information about the function such as its parameters, its local variables, and a return address.^[To note, the return address is like a bookmark that designates to the computer where to jump back to after the function call ends.] The call stack's implementation is language and machine specific so let's not get lost in the details. Basically, frames are pushed and then popped from the call stack as functions begin and end execution respectively. Cool, but why do we care? Well, these frames take up memory—and the computer only has a finite amount of memory. Therefore, there is going to be some hard cap on the number function calls that can be nested. If the computer runs out space for a new frame, then a stack overflow error will be thrown by most languages. Usually, recursive functions are prone to these types of errors—not because the programmer made a mistake—but due to the natural limitations of nesting large amounts of function calls.

## Tail Call Optimization

While many people simply hate recursion due to personal preferences, there are times where using the technique is a bad idea. As I just mentioned, information about function calls has to be pushed onto the call stack, which takes up memory. Many languages have arbitrary limits on the depth of the call stack. For example, [Python sets its limit at about 1000 before triggering a stack overflow](https://www.geeksforgeeks.org/python-handling-recursion-limit/). Thus, memory usage is a huge issue when using recursion. In contrast, iterative techniques, such as for loops, don't have this problem because they only require a constant amount of memory regardless of the number of repetitions. But don't worry about this sad news. Some languages implement an idea called tail call optimization that can save us.

Assuming the language has tail call optimization, a tail recursive function will only take up constant space on the call stack. Although simple, the concept seems to confuse many people. The self call has to be the last operation of the function. Importantly, this does not mean the last line. For an example, review the factorial function from earlier. The last operation is the multiplication, not the function call.

To convert our factorial function to be tail recursive, a few changes have to be made. Importantly--and this is worth repeating--the self call has to be the last operation. To pull this off, it turns out an extra parameter has to added to track the accumulated changes to the answer. Let's just look at the code.

```php
function factorial_tail($n, $acc=1) {
    if($n < 0) {
        throw new Exception("\$n parameter cannot be negative");
    }
    else if($n <= 1) {
        // base cases
        return $acc;
    }
    else if($n > 1) {
        // self call
        return factorial_tail($n - 1, $n * $acc);
        // function call is last operation; tail recursion!
    }
}
      
assert(factorial_tail(0) === 1);
assert(factorial_tail(1) === 1);
assert(factorial_tail(2) === 2);
assert(factorial_tail(11) === 39916800);
```

## Proving the Constant Space Hypothesis

So what makes tail recursive functions noteworthy? After all, like all functions, they must be allocated on the call stack.^[Ok, so in real life, there are multiple different ways to implement tail call optimization. The programming language isn't necessarily prematurely dropping stack frames. Yet, the ideas I show here give an intuition about why we can even attempt the optimization.] Yet, something special happens when nesting these types of functions: the final nested function call’s return value will be the final answer. To prove I'm not making stuff up, study the following diagram of a call stack for the tail recursive factorial function.

<img src="{{ "factorial_tail_call_stack.svg" | imagePath }}" style="max-width:193px">

From the diagram, it's obvious that the final frame will have a return value of six, the final answer. If we bothered to maintain all the frames and bubble the value back down, then the six would get funneled straight through. Thus, there is no point in keeping the early frames. We can safely discard them.

Now, let's imagine a bad situation. If the function isn't tail recursive, then you'll have to store all the frames and backsubstitute to get the answer. We can't prematurely pop off the early frames because we need information from later calls to complete the last operation. Try getting out a piece of paper and tracing the non-tail recursive factorial function to see why this is the case.

Now, disappointingly perhaps, a lot of programming languages do not implement tail call optimization--and this includes most imperative languages. In most cases, you can find out if a language has tail call optimization with a Google search. Alternatively, I guess you could execute a deeply nested recursive function and see if you get a stack overflow error.

## Conclusion

Thanks for reading my ramblings about recursion. On one level, it’s not so hard. Your function only needs three properties to be recursive and useful: it must have at least one base case, it must call itself, and the input must be reduced for each subsequent self call. They are a great way to solve problems that built from smaller identical subproblems. Yet, I wouldn't force the technique when it's not needed. Without tail call optimization, recursion is way less powerful. In fact, I would recommend experimenting with recusion using a functional programming language. These languages are built around function calls and are often dependent on recursion for doing iteration. Anyway, I hope this guide in­spires you to play around with this con­cept.