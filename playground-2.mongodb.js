/* global use, db */
// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

const database = "csrf_app";

// Use the database
use(database);

// Drop existing collections if they exist
try {
  db.users.drop();
  print("Dropped existing users collection");
} catch (e) {
  print("Users collection doesn't exist, proceeding...");
}

try {
  db.reviews.drop();
  print("Dropped existing reviews collection");
} catch (e) {
  print("Reviews collection doesn't exist, proceeding...");
}

// Create users collection with validation
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          bsonType: "string",
          description: "Username must be a string and is required",
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Email must be a valid email address and is required",
        },
        password: {
          bsonType: "string",
          description: "Password must be a string and is required",
        },
        createdAt: {
          bsonType: "date",
          description: "Creation date must be a date",
        },
      },
    },
  },
});

// Create reviews collection with validation
db.createCollection("reviews", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "movieId", "rating", "content"],
      properties: {
        userId: {
          bsonType: "objectId",
          description: "User ID must be an ObjectId and is required",
        },
        movieId: {
          bsonType: "number",
          description: "Movie ID must be a number and is required",
        },
        rating: {
          bsonType: "number",
          minimum: 1,
          maximum: 5,
          description: "Rating must be a number between 1 and 5",
        },
        content: {
          bsonType: "string",
          description: "Review content must be a string and is required",
        },
        createdAt: {
          bsonType: "date",
          description: "Creation date must be a date",
        },
      },
    },
  },
});

// The prototype form to create a collection:
/* db.createCollection( <name>,
  {
    capped: <boolean>,
    autoIndexId: <boolean>,
    size: <number>,
    max: <number>,
    storageEngine: <document>,
    validator: <document>,
    validationLevel: <string>,
    validationAction: <string>,
    indexOptionDefaults: <document>,
    viewOn: <string>,
    pipeline: <pipeline>,
    collation: <document>,
    writeConcern: <document>,
    timeseries: { // Added in MongoDB 5.0
      timeField: <string>, // required for time series collections
      metaField: <string>,
      granularity: <string>,
      bucketMaxSpanSeconds: <number>, // Added in MongoDB 6.3
      bucketRoundingSeconds: <number>, // Added in MongoDB 6.3
    },
    expireAfterSeconds: <number>,
    clusteredIndex: <document>, // Added in MongoDB 5.3
  }
)*/

// More information on the `createCollection` command can be found at:
// https://www.mongodb.com/docs/manual/reference/method/db.createCollection/
