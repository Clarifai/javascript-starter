// Require the client
var Clarifai = require('clarifai');
var fs = require('fs');
var FileReader = require('filereader');

// instantiate a new Clarifai app passing in your clientId and clientSecret
var app = new Clarifai.App(
  CLIENT_ID,
  CLIENT_SECRET
);

trainModel();

// once inputs are created, create model by giving name and list of concepts
function createModel() {
  app.models.create('pets', ["dog", "cat"]).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.error(error);
    }
  );
}

// inputs with concept using urls
function addInputsWithUrls(urls, isPostive, concept){
  for (index in urls){
    app.inputs.create({
      url: urls[index],
      concepts: [
        {
          id: concept,
          value: isPostive
        }
      ]
    }).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }   
    );
  }
}


// inputs with concept using filepath
function addInputsWithFiles(filepath, isPostive, concept){

  for(data of getBase64s(getFiles(filepath))){
    app.inputs.create({
      base64: data,
      concepts: [
        {
          id: concept,
          value: isPostive
        }
      ]
    });
  }
}


function getFiles(dir){
    fileList = [];
 
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i) || i == 0) continue;
        var name = dir+'/'+files[i];
        if (!fs.statSync(name).isDirectory()){
            fileList.push(name);
        }
    }
    return fileList;
}

function getBase64s(fileList) {
  var FR = new FileReader();
  base64s = [];
  for(index in fileList) {
    base64s.push(base64_encode(fileList[index]));
  }
  return base64s;
}

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


// after model is created, you can now train the model
function trainModel() {
  app.models.train("pets").then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.error(error);
    }  
  );
}
