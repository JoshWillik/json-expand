#! /usr/bin/env node

var SUBSTITUTE_REGEX = /{{(.*?)}}/g

function main(){
  var inputBuffer = ''
  process.stdin.on( 'data', function( chunk ){
    inputBuffer += chunk
  })

  process.stdin.on( 'end', function(){
    var data = parseInput( inputBuffer )
    data = expandObject( data )
    outputData( data )
  })

  if( process.stdin.isTTY ){
    process.exit(-1)
  }
}

function parseInput( data ){
  return JSON.parse( data )
}

function outputData( data ){
  return console.log( JSON.stringify( data ) )
}

function expandObject( obj, scope ){
  if( !scope ){
    scope = obj
  }

  var shouldContinue = true
  while( shouldContinue ){
    shouldContinue = false
    for( var attr in obj ){
      var value = obj[ attr ]
      switch( typeof value ){
        case 'object':
          obj[ attr ] = expandObject( value, scope )
        break
        case 'string':
          obj[ attr ] = substituteIfPossible( value, scope )
        break
        default:
          continue
        break
      }
    }
  }
  return obj
}

function substituteIfPossible( string, pool ){
  while( SUBSTITUTE_REGEX.test( string ) ){
    string = string.replace( SUBSTITUTE_REGEX, function( fullMatch, capture ){
      return findBestValue( capture, pool )
    })
  }
  return string
}

function findBestValue( expression, pool ){
  var value = ''
  var options = expression.split( '||' )
  while( options.length && value === '' ){
    var option = options.shift()

    value = option.split( '+' ).map( function( segment ){
      return segment.trim()
    }).map( function( segment ){
      if( !segment ){
        return ''
      }

      if( segment[0] === '$' ) {
        return findValue( segment.slice( 1 ), process.env )
      } else if( segment[0] === "'" || segment[0] === '"' ){
        var a = segment.replace( /[\'\"]/g, '' )
        return a
      } else {
        return findValue( segment, pool )
      }
    }).join( '' )
  }
  return value
}

function findValue( keyString, pool ){
  var keys = keyString.split( '.' )
  var intermediate = pool
  while( keys.length ){
    var key = keys.shift()
    intermediate = intermediate[ key ]
    if( typeof intermediate !== 'object' ){
      return intermediate
    }
  }
}

if( require.main === module ){
  main()
} else {
  module.exports = expandObject
}
