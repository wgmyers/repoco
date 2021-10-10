// filetree.js

// Embed the fancy shmancy filetree

$(function() {  // on page load
  // Create the tree inside the <div id="tree"> element.
  $("#tree").fancytree({
    extensions: ["edit", "filter"],
    source: {
      url: "/api/sites",
      cache: false
    },
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
    }
    // ...
  });
  // Note: Loading and initialization may be asynchronous, so the nodes may not be accessible yet.
});
