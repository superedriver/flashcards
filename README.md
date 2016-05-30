[![Build Status](https://travis-ci.org/superedriver/flashcards.svg?branch=seventh-task)](https://travis-ci.org/superedriver/flashcards)

[![Code Climate](https://codeclimate.com/github/superedriver/flashcards/badges/gpa.svg)](https://codeclimate.com/github/superedriver/flashcards)

[![Test Coverage](https://codeclimate.com/github/superedriver/flashcards/badges/coverage.svg)](https://codeclimate.com/github/superedriver/flashcards/coverage)
# Flashcards 
An application for learning foreign words

## Description
User has decks and cards in these decks.
Every card has word and translation of this word. 
User has to write the translation of the random active card.
If translation correct, next time the card will be active after 3 days.
Each user has his/her set of decks and cards.
User can create/edit/delete decks and cards

## Dependecies
 * [PostgreSQL](http://www.postgresql.org) 
 * [imagemagick](http://www.imagemagick.org)


## Installation
Copy configuration files
```
cp config/application.yml.example config/application.yml
```
```
cp config/database.yml.example config/database.yml
```
Configure them with your data

## Used gems
  - **Simple Form** - forms generator
  - **Nokogiri** - parsing words
  - **Sorcery** - authorization
  - **Carrierwave** - downloading images