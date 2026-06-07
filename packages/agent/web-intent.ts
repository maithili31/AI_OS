export function
needsWebSearch(

  text: string

) {

  const webKeywords = [

    "price",

    "compare",

    "lowest",

    "best",

    "amazon",

    "flipkart",

    "course",

    "weather",

    "news",

    "stock",

    "review",

    "rating"
  ];

  return webKeywords.some(
    keyword =>

      text
        .toLowerCase()
        .includes(keyword)
  );
}