const { main } = require("components-helper");
main({
  name: "test",
  version: "1.0.0",
  entry: "src/*.md",
  outDir: "dist",

  space: 2,
});
