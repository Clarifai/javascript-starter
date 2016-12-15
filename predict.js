function predict_click(value, source) {
  
  if(source == 'url') {
    document.getElementById('img_preview').src = value;
    doPredict({ url: value });
  }
    
  else if(source == 'file') {
    var preview = document.querySelector('img');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    // load local file picture
    reader.addEventListener("load", function () {
      preview.src = reader.result;
      var local_base64 = reader.result.split("base64,")[1];
      doPredict({ base64: local_base64 });
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  } 
}

function doPredict(value) {
  
  app.models.predict(getSelectedModel(), value).then(
    function(response) {
      let concept_names = '<ul style="margin-right:10px">';
      
      // Check for color model since it has different JSON
      if(getSelectedModel() != Clarifai.COLOR_MODEL) {
        for (let i = 0; i < response.data.outputs[0].data.concepts.length; i++) {
          concept_names += '<li>' + response.data.outputs[0].data.concepts[i].name + ': <i>' + response.data.outputs[0].data.concepts[i].value + '</i></li>';
        }
      }
      else {
        for (let i = 0; i < response.data.outputs[0].data.colors.length; i++) {
          concept_names += '<li>' + response.data.outputs[0].data.colors[i].w3c.name + ': <i>' + response.data.outputs[0].data.colors[i].value + '</i></li>';
        }
      }
      concept_names += '</ul>';
      $('#concepts').html(concept_names);
    },
    function(err) {
      console.error(err);
    }
  );
}

function getSelectedModel() {
  var model = document.querySelector('input[name = "model"]:checked').value;
  
  if(model == "general")
    return Clarifai.GENERAL_MODEL;
    
  else if(model == "food")
    return Clarifai.FOOD_MODEL;
    
  else if(model == "NSFW")
    return Clarifai.NSFW_MODEL;
    
  else if(model == "travel")
    return Clarifai.TRAVEL_MODEL;
    
  else if(model == "wedding")
    return Clarifai.WEDDINGS_MODEL;
    
  else if(model == "color")
    return Clarifai.COLOR_MODEL;
}
