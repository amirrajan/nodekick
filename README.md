Nodekick
========

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/2.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/2.0/">Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Generic License</a>.

Nodekick is a realtime, multiplayer fighting game built using NodeJS, socket.io, and pixi.js.

This codebase is a cleaned up version of what our team built for Node Knockout 2013. Out of 385 teams, we placed 15th overall and 6th in the "fun/utility" category.

You can play online [here](http://nodekick.jit.su).

#Screenshots and Instruction to deploy your own Nodekick.

##jump

<img src="/ss_jump.png" />

##attack

<img src="/ss_attack.png" />

##kill

<img src="/ss_kill.png" />

##victory

<img src="/ss_victory.png" />

##Run Locally

**Due to the use of websockets (and time sensitive game events over those sockets), this game server will not perform well on a Windows machine (tested on Windows 7).**

Install all the dependencies:

    npm install (you may need to prefix this with sudo if you're on Mac)

Run the app:

    node server.js

Then navigate to `http://localhost:3000` (use chrome or firefox).

##Signing up, and deploying to Nodejitsu

###Documentation

The documenation was available on the front page (right under the sign up for free button): https://www.nodejitsu.com/getting-started/

Install the Nodejitsu Package

    npm install jitsu -g (you may need to prefix this with sudo if you're on Mac)

Register via the command line:

    jitsu signup (yes you can sign up via the command line)

You'll get a confirmation email with a command to type in:

    jitsu users confirm [username] [confirmation-guid]

If you've already registered, you can login with:

    jitsu login

After you confirm your email, you can login (the `confirm` command should prompt you to log in).

Change the `subdomain` value in `package.json`, to reflect the url you want to deploy to:

    {
      "name": "nodekick",
      [...],
      "subdomain": "nodekick" <--- this value
    }

now deploy:

    jitsu deploy

And your app should be up on Nodejitsu.

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

##Signing up, and deploying to Clever Cloud

[Clever Cloud](http://www.clever-cloud.com) promote http://nodejs-cloud.com/ and host lots of nodejs with websocket.

###Documentation

All the documentation about Clever Cloud node deploy is here : http://doc.clever-cloud.com/nodejs/

You have nothing to install in your computer.

Sign up via the website (no credit card required).

Login into https://console.clever-cloud.com/ and register your public ssh key as mention here : http://doc.clever-cloud.com/admin-console/ssh-keys/

Create a nodejs application.

![demo create clever cloud app](http://i.imgur.com/kBCD71w.png)

let default settings and create your app. 

The console will show you a git remote repository to push your app. 

![demo git repo clever cloud](http://i.imgur.com/lRzseIt.png)

Go on your clone repository, and add remote :

    git remote add clever <the_repo_url_get_from_console>
    
You have to change the config.js file to listen on 8080 port :

    // just change this value on the file
    production: { port: 8080 }
    
Commit your change

    git commit -am "port production change"

Git deploy your app:

    git push clever master

And your app should be up on Clever Cloud. To get the temporary url for you application, click the `Domains` menu item after selecting your app from the `Apps` dropdown located at the top of the page. The url will be listed there.

##Signing up, and deploying to Azure

*I've deployed Nodekick to Azure's free instance, but the performance of the websockets was really poor. Not worth deploying there. If you've had a different experience, please let me know via an issue or pull request.*

If you really want to try Azure out, refer to these instructions:

###Documentation

From windowsazure.com, click Documentation, click Developer Center, click node.js, then click the Learn More button which will take you here:

http://www.windowsazure.com/en-us/develop/nodejs/tutorials/create-a-website-(mac)/ (if you're on a Mac, looks like the link is contextual)

Install the command line tools from here:

http://www.windowsazure.com/en-us/downloads/#cmd-line-tools (on Windows, be sure to install the cross platform command line interface...not the powershell version)

From the command line, first download your publish settings (this will redirect you to a website):

    azure account download

After the `.publishsettings` file is downloaded, you'll need to import it:

    azure acount import %pathtofile%

Next create the site, with a git backed repository:
    
    azure site create %uniquesitename% --git

Deploy site:

    git push azure master

List of your websites:

    azure site list

And your app should be up on Azure.

After your app is deployed. Go to the Azure control panel and under the `Configure` tab for your application, enable websockets and save.


