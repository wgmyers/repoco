// filetree.js

// Embed the fancy shmancy filetree

$(function(){  // on page load
  // Create the tree inside the <div id="tree"> element.
  $("#tree").fancytree({
    extensions: ["edit", "filter"],
    source:  [
      {title: "vmyers.com", key: "1", folder: true, expanded: true, children: [
        {title: "about.md", key: "2"},
        {title: "abcoasters.md", key: "3"}
      ]}
  ],
    // ...
  });
  // Note: Loading and initialization may be asynchronous, so the nodes may not be accessible yet.
});
