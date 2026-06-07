export function isConversationalIntent(intent: string){
  const conversationalIntents = [
    "joke_request",
    "greeting",
    "small_talk",
    "fun_fact",
    "motivation_request",
    "buy_product",
    "buy_course",
    "shopping",
    "recommendation",
    "research",
    "comparison",
    "advice",
    "question"
  ];

  return conversationalIntents.includes(intent);
}