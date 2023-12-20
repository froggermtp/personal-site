---
title: Why Casing Matters with PHP Autoloaders
date: 2021-03-13
description: Learn how to autoload in PHP using PSR-0, PSR-4, and classmaps--with special attention given to casing issues.
mainImage: art-deco.jpg
smallImage: art-deco-small.jpg
mainImageAltText: Black and white interlocking triangles
---
Contrary to popular belief, autoloading isn’t magical. There are well defined rules for how your class, trait, or interface definitions are swooped in.

My purpose here is help you understand the basics behind autoloading a little better. I’m assuming you have some prior knowledge of PHP. It will be helpful if you’ve used [Composer](https://getcomposer.org/) as well, but I’ll try to explain things as we go.

In my opinion, knowing how to write an autoloader isn’t that important, so I’m not going to cover that in great detail here. Rather, I want people to be familiar with the autoloading standards and some gotchas. It might seem silly at first, but I hope you gain a better grasp of what PHP is actually doing.

## Let’s do this without the autoloader

Back in the days of yore, PHP didn’t have an autoloader. People had to get their hands dirty by manually including their files--or maybe they put everything in one big script (I see you). These aren’t the best options. But for next couple of examples, it’s what we’re going to work with.

First let’s just create a class definition and then use it. Scared yet?

```php
<?php
    
namespace Tutorial;
    
class WordPrinter
{
    public function print(): void
    {
        echo 'Hello World!';
    }
}

$printer = new \Tutorial\WordPrinter();
$printer->print();
```

Some unnecessary boilerplate later, we have managed to create a “Hello World” example. I want to focus on the class definition part. The class name is {% highlightCode %}\Tutorial\WordPrinter{% endhighlightCode %}. Pay attention to the casing. Notice how the class reference (the part where we newed up the instance) is cased exactly the same. Does that matter? What happens if you add this to the end of file?

```php
$printer2 = new \TuToRiAl\WoRdPrInTeR();
$printer2->print();
```

It prints “Hello World!” twice. And this result shouldn’t be surprising at all. Classnames in PHP are case-insensitive. There is nothing crazy going on here yet.

Here’s another curve ball. Add this code to the end of the file.

```php
(function() {
    $printer = new \Tutorial\WordPrinter();
    $printer->print();
})();
```

We get three “Hello World!” texts. Cool but what’s the point here. It turns out class, trait, and interface definitions are always global. Say it with me kids! We can access the class definition inside the function, even though it has a different scope. We get a new $printer variable, but the same old {% highlightCode %}\Tutorial\WordPrinter{% endhighlightCode %} class.

This concept is obvious if we inverse the situation.

```php
<?php

namespace Tutorial;

(function() {  
    class WordPrinter
    {
        public function print(): void
        {
            echo 'Hello World!';
        }
    }
})();

$printer = new \Tutorial\WordPrinter();
$printer->print();
```

We get a “Hello World!.” The class definition is not restricted to the function’s scope. Once again, this also applies to trait and interface definitions.

PHP keeps tables mapping class, interface, and trait names to their definitions. Each request gets its own set of tables. A name can only be mapped to single definition—like a dictionary data structure. This is why you can't have a single name mapped to multiple definitions. PHP will throw an error.

```php
<?php
// This will definitely error. The name Foo can only map to one definition.
class Foo {}
class Foo {}
```

Includes and requires don't change our situation much. Autoloadable (I'm allowed to make up words) definitions are global once they are executed. So we can put our class, traits, and interfaces into separate files to keep everything organized.  Then, tell PHP explicitly to bring the file in. Here’s a quick example:

```php
<?php

class Foo {}
```

```php
<?php

require __DIR__ . '/Foo.php';

class Bar extends Foo
{
    public static function HelloThere()
    {
        echo 'Hello There';
    }
}

Bar::HelloThere();
```

Wouldn’t it be cool if PHP knew to drag that file in on its own?

## Ok, Autoloaders

