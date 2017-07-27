[![Build Status](https://travis-ci.org/superedriver/flashcards.svg?branch=master)](https://travis-ci.org/superedriver/flashcards)
[![Code Climate](https://codeclimate.com/github/superedriver/flashcards/badges/gpa.svg)](https://codeclimate.com/github/superedriver/flashcards)
[![Test Coverage](https://codeclimate.com/github/superedriver/flashcards/badges/coverage.svg)](https://codeclimate.com/github/superedriver/flashcards/coverage)


# Flashcards 
An application for learning foreign words

You can try it on:
 * [Heroku](https://flashcardssms.herokuapp.com/) 

## Description
User has decks and cards in these decks.
Every card has word and translation of this word. 
User has to write the translation of the random active card.

The frequency of occurrence of cards is regulated by the SuperMemo2 algorithm.

On the training page user sees random card from Actual cards.

Every deck can have "Current" status. In this case, on the training page random card is selected from Actual cards of "Current" deck.

Each user has his/her set of decks and cards.
User can create/edit/delete decks and cards.

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