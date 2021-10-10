// filetree.js

// Embed the fancy shmancy filetree

function load_file_event(file) {
  const event = new CustomEvent(
  	"load_file",
  	{
  		detail: {
  			message: "Custom fileload request event",
        file: file,
  			time: new Date(),
  		},
  		bubbles: true,
  		cancelable: true
  	}
  );
  document.dispatchEvent(event);
}

$(function() {  // on page load
  // Create the tree inside the <div id="tree"> element.
  $("#tree").fancytree({
    extensions: ["edit", "filter"],
    source: {
      url: "/api/sites",
      cache: false
    },

    // Event handler to process the response from /api/sites
    // See https://github.com/mar10/fancytree/wiki/TutorialLoadData#recipes
    postProcess: function(event, data) {
      const json = data.response;

      if( json.status === "ok" ) {
        data.result = json.result;
      } else {
        // Signal error condition to tree loader
        data.result = {
          error: json.error
        }
      }
    },

    // Event handler to handle click on leaf nodes
    click: function(event, data) {
      if(data.node.data.loadable) {
        load_file_event(data.node.data.loadpath);
        // NB: We don't return false so filetree highlights the clicked file
      }
    },

  });

});
