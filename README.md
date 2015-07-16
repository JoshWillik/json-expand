# json-expand

Expands your self referencing json

## Installation
Standalone Script
```shell
$ git clone https://github.com/joshwillik/json-expand.git
$ chmod +x json-expand/json-expand.js
$ mv json-expand/json-expand.js ~/my-scripts/json-expand
# Assuming ~/my-scripts is in $PATH
```
NPM module
```shell
$ npm install json-expand
```

## CLI Usage
```js
// config.json
{
  "apiDomain": "api.{{baseDomain}}",
  "baseDomain": "{{userAccount}}.{{hostingProvider}}",
  "userAccount": "joshwillik",
  "hostingProvider": "superhost.foobar",
  "authDomain": "{{google.accounts.base}}{{google.accounts.url}}",
  "google": {
    "accounts": {
      "url": "/login",
      "base": "accounts.google.com"
    }
  }
}
```
```shell
$ json-expand < config.json
{
  "apiDomain": "api.joshwillik.superhost.foobar",
  "baseDomain": "joshwillik.superhost.foobar",
  "userAccount": "joshwillik",
  "hostingProvider": "superhost.foobar",
  "authDomain": "accounts.google.com/login",
  "google": {
    "accounts": {
      "url": "/login",
      "base": "accounts.google.com"
    }
  }
}
```

## Node.js usage
```js
var expand = require( 'json-expand' )
var obj = {
    foo: "bar",
    message: "foo = {{foo}}"
}
expand( obj )
> { foo: 'bar', message: 'foo = bar' }
```

## Rules

Any **expression** wrapped in `{{ }}` will be expanded to the correct value or undefined if none exists.The expression to expand may come before the thing it will expand to.
```json
{
    "name": "John, son of {{parent}}",
    "parent": "Bill"
}
// becomes
{
    "name": "John, son of Bill",
    "parent": "Bill"
}
```

An expression may reference sub-properties of the document it resides in. All expressions are evaluated starting at the top scope.

```json
{
    "description": "John, drives with {{vehicle.wheels}} wheels",
    "vehicle": {
        "wheels":4
    }
}
// becomes
{
    "description": "John, drives with 4 wheels",
    "vehicle": {
        "wheels":4
    }
}
```

Using `||` will make json-expand attempt to expand each option, in order, until one works. Once one value is valid, the rest of the options are ignored.
```json
{
    "description": "I enjoy {{ favoriteFood || foodIKindaLike }}",
    "foodIKindaLike": "spaghetti"
}
// becomes
{
    "description": "I enjoy spaghetti",
    "foodIKindaLike": "spaghetti"
}
// but
{
    "description": "I enjoy {{ favoriteFood || foodIKindaLike }}",
    "foodIKindaLike": "spaghetti",
    "favoriteFood": "meatballs"
}
// becomes
{
    "description": "I enjoy meatballs",
    "foodIKindaLike": "spaghetti",
    "favoriteFood": "meatballs"
}
```

Environment variables may be substituted by adding a `$` before an expression. Using `||` works just fine with these.
```json
{
    "remoteHost": "{{ $REMOTE_HOST || defaultHost }}",
    "defaultHost": "production.project.com"
}
// if REMOTE_HOST has been set to 'dev.project.com
{
    "remoteHost": "dev.project.com",
    "defaultHost": "production.project.com"
}
// otherwise
{
    "remoteHost": "production.project.com",
    "defaultHost": "production.project.com"
}
```
