module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/logo.png");

  // Create a collection of posts sorted by date (newest first)
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Date formatting filter
  eleventyConfig.addFilter("dateFormat", function (date) {
    const d = new Date(date);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return d.toLocaleDateString("en-US", options);
  });

  // ISO date filter for datetime attributes
  eleventyConfig.addFilter("dateISO", function (date) {
    return new Date(date).toISOString().split("T")[0];
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
