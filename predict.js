/*
  Purpose: Pass information to other helper functions after a user clicks 'Predict'
  Args:
  	value - Actual filename or URL
  	source - 'url' or 'file'
*/
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

/*
  Purpose: Does a v2 prediction based on user input
  Args:
  	value - Either {url : url_value} or { base64 : base64_value }
*/
function doPredict(value) {

  var model_id = getSelectedModel();

  app.models.predict(model_id, value).then(
    
    function(response) {
      let concept_names = "";
      var tag_array, region_array;
      var tag_count = 0;
      var model_name = response.rawData.outputs[0].model.name;
      
      // Check for regions models first
      if(response.rawData.outputs[0].data.hasOwnProperty("regions")) {
      	var region_array = response.rawData.outputs[0].data.regions;

      	// regions are found, so iterate through all of them
      	for(let i = 0; i < region_array.length; i++) {
      	  concept_names += '<b>Result ' + (i+1) + '</b>';  
      		 		
      	  // Demographics has separate sub-arrays
      	  if(model_name == "demographics") {
      	    age_array = region_array[i].data.face.age_appearance.concepts;
      	    ethnic_array = region_array[i].data.face.multicultural_appearance.concepts;
      	    gender = region_array[i].data.face.gender_appearance.concepts;
      		
      	  // Age Header
      	  concept_names += '<br/><b><span style="font-size:10px">Age Appearance</span></b>';
      		
      	  // print top 5 ages
      	  for(let a = 0; a < 5; a++)
      	     concept_names += '<li>' + age_array[a].name + ': <i>' + age_array[a].value + '</i></li>'; 
      		
      	  // Ethnicity Header
      	  concept_names += '<b><span style="font-size:10px">Multicultural Appearance</span></b>'
      			
      	  // print top 3 ethnicities
      	  for(let e = 0; e < 3; e++)
      	    concept_names += '<li>' + ethnic_array[e].name + ': <i>' + ethnic_array[e].value + '</i></li>'; 
      		      		
      	  // Gender Header
      	  concept_names += '<b><span style="font-size:10px">Gender Appearance</span></b>'
      		
      	  // print gender
      	    concept_names += '<li>' + gender.name + ': <i>' + gender.value + '</i></li>'; 
          }
      		
          // For faces just print bounding boxes
      	  else if(model_name == "face-v1.3") {
      	    // Top Row
      	    concept_names += '<li>Top Row: <i>' + region_array[i].region_info.bounding_box.top_row + '</i></li>';
      	    concept_names += '<li>Left Column: <i>' + region_array[i].region_info.bounding_box.left_col + '</i></li>';
      	    concept_names += '<li>Bottom Row: <i>' + region_array[i].region_info.bounding_box.bottom_row + '</i></li>';
      	    concept_names += '<li>Right Column: <i>' + region_array[i].region_info.bounding_box.right_col + '</i></li>';
      	  }
      		
      	  // Celebrity
      	  else if(model_name == "celeb-v1.3") {
      	    tag_array = region_array[i].data.face.identity.concepts;
      			
      	    // Print first 10 results
      	    for(var c=0; c < 10; c++)
      	      concept_names += '<li>' + tag_array[c].name + ': <i>' + tag_array[c].value + '</i></li>'; 
	  }
          
          // Logos
      	  else if(model_name == "logo") {
      	    // Print all results
      	    concept_names += '<br/><b><span style="font-size:10px">Logo</span></b>';
      	    concept_names += '<li>' + region_array[i].data.concepts[0].name + ': <i>' + region_array[i].data.concepts[0].value + '</i></li>';
            concept_names += '<br/><b><span style="font-size:10px">Location</span></b>';
      	    concept_names += '<li>Top Row: <i>' + region_array[i].region_info.bounding_box.top_row + '</i></li>';
            concept_names += '<li>Left Column: <i>' + region_array[i].region_info.bounding_box.left_col + '</i></li>';
      	    concept_names += '<li>Bottom Row: <i>' + region_array[i].region_info.bounding_box.bottom_row + '</i></li>';
      	    concept_names += '<li>Right Column: <i>' + region_array[i].region_info.bounding_box.right_col + '</i></li>';
      	  }
          
          // Focus
      	  else if(model_name == "focus") {
      	    // Print total focus score and all regions with focus
      			
      	    if(i == 0) {
      	      concept_names += '<li>Overall Focus: <i>' + response.rawData.outputs[0].data.focus.value + '</i></li>'; 
      	    }
      			
      	    concept_names += '<br/><b><span style="font-size:10px">Focus Region</span></b>';
            concept_names += '<li>Top Row: <i>' + region_array[i].region_info.bounding_box.top_row + '</i></li>';
      	    concept_names += '<li>Left Column: <i>' + region_array[i].region_info.bounding_box.left_col + '</i></li>';
      	    concept_names += '<li>Bottom Row: <i>' + region_array[i].region_info.bounding_box.bottom_row + '</i></li>';
      	    concept_names += '<li>Right Column: <i>' + region_array[i].region_info.bounding_box.right_col + '</i></li>';
      	  }
      		
      	  tag_count+=10;      	
     	}
      }
      
      // Color Model has its own JSON response
      else if(model_name == "color") {
      	concept_names += '<b><span style="font-size:10px">Colors</span></b>';
        tag_array = response.rawData.outputs[0].data.colors;
        
        for (let col = 0; col < tag_array.length; col++)
          concept_names += '<li>' + tag_array[col].w3c.name + ': <i>' + tag_array[col].value + '</i></li>';

        tag_count=tag_array.length;
      }
      
      // Generic tag response models (general, food, etc.)
      else if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        tag_array = response.rawData.outputs[0].data.concepts;
        
        for (let i = 0; i < tag_array.length; i++) 
          concept_names += '<li>' + tag_array[i].name + ': <i>' + tag_array[i].value + '</i></li>';
          
        tag_count=tag_array.length;
      }
      
      // Bad region request
      else {
      	if(model_name != "logo" && model_name != "focus")
      	  $('#concepts').html("<br/><br/><b>No Faces Detected!</b>");
      	else if(model_name == "logo")
      	  $('#concepts').html("<br/><br/><b>No Logos Detected!</b>");
        else
          $('#concepts').html("<br/><br/><b>No Focus Regions Detected!</b>");
      	return;
      }
      
      var column_count = tag_count / 10;
      
      concept_names = '<ul style="margin-right:20px; margin-top:20px; columns:' + column_count + '; -webkit-columns:' + column_count + '; -moz-columns:' + column_count + ';">' + concept_names;
        
      concept_names += '</ul>';
      $('#concepts').html(concept_names);
      
      document.getElementById("add-image-button").style.visibility = "visible";
    },
    function(err) {
      console.log(err);
    }
  );
}

/*
  Purpose: Return a back-end model id based on current user selection
  Returns:
    Back-end model id
*/
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
    return Clarifai.FACE_DETECT_MODEL;
  
  else if(model == "demographic")
    return Clarifai.DEMOGRAPHICS_MODEL;
  
  else if(model == "logo")
    return Clarifai.LOGO_MODEL;

  else if(model == "focus")
    return Clarifai.FOCUS_MODEL;
  
  else if(model == "celebrity")
    return "e466caa0619f444ab97497640cefc4dc";
  
  else if(model == "custom") {
    var e = document.getElementById("custom_models_dropdown");
    return e.options[e.selectedIndex].value;
  }
}

/*
  Purpose: Add an image to an application after user clicks button
  Args:
    index - # of the image in the session
*/
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
