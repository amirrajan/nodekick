Preferred Nodekick testing approach
=================================

Nodekick's functionality was tested using Behavioral Driven Design (BDD)

#Preferred testing requirements

* ##[jasmine-node](https://github.com/mhevery/jasmine-node#install)

    install  
    ------

    To install the latest official version, use NPM:

    ```sh
    npm install jasmine-node -g
    ```

* ##[watchr](https://npmjs.org/package/watchr)

    install  
    ------

    To install the latest official version, use NPM:

    ```sh
    npm install watchr -g
    ```

#Testing

Before testing make sure you've executed the following step from the README.md file  
and have installed the required dependicies above if you're following the preferred
testing approach

Install all the dependencies:  


```sh
npm install # (you may need to prefix this with sudo if you're on Mac)
start watchr test.watchr.rb # I'm using git bash's command line through windows
```
    
A new terminal should open up and the test.watchr.rb file will begin listening
for any changes to your *js files. When you save a js file the tests will
auto run and the results will print to the terminal.

##Optional testing extension [growl](https://npmjs.org/package/growl)
If you want to use growl in conjunction with your testing, for the benefits of
a continous visual feedback loop, ensure you have growl installed and edit the
test.watchr.rb file to uncomment the line with the --growl parameter on it

install  
------
```sh
npm install growl -g
```
