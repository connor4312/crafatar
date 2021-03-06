# Crafatar [![travis](https://img.shields.io/travis/Jake0oo0/crafatar.svg?style=flat)](https://travis-ci.org/Jake0oo0/crafatar/) [![Coverage Status](https://img.shields.io/coveralls/Jake0oo0/crafatar.svg?style=flat)](https://coveralls.io/r/Jake0oo0/crafatar) [![Code Climate](https://codeclimate.com/github/Jake0oo0/crafatar/badges/gpa.svg)](https://codeclimate.com/github/Jake0oo0/crafatar)

https://crafatar.com

Crafatar serves Minecraft avatars based on the skin for use in external applications.
Inspired by [Gravatar](https://gravatar.com) (hence the name) and [Minotar](https://minotar.net).

Image manipulation is done by [lwip](https://github.com/EyalAr/lwip). Renders are created with [node-canvas](https://github.com/Automattic/node-canvas), based on math by [confuser](https://github.com/confuser/serverless-mc-skin-viewer).

![redstone_sheep's avatar](https://crafatar.com/avatars/ae795aa86327408e92ab25c8a59f3ba1?size=128) ![Jake0oo0's avatar](https://crafatar.com/avatars/2d5aa9cdaeb049189930461fc9b91cc5?size=128) ![Notch's avatar](https://crafatar.com/avatars/069a79f444e94726a5befca90e38aaf5?size=128) ![sk89q's avatar](https://crafatar.com/avatars/0ea8eca3dbf647cc9d1ac64551ca975c?size=128) ![md_5's avatar](https://crafatar.com/avatars/af74a02d19cb445bb07f6866a861f783?size=128) 
## Usage / Documentation

Please [visit the website](https://crafatar.com) for details.

## Contact

* You can follow us on [![t](https://favicons.githubusercontent.com/twitter.com)@crafatar](https://twitter.com/crafatar)
* You can [join us](https://webchat.esper.net/?channels=crafatar) in #crafatar on irc.esper.net.

## Installation

#### Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### Dokku
Deploy with [dokku-redis](https://github.com/ohardy/dokku-redis#redis-plugin-for-dokku) installed.

#### Local
* [Install](https://github.com/Automattic/node-canvas/wiki) Cairo.
* `npm install`
* Start `redis-server`
* `npm start`
* Access [http://localhost:3000](http://localhost:3000)
