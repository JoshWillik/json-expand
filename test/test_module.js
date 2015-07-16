var assert = require( 'assert' )
var expand = require( '../' )

describe( 'JSON Expand', function(){
  it( 'should expand keys', function(){
    var before = {
      scheme: 'https',
      url: '{{scheme}}://foobar.com'
    }
    var expected = {
      scheme: 'https',
      url: 'https://foobar.com'
    }

    assert.deepEqual( expand( before ), expected )
  })

  it( 'should expand missing keys to an empty string', function(){
    var before = {
      foo: '{{bar}}tender'
    }
    var expected = {
      foo: 'tender'
    }

    assert.deepEqual( expand( before ), expected )
  })

  it( 'should expand more than 1 key per value', function(){
    var before = {
      scheme: 'https',
      url: '{{scheme}}://{{domain}}',
      domain: 'foobar.com'
    }
    var expected = {
      scheme: 'https',
      url: 'https://foobar.com',
      domain: 'foobar.com'
    }

    assert.deepEqual( expand( before ), expected )
  })

  it( 'should expand subkeys', function(){
      var before = {
        websiteUrl: '{{profile.blog.title}}.tumblr.com',
        profile: {
          blog: {
            title: 'cats'
          }
        }
      }
      var expected = {
        websiteUrl: 'cats.tumblr.com',
        profile: {
          blog: {
            title: 'cats'
          }
        }
      }

      assert.deepEqual( expand( before ), expected )
  })

  it( 'should allow || operator', function(){
    var before = {
      websiteUrl: '{{profile.blog.title || subtumblr}}.tumblr.com',
      subtumblr: 'goatsonthings'
    }
    var expected = {
      websiteUrl: 'goatsonthings.tumblr.com',
      subtumblr: 'goatsonthings'
    }

    assert.deepEqual( expand( before ), expected )
  })

  it( 'should allow string literals', function(){
    var before = {
      portfolio: '{{ "art" }}.tumblr.com',
      blog: "{{ 'myblog' }}.wordpress.com"
    }
    var expected = {
      portfolio: 'art.tumblr.com',
      blog: "myblog.wordpress.com"
    }

    assert.deepEqual( expand( before ), expected )
  })

  it( 'should allow concatinating keys and/or string literals', function(){
    var before = {
      portfolio: '{{ type + "-art" }}.tumblr.com',
      type: 'street',
      blog: "{{ firstName + lastName }}.wordpress.com",
      firstName: 'Josh',
      lastName: 'Vanderwillik'
    }
    var expected = {
      portfolio: 'street-art.tumblr.com',
      type: 'street',
      blog: "JoshVanderwillik.wordpress.com",
      firstName: 'Josh',
      lastName: 'Vanderwillik'
    }

    assert.deepEqual( expand( before ), expected )
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
