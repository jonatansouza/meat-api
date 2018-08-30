# MEAT-API

> RESTful  API using TypeScript with node.js/npm modules 

Meat api, is a API to provide data to MEAT APP, is a simple application that emulate a e-comerce like ifood.

This api was developed during course on UDEMY, ministered by the awesome professor [Tarso Bessa](https://github.com/tarsobessa).

## Prerequisites

Have node.js installed, mongoDB, it comes with the `npm` package manager.

Have the global `tsc` TypeScript compiler:

````
npm install typescript -g
````

Clone the repos to your local workspace

## How to use


### Install npm dependencies

Use your command-line:

A) From `package.json` (recommended for existing projects):

````
npm install
````

### Transpile files

````
cd meat-api && tsc
````

### Run the code

````
node ./dist/main.js
````

### DEV MODE 

on terminal, on meat-api folder, open a second terminal 

Term1: `tsc -w`

Term2: `nodemon ./dist/main.js`

## Meta

Jonatan Gall Delgado de Souza - jonatangd.souza@gmail.com

## License

Licensed under the MIT license.