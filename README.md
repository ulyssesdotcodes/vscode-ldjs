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

[YouTube tutorial](https://youtu.be/zcXJwsCvUyU)

Using `c` (short for chain) gets you all of the needed operators.

Op syntax is `c.opfamily("opname", { parameters })`

For example: `c.top("rectangle", { rotate: c.fp(45) })`

Parameter syntax is `c.paramtype(value)`

For example `c.fp(45)`

`fp: float`
`ip: integer`
`sp: string`
`tp: toggle (bool)`
`mp: menu (integer)`


Multi-value parameter syntax is `c.paramtype(paramvalue1, paramvalue2, ...)`

For example `c.xyp(c.fp(0.3), c.fp(0.6))`

`xyp: float, float`
`xyzp: float, float, float`
`xyzwp: float, float, float, float`
`rgbp: float, float, float`
`whp: integer, integer`

Some are not implemented yet.


If your code errors or the nodes or parameters don't typecheck, check for messages in the ldjs output.


## Release Notes

### 1.0.0

First release!