---
title: Using PHP and MySQL with Docker
date: 2020-09-26
description: A tutorial on using Docker containers with PHP and MySQL
mainImage: whale.jpg
smallImage: whale-small.jpg
mainImageAltText: A whale jumping out of the water
---
Recently, I’ve been doing some work with containers. For the uninitiated, a container is like a virtual machine because your application is run in an isolated, consistent environment. Yet, this environment is more lightweight than a virtual machine. It utilizes the underlying operating system rather than running an entire operating system for each application. Thus, containers are cheap-ish to spin up and easy to share.

The most common platform for creating containers is Docker so that’s what I’ll be using here. [You can install Docker from this link.](https://www.docker.com/get-started) Warning though: If you have Windows Home Edition, you will need Windows Subsystem for Linux Version 2 to run the latest version of Docker. Those on *nix systems should be able to just install the software.

## Database Setup

Let’s start by setting up the database. For this part of the tutorial, I’m assuming you have some knowledge of SQL; however, you should just be able to blindly copy and paste in the text. I’m putting all my work in a folder called tutorial. Also, you will have to make a few more folders and files to follow along to the end—just a forewarning.

To begin, we are going to need an image to form the base of our container. In Docker, an image is basically a file system and some settings. Each container will get its own virtual file system separate from your actual one, and it is remade fresh every time a container is spun up. If you want your containers to access persistent storage or mount to your actual filesystem, you'll have to look into volumes. I'm not going to use a volume here, but it's something you should be aware of.

Now, Docker manages the lifecycle of a container, but it also acts as a package manager for images. Thus, we don’t have to make our own from scratch. Instead, we can use and extend existing images. For our needs here, we’ll extend a basic MySQL image, [which can be found on the Docker Hub website.](https://hub.docker.com/_/mysql) The website will give some basic information about the image; we mostly care about the image name, the available tags, and the environment variables.

To create a new image, we’ll need to create a YAML file, commonly known as a Dockerfile. This file contains various commands to create a container. Don't worry—I’m going to provide the files needed for our adventure, including this Dockerfile, with some explanatory comments. Also, [the Docker website provides a reference](https://docs.docker.com/engine/reference/builder/) if you would like to go into more detail. This guide only provides a relatively high-level overview of Docker.

Here is the Dockerfile itself.

```dockerfile
FROM mysql:8.0

# Set an insecure password
ENV MYSQL_ROOT_PASSWORD=example

# Copy over our SQL queries
COPY ./mysql/init.sql /init.sql

# Startup MySQL and run the queries
CMD ["mysqld", "--init-file=/init.sql"]
```

And you’ll need the requisite SQL file. I’ve put both of these files in a folder called mysql in our tutorial directory.

```sql
CREATE DATABASE app;
USE app;

CREATE TABLE message (
    id INT NOT NULL AUTO_INCREMENT,
    message VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO message (message)
VALUES
    ("Hello World"),
    ("A second message"),
    ("J.Cole went double platinum with no features");
```

## Some Dockerfile Commands

I’ll go ahead and explain a few of the common Dockerfile commands.

The FROM command tells Docker which image to extend. Here, we are building on top of the MySQL image with tag 8.0. If you're feeling adventurous, try changing the tag; the tutorial should still work.

The ENV command sets—acts shocked—an environment variable. Environment variables, broadly speaking, are dynamically set values that affect the behavior of running processes. In this case, we are setting the password for the database. Thus, if you want to log in with an external tool like MySQL Workbench, use the password example and the default username of root. You won’t need any programs other than Docker to complete this tutorial, but database tooling should work with the containerized database.

The COPY command moves files from your actual file system to the container’s virtual filesystem. Keep in mind, containers are immutable so we have to copy over files or mount volumes during the creation step. So, what are we copying over here?
It’s just a SQL file to populate a table. Obviously, out of the box, the database will be a blank slate. I went ahead and added some records as part of the database initialization process. This technique is probably not how you actually do this in a real environment, but it keeps the tutorial simple.

Finally, the CMD command tells the container what to run once the container starts up. Here, I am overriding the mysql’s image default behavior because we need to add a flag to the command. The --init-file flag allows us to run a file containing SQL queries after the database initializes, which is exactly what we want.

This file by itself does nothing. We'll have to build the Dockerfile into an image and run it—but that'll come later.

## PHP Setup

Cool—we have a database Dockerfile. Let’s do something with it by creating a simple PHP page, which will involve spinning up a second container. This pattern will get familiar. You will spend some amount of time configuring Docker containers for all the components of your application.

The PHP file itself creates an html table displaying the contents of the database table—pretty much in a one-to-one fashion. Most of this file is html. You don’t have to understand all the details of the PHP part, but it’s just querying our database.

```php
<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Docker Tutorial</title>
    <meta name="description" content="Learn how to use Docker with PHP">
    <meta name="author" content="Matthew Parris">
</head>

<body>
    <h1>Docker Tutorial</h1>
    <div class=".db-table">
        <table>
            <tr>
                <th>Id</th>
                <th>Message</th>
            </tr>
            <?php
            $user = 'root';
            $pass = 'example';

            try {
                $dbh = new PDO('mysql:host=db;port=3306;dbname=app', $user, $pass);
                foreach ($dbh->query('SELECT * from message') as $row) {
                    $html = "<tr><td>${row['id']}</td><td>${row['message']}</td></tr>";
                    echo $html;
                }
                $dbh = null;
            } catch (PDOException $e) {
                print "Error!: " . $e->getMessage() . "<br/>";
                die();
            }
            ?>
        </table>
    </div>
</body>

</html>
```

An interesting thing to point out here is the database container's hostname. It's the same name as the container. Thus, you don't have to figure out what IP the container has been assigned. Some DNS magic is making our lives easier behind the scenes.

Now, let's look at the Docker file. It's similar to the one from earlier—so I'm not going to review the syntax again. [We are going to build from the base image found at this link.](https://hub.docker.com/_/php) One thing to note is that we have to install a PHP extension for PDO to establish a connection to our MySQL database. Luckily, the base PHP image provides some utility scripts to work with these extensions. It's an easy thing to implement but could be easily overlooked.

```dockerfile
FROM php:7.4-cli

# Move our PHP file into the container
COPY ./php/index.php /usr/src/app/index.php

# Make things easier if you shell in
WORKDIR /usr/src/app

# Our PHP will be running on port 8000
EXPOSE 8000

# Install the PDO MySQL extension so we can database
RUN docker-php-ext-install pdo_mysql

# Set up a web server
CMD ["php", "-S", "0.0.0.0:8000"]
```

To note, I’ve placed both this Dockerfile as well as the PHP file in a folder called php. You'll need to be careful about the directory structure because it will matter for the next step. Things will crash if you screw up 🙃

## Docker Compose

Phew—we're almost there. We have our images and could imperatively use the Docker CLI to run the containers and network them together. But that's no fun and is a pain to manage. [Instead, I'm going to scribble up a Docker Compose file.](https://docs.docker.com/compose/)

Docker Compose is an abstraction on top of Docker to fire up a set of containers, volumes, networks, and other environment stuff. In other words, it is basically a declarative way of interfacing with Docker. We can create a single YAML file to spin an environment up and down.

```yaml
version: '3.7'
services:
  db:
    build:
      context: .
      dockerfile: ./mysql/Dockerfile.yaml
    image: tutorial-db
    restart: always
    ports:
      - 3306:3306
  app:
    build:
      context: .
      dockerfile: ./php/Dockerfile.yaml
    image: tutorial-php
    restart: always
    ports:
      - 8000:8000
```

## Run the Containers

Awesome. We now have everything we need. Let's run this thing by telling Docker Compose to spin up our containers.

docker-compose up -d

You should then be able to navigate to localhost:8080 and see the page. It's not glorious, but there should be an html table with some rows populated.

Of course, for more realistic scenarios, you aren't going to have a single PHP page that connects to a pre-populated database. Your app will likely be split into components running as their own microservices. Alternatively, you might be transitioning a monolithic application over to a container. These use cases are obviously more complicated than this silly example, but the point was to focus on Docker. Many of the concepts used here will be applicable to larger projects. Anyway, I hope you learned something.
