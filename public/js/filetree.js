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
      var orgResponse = data.response;

      if( orgResponse.status === "ok" ) {
        data.result = orgResponse.result;
      } else {
        // Signal error condition to tree loader
        data.result = {
          error: "ERROR #" + orgResponse.faultCode + ": " + orgResponse.faultMsg
        }
      }
    }
    // ...
  });
  // Note: Loading and initialization may be asynchronous, so the nodes may not be accessible yet.
});
