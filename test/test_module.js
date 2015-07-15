var assert = require( 'assert' )
var expand = require( '../' )

var preExpanded = {
  scheme: '{{insecureScheme}}s',
  insecureScheme: 'http',
  host: '{{ businesses.github.name.justKidding.thisIsTheName.name }}.com',
  user: {
    page: '{{host}}/{{user.accountName}}',
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

describe( 'JSON Expand', function(){
  it( 'should properly expand a dictionary passed to it', function(){
    var postExpanded = expand( preExpanded )
    assert.deepEqual( postExpanded, expectedExpanded )
  })
})
