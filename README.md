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
