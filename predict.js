function predict_click(imgurl) {
  document.getElementById('img').src = imgurl;
  app.models.predict(Clarifai.GENERAL_MODEL, imgurl).then(
    function(response) {
      let concept_names = '';
      for (let i = 0; i<response.data.outputs[0].data.concepts.length; i++) {
        concept_names += response.data.outputs[0].data.concepts[i].name + ' ';
      }
      $('#concepts').text(concept_names.toString());
    },
    function(err) {
      console.error(err);
    }
  );
};

