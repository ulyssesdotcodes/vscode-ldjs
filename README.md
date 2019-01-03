# vscode-ldjs 

An extension to easily use the lambda-designer-js library with TouchDesigner.

## Features

Create TouchDesigner networks using only code. This extension compiles the code using lambda-designer-js and sends it as a JSON object to TouchDesigner.

There are two modes: ondemand, and automatic. 

While in a *.ldjs.js file:
cmd/ctrl+enter - ondemand mode where cmd/ctrl+enter updates TouchDesigner with the current code
LDJS: Start Server vscode command - automatic mode where every time text is changed TouchDesigner is updated 

## Setup

1. Clone this repo (it's not on vscode extension marketplace for a reason)
2. Add it as a local extension - you can use a symlink - with [these instructions](https://vscode-docs.readthedocs.io/en/stable/extensions/install-extension/)
3. Open TD/FunctionalDesigner.toe

## Tutorial

[Youtube tutorial](https://youtu.be/zcXJwsCvUyU)

## Release Notes

### 1.0.0

First release!