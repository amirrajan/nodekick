Nodekick
========

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/2.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.0/">Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Generic License</a>.

Nodekick is a realtime, multiplayer fighting game built using NodeJS, socket.io, and pixi.js.

This codebase is a cleaned up version of what our team built for Node Knockout 2013. Out of 385 teams, we placed 15th overall and 6th in the "fun/utility" category.

You can play online [here](http://node-kick.herokuapp.com).

#Screenshots and Instruction to deploy your own Nodekick.

<img src="nodekick.jpg" />

##Run Locally

**Due to the use of websockets (and time sensitive game events over those sockets), this game server will not perform well on a Windows machine (tested on Windows 7).**

Install all the dependencies:

    npm install (you may need to prefix this with sudo if you're on Mac)

Run the app:

    node server.js

Then navigate to `http://localhost:3000` (use chrome or firefox).

##Signing up, and deploying to Heroku

###Documentation

From heroku.com, click Documentation, then click the Getting Started button, then click Node.js from the list of options on the left...which will take you here: https://devcenter.heroku.com/articles/nodejs

Install Heroku toolbelt from here: https://toolbelt.heroku.com/

Sign up via the website (no credit card required).

Login using the command line tool:

    heroku login

Create your heroku app:

    heroku create

Git deploy your app:

    git push heroku master

Assign a dyno to your app:

    heroku ps:scale web=1

Enable websockets (currently in beta):

    heroku labs:enable websockets

Open the app (same as opening it in the browser):

    heroku open

And your app should be up on Heroku.

#Deploy to Infrastructure as a Service

The deployment instructions thus far have been about deploying to PaaS. You can spin up your own linux box and deploy Nodekick (or any other NodeJS app for that matter). This is ofcourse a bit harder, but you'll have fine grained control over your box as opposed to being constrained to what PaaS provides.

##Signing up and deploying to Amazon EC2

Sign up for Amazon AWS at http://aws.amazon.com/

Take note of any Access and Secret Keys provided during the sign up process, you won't get another chance to look at these.

##AWS CLI Installation

###Automatic

After this, you'll want to install the Amazon CLI, instructions located here: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-set-up.html

###Clutch

I found that AWS CLI is open source. So I decided to be build it from source as opposed to installing it.

First I cloned the repo

    git clone https://github.com/aws/aws-cli

The source is written in Python. So you'll have to install that based on whatever OS you are running. Brew, apt-get flavors, and chocolatey all have a means to install Python.

After cloning the repo, I checked out the latest tag (at this point it was `1.2.5`)

    git checkout tag 1.2.5

I then built and installed.

    python setup.py build
    python setup.py install

Looking at the console output of the build showed that the files were copied to `build/scripts-2.7` (this may be different for your OS). Navigating to this directory, I then ran

    python aws

Which yielded results.

Now that we have a successful build, move the scripts to a location of your choosing and expose the directory to `$PATH`.  I chose to put the scripts in `/usr/local/aws-cli/bin`

After moving the scripts over, I added the following line to my `.bashrc`. If you are on windows, you can place the directory in the `C:` drive and manipulate the path variable by right clicking My Computer, Properties, Advanced.

    export PATH="/usr/local/aws-cli/bin:$PATH"

After you have updated your `.bashrc` or the Environment Variables (and have sourced the new file... or restarted your computer), you should be able to run the `aws` command from anywhere.

##Configuring AWS CLI

Based on the documentation located here: http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

>The simplest way to use a configuration file with the AWS CLI is to name it config and place it in a folder named .aws in your home directory. On Windows, that would look like C:\Users\USERNAME\.aws\config. On Linux, OS X, or Unix, that is ~/.aws/config. The AWS CLI will automatically check this location for a configuration file.

Start by creating an empty configuration file.

    mkdir ~/.aws
    touch ~/.aws/config

You'll need to provide your Access Key, Secret Key, Region and Output Format. Here is a sample config file.

    [default]
    aws_access_key_id=REDACTED
    aws_secret_access_key=REDACTED
    region=us-east-1
    output=json

A full region list can be found here: http://docs.aws.amazon.com/general/latest/gr/rande.html#ec2_region

You can go to https://console.aws.amazon.com/iam/home?#security_credential to see your security credentials, but the secret access key is only shown **once**. If you didn't write down your secret key, you can create a new one here.

##Generating a Key Pair for SSH

You can log into boxes by using a key pair (as opposed to using a password). You have to associate your key pair when you create the instances. So we'll set up the key pair first. The following command creates a key pair and saves the return value to a file (the data that is returned is important, and must be saved on creation).

    aws ec2 create-key-pair --key-name nodeboxes --query 'KeyMaterial' --output text > nodeboxes.pem

##Creating a Security Group for you NodeJS Apps

We also want to create a security group for our NodeJS applications. This will also be associated with the instance we create.

    aws ec2 create-security-group --group-name "nodeapps" --description "NodeJS Applications"

Which will return something like:

    {
        "return": "true",
        "GroupId": "GROUPID"
    }

After we have the security group created, we need to set up ssh and http ports.

    aws ec2 authorize-security-group-ingress --group-name nodeapps --protocol tcp --port 22 --cidr 0.0.0.0/0
    aws ec2 authorize-security-group-ingress --group-name nodeapps --protocol tcp --port 80 --cidr 0.0.0.0/0

##Creating an EC2 Instance

You can run the `aws ec2 describe-images` command to see all images you have access to (it will take a while to return). I ended up going to the Create Instance page on the website to find the Ubuntu 13 micro instances I wanted to spin up. The rest of the instructions assume that you are using an Ubuntu 13 box.

Here is the command that returns the Ubuntu 13 box I ended up cloning:

    aws ec2 describe-images --filters Name=image-id,Values=ami-ad184ac4

This page contains different filter options: http://docs.aws.amazon.com/AWSEC2/latest/CommandLineReference/ApiReference-cmd-DescribeImages.html

To create an ec2 instance for this image (and associate it with the key pair and security group we just created). Run the following command:

    aws ec2 run-instances --image-id ami-ad184ac4 --count 1 --instance-type t1.micro --security-groups nodeapps --key-name nodeboxes

You can then run `aws ec2 describe-instances` to get the public dns.

With the dns information and the .pem file, you should be able to ssh into the box (git bash on Windows has an ssh client). Here is the command to log into the box. First we need to edit the permissions of the .pem file, then we should be able to log in.

    chmod 600 ~/.aws/nodeboxes.pem
    ssh-add ~/.aws/nodeboxes.pem
    ssh ubuntu@PUBLICDNS

If you mess up the creation of your instance, you can delete it using the following command:

    aws ec2 terminate-instances --instance-ids INSTANCEID

You can then run `aws ec2 describe-instances` to get the instance id.

##Setting up NodeJS on the EC2 Instance

Once you've ssh'ed into the box. We'll use `apt-get` to install the programs needed to retrieve, compile and run NodeJS app.

    sudo apt-get install nginx
    sudo apt-get install gcc
    sudo apt-get install g++
    sudo apt-get install make
    sudo apt-get install openssl
    sudo apt-get install git

With git installed, we can pull down npm and node. Run the following commands (the compilation will take ~45 minutes).

    cd ~/
    git clone https://github.com/isaacs/npm.git
    git clone git://github.com/joyent/node.git
    cd ~/node/
    git checkout v0.10.8
    ./configure
    make
    sudo make install
    cd ~/npm/
    sudo make install

Now lets start and configure nginx (it will act as a reverse proxy and send all requests on port 80 to node).

    sudo update-rc.d nginx on

then

    sudo service nginx start

Now to configure nginx. You'll need to use a text editor to do this (I use VIM).

    sudo vim /etc/nginx/sites-enabled/default

Replace the contents of the file with the following:

    upstream node {
        server 127.0.0.1:3000;
        keepalive 256; # not necessary
    }

    server {
        listen 80;
        server_name localhost; # domain of my site
        access_log /var/log/nginx/localhost.access.log;
        error_log /var/log/nginx/localhost.error.log;

        large_client_header_buffers 8 32k;

        location / {
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $http_host;
            proxy_set_header X-NginX-Proxy true;

            proxy_buffers 8 32k;
            proxy_buffer_size 64k;

            proxy_pass http://node;
            proxy_redirect off;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            tcp_nodelay on; # not necessary
        }
     }

Save the file, then restart nginx

    sudo service nginx restart

Now that we have nginx configured, we can clone the Nodekick repo.

    cd ~/
    git clone https://github.com/amirrajan/nodekick.git
    cd nodekick
    sudo npm install

And start up the app using `forever` (this will keep the app running even if we log off).

    sudo npm install forever -g

Run the app

    forever start --spinSleepTime 10000 server.js

That's it! You should now be able to hit the public IP for your box and should be able to play Nodekick!
