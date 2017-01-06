function predict_click(value, source) {
  
  if(source == 'url') {
    document.getElementById('img_preview').src = value;
    doPredict({ url: value });
    document.getElementById("hidden-type").value = "url";
    document.getElementById("hidden-val").value = value;
  }
    
  else if(source == 'file') {
    var preview = document.querySelector('#img_preview');
    var file    = document.querySelector('input[type=file]').files[0];
    var reader  = new FileReader();

    // load local file picture
    reader.addEventListener("load", function () {
      preview.src = reader.result;
      var local_base64 = reader.result.split("base64,")[1];
      doPredict({ base64: local_base64 });
      document.getElementById("hidden-type").value = "base64";
      document.getElementById("hidden-val").value = local_base64;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  } 
}

function doPredict(value) {
  
  app.models.predict(getSelectedModel(), value).then(
    
    function(response) {
      let concept_names = "";
      var tag_array;
    
      // Check for color model since it has different JSON
      if(getSelectedModel() != Clarifai.COLOR_MODEL) {
        tag_array = response.rawData.outputs[0].data.concepts;
 
        for (let i = 0; i < tag_array.length; i++) 
          concept_names += '<li>' + tag_array[i].name + ': <i>' + tag_array[i].value + '</i></li>';
      }
      else {
        tag_array = response.data.outputs[0].data.colors;
        for (let i = 0; i < tag_array.length; i++)
          concept_names += '<li>' + tag_array[i].w3c.name + ': <i>' + tag_array[i].value + '</i></li>';
      }
      
      // show tags in 2 columns if there are more than 10. Else show 1
      if(tag_array.length > 10)
        concept_names = '<ul style="margin-right:20px; margin-top:20px; columns:2; -webkit-columns:2; -moz-columns:2;">' + concept_names;
      
      else
        concept_names = '<ul style="margin-right:20px; margin-top:20px;">' + concept_names;
        
      concept_names += '</ul>';
      $('#concepts').html(concept_names);
      
      document.getElementById("add-image-button").style.visibility = "visible";
    },
    function(err) {
      console.log(err);
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
    
  else if(model == "apparel")
    return "e0be3b9d6a454f0493ac3a30784001ff";
    
  else if(model == "faces")
    return "c67b5872d8b44df4be55f2b3de3ebcbb";
  
  else if(model == "demographic")
    return "c0c0ac362b03416da06ab3fa36fb58e3";
    
  else if(model == "custom") {
    var e = document.getElementById("custom_models_dropdown");
    return e.options[e.selectedIndex].value;
  }
}

function addImageToApp() {
  var img_type = document.getElementById("hidden-type").value;
  var img_value = document.getElementById("hidden-val").value;
  
  if(img_type == "url") {
    app.inputs.create({
      url: img_value
    }).then(
      function(response) {
        alert("Image successfully added!");
      },
      function(err) {
        alert(err);
      }
    );
  }
  
  else if(img_type == "base64") {
    app.inputs.create({
      base64: img_value
    }).then(
      function(response) {
        alert("Image successfully added!");
      },
      function(err) {
        alert("Error Adding Image. Check to see if it is a duplicate.");
      }
    );
  }
}