Surprise! Autoloaders include or require in the file automatically. You don't have to litter your code with includes, and only the classes you need for that request have to be fetched. This is better by far.

Since PHP version 5.1.0, you can register an autoloader using the [spl_autoload_register](https://www.php.net/manual/en/function.spl-autoload-register.php) function. More than one can registered—there's a queue of them. I only mention this because you may need more than one, and their order may matter. Here, I'll be using Composer. 

Composer is the package manager for PHP. It also will setup an autoloader for us. Very cool. [You can download it here.](https://getcomposer.org/download/)

So when is the autoloader invoked? It's used nearly everywhere you need access to a class, interface, or trait. Generally, you don't have think about it. You code should "just work."  PHP is smart enough to use the autoloader any time it needs to try a find an autoloadable definition. Now, keep this in mind. PHP will not have to check the autoloader if that definition has already been loaded. It augments the behavior we saw earlier. Let’s look at a quick example:

```php
<?php
// Assume this class is autoloadable
$foo = new Foo();
// The first time the class is referenced, the autoloader is used.
// The class Foo is now in PHP's class table
var_dump(class_exists('Foo', false));
// The class_exists function by default will use the autoloader to check if the class exists
// By passing false as the second parameter, it won't use the autoloader
// We still get true here! It's in the class table remember
var_dump(class_exists('FOO', false));
// True again! Remember PHP doesn't care about the casing for class names
// But what happens if the autoloader has to find the class FOO
// We'll look at that case in a minute
```

Once the autoloader is triggered, your registered function (or functions) have to find the file that contains the definition. It would be helpful if there was some consistent way to map definition names to filenames. Oh wait, there is!

## PSR-0

A committee called [PHP-FIG](https://www.php-fig.org/) maintains a list of PHP standards recommendations (PSRs). Since programmers like counting from zero, the first recommendation is PSR-0, and it involves how to name classes to play nice with the autoloader. [You can read the standard itself for all the glorious details](https://www.php-fig.org/psr/psr-0/), but the idea is simple. We are going to map namespace separators to the directory separator for the current operating system. Composer supports this out of the box.

```json
{
    "autoload": {
        "psr-0": {"Tutorial\\": "src/"}
    }
}
```

Run a {% highlightCode %}php composer.phar dumpautoload{% endhighlightCode %} for Composer to generate the autoloader.

Let’s get our WordPrinter class to play nice with the autoloader. For it to recognize our class, we’ll have to name it to match the the prefix provided in the config. And I’m going to emphasize: you have to match the casing of the prefix. Composer is case-sensitive. We already have a Tutorial namespace declared, so we’re good.

Where should this file be placed? Before you could put files wherever—as long as the include paths were correct. Now the namespace maps to a path. The path is always relative to the location of the composer.json. You’ll match the namespace to entry in the composer.json and take the corresponding path part. Then flip all the namespace separators to directory separators and slap a .php to the end. So you’ll put the file here.

{% highlightCode %}/path/to/composerJson/src/Tutorial/WordPrinter.php{% endhighlightCode %}

The Tutorial namespace maps to the Tutorial folder. The casing of the folder should match the casing of the namespace. You have to do this on a case-sensitive filesystem. When straight up using the PSR rules, Composer has to look up things in the filesystem at runtime.

Eww. I know. But there’s a fix: classmaps. We’ll look at these shortly.

## PSR-4

As time went on, people realized that forcing the namespaces to directly map to the path was inconvenient.  It doesn’t play as nice with how Composer handles packages. [You can read more about this here.](https://www.php-fig.org/psr/psr-4/meta/) Anyway, a new standard was proposed for autoloading: [PSR-4](https://www.php-fig.org/psr/psr-4/). It’s not too much different on the surface of things. We can have the exact same directory structure as before.

```json
{
    "autoload": {
        "psr-4": {"Tutorial\\": "src/Tutorial/"}
    }
}
```

You should notice that we had to directly map the Tutorial namespace to the Tutorial folder in the composer.json. But we choose to do this! It wasn’t forced on us. We could map the namespace to any folder.

```json
{
    "autoload": {
        "psr-4": {"Tutorial\\": "src/AnotherFolder/"}    
    }
}
```

And that’s pretty much it. It’s kinda PSR-0, except the prefix doesn’t have to match the folder. You can imagine we removed the prefix from the class name, appended that prefix’s path to our existing base path, and did PSR-0 the rest of the way.

Let’s create an example using the above composer.json. All the classes in the Tutorial namespace have to be in the AnotherFolder directory (or one its subdirectories). The part of the namespace that doesn’t match the prefix in the composer.json has to map to the filesystem.

Let’s walk through this process.

The Tutorial part of the class name matches our prefix, so we’re going to “remove” it for now.

That leaves us with {% highlightCode %}\Factory\SomethingFactory.php{% endhighlightCode %}.

Extend our composer.json base path with the path corresponding to the prefix, like so:

{% highlightCode %}/path/to/composerJson/src/AnotherFolder{% endhighlightCode %}

And then PSR-0 the rest of the class name, adding it to the end of base path.

{% highlightCode %}/path/to/composerJson/src/AnotherFolder/Factory/SomethingFactory.php{% endhighlightCode %}

Ta-da! We mapped the class name to a path. Similar to PSR-0, Composer can look up the locations of files at runtime using the PSR-4 rules. Yet, that’s slow. Let’s fix that with classmaps.

## Classmap

Composer offers a third way to autoload—and this way is technically the simplest. We can generate a classmap. It’s simply a key value mapping. The key is the autoloadable item, like a class, interface, or trait. The value is the file path. Composer will put the mapping in the its generated vendor/composer folder. Look for the autoload_classmap.php file. It will look something like this:

```php
<?php

// autoload_classmap.php @generated by Composer

$vendorDir = dirname(dirname(__FILE__));
$baseDir = dirname($vendorDir);

return array(
    'Composer\\InstalledVersions' => $vendorDir . '/composer/InstalledVersions.php',
    'Tutorial\\Factory\\SampleFactory' => $baseDir . '/src/AnotherFolder/Factory/SampleFactory.php',
    'Tutorial\\WordPrinter' => $baseDir . '/src/AnotherFolder/WordPrinter.php',
);
```

You can convert your PSR-0 and PSR-4 rules in Composer to classmap rules by passing the --optimized flag to the install or dumpautoload command. So something like {% highlightCode %}php composer.phar dumpautoload --optimized{% endhighlightCode %}.

You can also list directories in the classmap section of the composer.json, but this isn’t recommended. It will force you to dumpautoload anytime you add a new file—Composer won’t use the PSR rules. If you use the PSR rules, Composer can look up where the file is on the fly as already mentioned. This behavior is convenient in development environments—but it’s too slow for production. You should always create the optimized classmap for production environments. It is worth adding some time to your build.

When Composer’s autoloader is triggered, it will try to look up the given name in the classmap first (or always if an [authorative classmap](https://getcomposer.org/doc/articles/autoloader-optimization.md#optimization-level-2-a-authoritative-class-maps) is used). It has to exactly match. Casing matters here! What does this mean? The casing of your class references have to match the casing of your definitions for autoloading to consistently work.

Technically, the casing only matters on first reference. As already mentioned, once the definition is loaded the name is added to one of PHP’s tables. If it’s in the table, the autoloader is never triggered. It can simply use the definition, and the key lookup there is case-insensitive. We already showed that in a previous example. Yet, Composer’s autoloader is case-sensitive (in slightly different ways depending on if PSR-0,  PSR-4, or the classmap is used). For everything to “just always work,” you should match the casing of your references to the casing of the definitions. And the casing of the definition name should match up to the file path casings. There’s lots of casing to pay attention to here! Luckily, PHP should crash and burn if you get it wrong, so at least it should be catchable with careful testing.