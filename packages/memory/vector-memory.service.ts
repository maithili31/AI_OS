import * as lancedb
from "@lancedb/lancedb";

const DB_PATH =
  "./memory-db";

const TABLE_NAME =
  "memories";

async function getEmbedding(
  text: string
) {

  const response =
    await fetch(
      "http://localhost:11434/api/embeddings",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          model:
            "nomic-embed-text",

          prompt: text
        })
      }
    );

  const data =
    await response.json();

  return data.embedding;
}

export async function saveVectorMemory(

  content: string,

  metadata: any = {}
) {

  const db =
    await lancedb.connect(
      DB_PATH
    );

  const embedding =
    await getEmbedding(
      content
    );

  let table;

  try {

    table =
      await db.openTable(
        TABLE_NAME
      );

  } catch {

    table =
      await db.createTable(

        TABLE_NAME,

        [
          {
            vector:
              embedding,

            content,

            metadata:
              JSON.stringify(
                metadata
              )
          }
        ]
      );

    return;
  }

  await table.add([

    {
      vector:
        embedding,

      content,

      metadata:
        JSON.stringify(
          metadata
        )
    }
  ]);

  console.log(
    "VECTOR MEMORY SAVED"
  );
}

// export async function searchMemories(

//   query: string,

//   limit = 5
// ) {

//   const db =
//     await lancedb.connect(
//       DB_PATH
//     );

//   const table =
//     await db.openTable(
//       TABLE_NAME
//     );

//   const embedding =
//     await getEmbedding(
//       query
//     );

//   const results =
//     await table

//       .search(embedding)

//       .limit(limit)

//       .toArray();

//   return results;
// }

export async function searchMemories(

  query: string,

  limit = 5
) {

  try {

    const db =
      await lancedb.connect(
        DB_PATH
      );

    const table =
      await db.openTable(
        TABLE_NAME
      );

    const embedding =
      await getEmbedding(
        query
      );

    const results =
      await table

        .search(embedding)

        .limit(limit)

        .toArray();

    return results;

  } catch (error) {

    console.log(
      "VECTOR MEMORY EMPTY"
    );

    return [];
  }
}