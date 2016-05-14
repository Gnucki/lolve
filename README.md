![lolve](resource/public/img/lolve.png)
=======================================

Participation to [The Riot Games API Challenge 2016](https://developer.riotgames.com/discussion/announcements/show/eoq3tZd1)

Documentation
-------------

### Presentation

LoLve is a game website using the championmastery API. To play, you have to create a player and then choose one of the 3 gaming mode: training, competition or challenge. Build your team of 5 summoners from challenger summoners and fight vs an AI, a random player or a friend.

The site should be enough self explanatory to not require more documentation.

### Test

A working instance is available [here](http://www.lolve.lol/).

### Remarks

- Ergonomics is not perfect and there are still some little bugs but the site is generally functional.
- Use of the english langage may be bad sometimes (sorry!).

### Technical considerations

- LoLve use the Node.js framework [Danf](https://github.com/gnodi/danf) and is a mix of an AJAX app (for bookmarking and deep linking) and a real time web application (use of socket messages to make an interactive game).
- The website should be responsive.
- A MongoDB database is used to persist fights and players data.

### Installation

To build your own site instance, you have to do the following steps:

1- Install git, node.js and an instance of MongoDB.

2- Go in the directory where you want to install the project.

3- Clone the repository:
```sh
$ git clone git@github.com:Gnucki/lolve.git
```

4- Go at the root directory of the cloned repository.

5- Update npm to the latest version:
```sh
$ npm install -g npm
```

6- Install project dependecies with npm.
```sh
$ npm install
```

7- Add (or replace) a file named `parameters-server.js` containing:
```javascript
'use strict';

module.exports = {
    lol: {
        api: {
            key: '...' // your LoL API key
        }
    },
    databases: {
        main: {
            host: 'localhost',
            port: 27017
        }
    },
    encoding: {
        salt: 'fergf4re5g645dgsg654fs',
        iterations: 500,
        keylen: 128,
        digest: 'sha512'
    }
};
```

8- Start the server with the following command:
```sh
$ node danf serve --env prod
```

9- Open a page at `http://localhost:3080` in your favorite browser (the game has been tested on chrome and firefox).

10- Create a player of username `A.I.` to enable the training mode.

11- Disconnect from A.I. account.

12- Create your player and let's play!

### Possible improvements

- Add bonus points to apply on one lane.
- Add a list of best players.
- ...
