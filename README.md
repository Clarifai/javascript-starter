# javascript-starter
A few simple examples to help you get started using the Clarifai Javascript client and API

## How to get started
Download this repo, simply invoke  
```script
$ npm install
```

## Usage

To get started, create an account at [developer.clarifai.com](http://developer.clarifai.com).

Create an application, and get your Client ID and Client Secret.

This basic starter uses your Client ID and Client Secret to get an access token.
Since this expires every so often, the client is setup to renew the token for
you automatically using your credentials so you don't have to worry about it.

You'll notice that in the `.gitignore` file, it references a `keys.js` file. 
This is for security purposes, so you don't share your Client ID and Client
Secret with others.  Add the following to that file:

```
var myApiKey = 'YOUR API KEY HERE';
```

You'll also notice a custom_train.js file which serves as a reference for Custom Training. Any custom models that you create (under these credentials) will appear in the dropdown menu on index.html, next to the "Custom" label

## Example Output

<img src="https://s3.amazonaws.com/jared-clarifai-stuff/Screen+Shot+2017-01-05+at+4.04.37+PM.png"/>

Note the "Add image to Application" button on the bottom left of the image. This will automatically add the image to the application that is associated with your credentials!
