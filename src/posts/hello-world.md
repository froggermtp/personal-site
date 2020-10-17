---
title: Hello World
date: 2020-05-29
description: Learn why I am blogging and how I built the blog
mainImage: /img/pale-blue-dot.jpg"
mainImageAltText: The Earth in a sunbeam
---

For the last few years, I've kicked around the idea of starting a blog. The main obstacle in my way has been time. With college over, I've found the inspiration needed to ship this thing. It is not finished per se; however, I feel comfortable sharing it with the world.

## Why?

I am writing mainly to share ideas. As Naval said, "Don't write to make money, write to build relationships with like-minded people that you haven't yet met."[^1] Thus, if you find any of the ideas interesting, feel free to reach out to me. I regularly check my email and periodically check my social media direct messages.

As a byproduct of writing, I want to think better. David Perell argues that "an empty white page is a mirror into your mind. When the ideas in your mind are clouded, so are the words on the page in front of you. Re-writing is re-thinking. It’s the best single best way to sharpen your ideas."[^2] From my own experience, I found this sentiment to be true. Writing forces you to more precise with your thoughts.

And I need to find clarity on some issues. If college did anything, it certainly scrambled my brain. I have a lot of random, disconnected pieces of knowledge. I want to try to fit it all together--or at least forget wrong or unhelpful information. 

## What?

For the moment, the blog won't have a particular theme. I hope to somewhat narrow down on something as the blog develops. To note, I graduated with a degree in computer science and currently have a job as a software developer. Therefore, you can expect some computer-related articles. There also might be some Jesus-smuggling, but I promise to be nice about it.

I don't want to brand myself, at least intentionally. I want the blog to sound like me and to have some rough edges. Thus, the ideas shared here may be wrong. Feel free to correct me (kindly). I will probably be correcting myself. I couldn't count how many times I have changed my mind in the last few years.

## The Plan

My initial plan is to try to post once a week. I am publishing this goal as a way of keeping myself accountable. When left to my own devices, I have a habit of not finishing things. Hopefully, I'll stay focused and stick with this for an extended amount of time. It may take a while for something interesting to develop here. Maybe, it will be me talking to myself. Who knows?

## Technical Details

If you don't care about the technical details behind the blog, you can stop reading now.

The blog is built using a static site generator called [Eleventy](https://www.11ty.dev/). I like the framework because it is written in JavaScript. JavaScript is a language that I already know. This familiarity makes tweaking the configuration file and writing plugins a breeze. 

The frontend work is currently being done with the template engine [Nunjucks](https://www.mozilla.github.io/nunjucks/) and some vanilla CSS. Nunjucks is relatively close to standard HTML, so learning it wasn't too bad. Now, I didn't have to use Nunjucks. Eleventy is compatible with many other template engines, but a lot of the documentation is targeted at Nunjucks. When learning Eleventy, it's worth keeping that in mind.

The website is currently deployed on [Netlify](https://www.netlify.com/). Netlify is a SAAS company that empowers people to build websites "without servers, DevOps, or costly infrastructure."[^3] Honestly, I don't quite know what all Netlify can do. So far, I'm only using them to host this blog.

But I've found their product easy to use. It also has a free tier--which means that the variable costs for this blog sit at zero dollars. The free tier has limitations, but this little blog should never hit them. 

I don't want to ramble on any further. This website should sustain our appetites for the time being. And there's plenty of features to implement and essays to scribble out. Sigh. I'll get to work.

[^1]: I don't have all my thoughts together on Naval. I found him on Twitter. He has insightful ideas and a knack for speaking the profound precisely. [I'll link to the tweet the quote comes from, hopefully it doesn't disappear too quickly.](https://twitter.com/NavalBot/status/1264647582522970113?s=20)

[^2]: David writes a lot about writing on the Internet. [This quote was taken from this article.](https://www.perell.com/blog/why-you-should-write)

[^3]: Did I copy some advertising from Netlify's website? Yes. Anyway, you should check out their website if a more detailed walkthrough of what Netlify can do.