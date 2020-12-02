---
title: The Share API
date: 2020-11-04
description: An introduction to the Share API
mainImage: forest-landscape.jpg
smallImage: forest-landscape-small.jpg
mainImageAltText: A beautiful forest
assets:
    scripts:
        - shareApiPost.js
---

As an introvert, I don't really want people to see my website, so I put in a share button.

*sarcasm*

For real though, we have become acclimated to those colorful social media share buttons on websites. I considered adding a few to at least signal to people that I'm okay with them sharing my essays. You can share them—help me become famous. Yet, I don't like the buttons. They're a little ugly and something else I have to maintain. Plus, if the landscape of social media shifts, then I would have to change the buttons. And this happens. Real people had to remove Google Plus references from their website.

## The Share API

Luckily, the Internet gods have tried to help us from slapping gaudy buttons into the DOM. We now have the Share API. Introduced in 2017, the Share API allows the browser to tap into your device's native share behavior.

<img 
    src="/assets/images/share-api-dialog.jpg" 
    alt="The Share API dialog on an Android phone"
    style="max-width: 200px; transform: rotate(-45deg)"
/>

Since this API is relatively new, [support is a little shaky.](https://caniuse.com/mdn-api_navigator_share) It will at least work on Safari, Microsoft Edge, and mobile versions of Chrome. And I'm sure we'll see better adoptance in the future. In the meantime, we can implement a simple check for browser support. On my site, if it's not supported, I just don't show anything to the user; however, you could just as easily create a fallback.

Another random thing to note, you must either be using HTTPS or localhost. I'm not exactly sure why—it's probably due to people sharing potentially sensitive information. For example, you can share things like pictures, videos, audio, and text files, and these things could definitely be sensitive.

## Ok, Share Something

Let's do a quick implementation. I'll show off some HTML and JavaScript. But thankfully, there's not much to this.

We only need a single DOM element for our users to interact with. As mentioned, there's no need to hardcode an array of buttons, links, etc. For this example, I'm going to create a button, but you can use anything that makes sense for people to click, such as a link or a card.

When the button is clicked, two different outcomes can occur. For one, the user's browser can support the Share API. Upon clicking, they will get their device's native share dialog. This share dialog--typically--will only show relavant sharing options. Does he or she have Facebook? Then, they'll get that option. Thus, you don't have police what options to provide--this takes a lot of pressure off me. The user can share the content to their favorite platforms, and I don't have to put sketchy third party code on my website.

On the other hand, many browsers still don't support the API. We'll implement a silly fallback here. For a real site, you'll want to create something--well--better. But importantly, we can fall in line with progressive web design. The user is still able to browse the site even with an old browser or with JavaScript disabled.

For this example, we'll literally only need a single function: navigator.share.

<script src="https://gist.github.com/froggermtp/39dd5be8fe03f6d28ee6f5f0be33e910.js"></script>

I do a quick check to see if the function exists. Browsers that don't support the share API won't have it, and our fallback can kick in. And I'm just passing the API some generic information about this webpage. [You can read more about how to format the parameter here](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)--but it's not much more complicated then what I show above.

Behold! A share button:

<button class="js-tutorial-share" style="background-color: black; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px;">Share!!!</button>

## Sharing Is Caring

Hopefully, you have a browser that supports the API so that you can see it in action. All of my rambling will make more sense if you use it yourself. Of course, you've probably been using some representation of the share dialog on your smartphone--native apps have been privy to it for a long time. Now, we can leverage the same capabilities for the web. I hope my essay was helpful, and this goes without saying--feel free to share the post.