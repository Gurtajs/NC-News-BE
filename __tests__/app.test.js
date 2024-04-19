const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data");
const description = require("../endpoints.json");

afterAll(() => {
  return connection.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
  test("GET: 200 - should respond with status 200 and an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics.rows;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("GET: 404 - should respond with an error message saying not found when we try to access a non-existent url", () => {
    return request(app)
      .get("/api/wrong_url")
      .expect(404)
      .then((body) => {
        expect(body.statusCode).toBe(404);
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("/api", () => {
  test("GET: 200 - should provide a description of API endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.description).toEqual(description);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 - should return an article by its id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        
        const article = body.article;
        console.log(body)
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        console.log(article.created_at)
        expect(article.created_at).toBe("2020-07-09T21:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET: 404 - sends an appropriate status and error mesage when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });

  test("GET: 400 - sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/thisarticle")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 - should respond with an appropriate status code and should return all articles ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(Object.keys(article).length).toBe(8);
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("should sort the articles by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: 404 - responds with an error message when given an invalid endpoint", () => {
    return request(app)
      .get("/api/articlesss")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 - should return the comments for the specified article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });

  test("GET: 200 - the most recent comments should be displayed first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET: 404 - should return an error message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
  test("GET: 400 - should return an error message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/invalid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("POST: 201 - should post a comment for the given article id", () => {
    const comment = {
      username: "Gurtaj",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 0,
          author: "Gurtaj",
          article_id: 2,
        });
        expect(typeof body.comment.created_at).toEqual("string");
      });
  });
  test("POST: 400 - should return an error message when client posts a comment with incorrect keys", () => {
    const comment = {
      username: "Gurtajs",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      age: 25,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: non-existent fields passed in");
      });
  });
  test("POST: 404 - should return an error message when client posts a comment to a non-existent article", () => {
    const comment = {
      username: "Gurtajs",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH: 200 - should return a patched article by article_id when votes are being incremented", () => {
    const votes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(typeof body.article.created_at).toBe("string");
      });
  });
  test("PATCH: 200 - should return a patched article by article_id when votes are being decremented", () => {
    const votes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(typeof body.article.created_at).toBe("string");
      });
  });
  test("PATCH: 400 - should return an error message when we patch a property that does not exist in the article", () => {
    const age = {
      age: 25,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(age)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: property does not exist");
      });
  });

  test("PATCH: 404 - should return an error message when we patch an article that does not exist", () => {
    const votes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 - should delete the given comment by comment id", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });

  test("DELETE: 404 - should return an error message when we attempt to delete a comment with a valid but non existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment not found");
      });
  });
  test("DELETE 400 - should return an error message when we attempt to delete a comment when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});
describe("/api/users", () => {
  test("GET: 200 - should return all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("GET: 404 - should return an error message when we access the wrong url", () => {
    return request(app)
      .get("/api/usersss")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe("/api/articles?topic=cats", () => {
  test("GET: 200 - should return an article by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test('GET: 404 - should return an error message when we pass a non-existent but valid topic', () => {
    return request(app)
    .get("/api/articles?topic=nonexistent")
    .expect(404)
    .then(({body}) => {
      expect(body.message).toBe("Not found")
    })
  })
  test('GET: 400 - should return an error message when we pass an invalid topic', () => {
    return request(app)
    .get("/api/articles?topic=d23")
    .expect(400)
    .then(({body}) => {
      expect(body.message).toBe("Bad request")
    })
  })
});

describe('/api/articles/:article_id', () => {
  test('should return an article object by article_id which should also include comment_count', () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({body}) => {
      expect(body.article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: '2020-07-09T20:11:00.000Z',
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 11,
      })
    })
  })
})
