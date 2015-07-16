var assert = require( 'assert' )
var expand = require( '../' )

describe( 'JSON Expand', function(){
  it( 'should properly expand a dictionary passed to it', function(){
    var preExpanded = {
      scheme: '{{insecureScheme}}s',
      insecureScheme: 'http',
      host: '{{ businesses.github.name.justKidding.thisIsTheName.name }}.com',
      user: {
        page: '{{$HOST_OVERRIDE || host}}/{{user.accountName}}',
        accountName: 'joshwillik'
      },
      project: {
        page: '{{scheme}}://{{user.page}}/{{project.name}}',
        name: 'json-expand',
        issuesUrl: "{{ project.page }}/issues"
      },
      businesses: {
        github: {
          name: {
            justKidding: {
              thisIsTheName: {
                name: 'github'
              }
            }
          }
        }
      }
    }
    var expectedExpanded = {
      scheme: 'https',
      insecureScheme: 'http',
      host: 'github.com',
      user: {
        page: 'github.com/joshwillik',
        accountName: 'joshwillik'
      },
      project: {
        page: 'https://github.com/joshwillik/json-expand',
        name: 'json-expand',
        issuesUrl: "https://github.com/joshwillik/json-expand/issues"
      },
      businesses: {
        github: {
          name: {
            justKidding: {
              thisIsTheName: {
                name: 'github'
              }
            }
          }
        }
      }
    }

    var postExpanded = expand( preExpanded )
    assert.deepEqual( postExpanded, expectedExpanded )
  })

  it( 'should allow environment variables to be inserted when they exist', function(){
    var before = {
      "foo": "fee fi fo {{ $OVERRIDE || bar }}",
      "bar": "fum"
    }
    var expectedWithoutEnv = {
      "foo": "fee fi fo fum",
      "bar": "fum"
    }
    var expectedWithEnv = {
      "foo": "fee fi fo HAMMER TIME",
      "bar": "fum"
    }

    assert.deepEqual( expand( Object.create(before) ), expectedWithoutEnv )
    process.env.OVERRIDE = 'HAMMER TIME'
    assert.deepEqual( expand( Object.create(before) ), expectedWithEnv )
  })
})
