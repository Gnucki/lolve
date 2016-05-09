LoLve
=====

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
- There is a desynchronisation between the server and client times which give a strange countdown during the fights.
- The real countdown is about 30 seconds for each summoner selection.
- Wait until you see WIN or DEFEAT at the end of the fight.
- Use of the english langage may be bad sometimes (sorry!).

### Technical

LoLve use the Node.js framework [Danf](https://github.com/gnodi/danf) and is a mix of AJAX app and real time application (sockets).