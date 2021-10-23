// git.js

// All the git interaction happens here

function load_changes() {
  const items = [
    { name: "Peep", files: 20 },
    { name: "Poop", files: 0 },
    { name: "Parp", files: 1 }
  ];
  return {
    status: "ok",
    changes: items
  }
}

module.exports = {
  load_changes: load_changes
};
