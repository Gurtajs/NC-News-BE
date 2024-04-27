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
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-07-09T21:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });

  test("GET: 200 - should return an article object by article_id which should also include comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          comment_count: 11,
        });
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
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
          expect(article).not.toEqual(
            expect.objectContaining({ body: expect.any(String) })
          );
        });
      });
  });
  test("GET: 200 - should sort the articles by date in descending order", () => {
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
  test("GET: 200 - should sort the articles by the given column name and given order by", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("article_id", {
          ascending: true,
        });
      });
  });
  test("GET: 200 - should return articles by topic and sort the articles by the given column name and given order by", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=author&order_by=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toBeSortedBy("author", {
          ascending: true,
        });
        articles.forEach((article) => {
          expect(article).toMatchObject({ topic: "mitch" });
        });
      });
  });
  test("GET: 400 - responds with an error message when given an invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid&order_by=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("GET 400 - responds with an error message when given an invalid order_by", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order_by=invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
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
          expect(comment.article_id).toBe(1);
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
  test("GET: 200 - should return an empty array if there are no comments associated with the given article id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
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
      username: "butter_bridge",
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
          author: "butter_bridge",
          article_id: 2,
        });
        expect(typeof body.comment.created_at).toEqual("string");
      });
  });
  test("POST: 400 - should return an error message when client posts a comment with incomplete body", () => {
    const comment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: incomplete body");
      });
  });

  test("POST: 404 - should return an error message when the username does not exist", () => {
    const comment = {
      username: "Gurtaj",
      body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
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
        expect(body.message).toBe("Not found");
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
  test("PATCH: 400 - should return an error message when we patch a property in the article other than vote", () => {
    const age = {
      age: 25,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(age)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: property not modifiable");
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
  test("PATCH: 400 - should return an error message when we pass in an invalid article_id", () => {
    const votes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/invalid")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
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
  test("GET: 404 - should return an error message when we pass a non-existent but valid topic", () => {
    return request(app)
      .get("/api/articles?topic=nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
  test("GET: 400 - should return an error message when we pass an invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=d23")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("/api/users/:username", () => {
  test("GET: 200 - should return a user object when given a username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const username = body.username;
        expect(username).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
  test("GET: 404 - should return an error message when given a valid non-existent username", () => {
    return request(app)
      .get("/api/users/gurtaj")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("Not found");
      });
  });
  test("GET: 400 - should return an error message when given an invalid username", () => {
    return request(app)
      .get("/api/users/123")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("PATCH: 200 - should respond with the updated comment when votes is incremented by 1", () => {
    const updatedData = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
        });
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("PATCH: 200 - should respond with the updated comment when votes is decremented by 1", () => {
    const updatedData = { inc_votes: -100 };
    return request(app)
      .patch("/api/comments/1")
      .send(updatedData)
      .expect(200)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 1,
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: -84,
          author: "butter_bridge",
          article_id: 9,
        });
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("PATCH: 400 - should return an error message when we patch a property in the article other than vote", () => {
    const age = {
      age: 25,
    };
    return request(app)
      .patch("/api/comments/1")
      .send(age)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request: property not modifiable");
      });
  });
  test("PATCH: 404 - should return an error message when we patch an article that does not exist", () => {
    const votes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/comments/999")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not found");
      });
  });
  test("PATCH: 400 - should return an error message when we pass in an invalid article_id", () => {
    const votes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/comments/invalid")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe('/api/articles', () => {
  test('POST: 201 - should return the newly posted article', () => {
    const article = {
      title: "Ac Milan",
      topic: "mitch",
      author: "butter_bridge",
      body: "7 Champions Leagues",
    }
    return request(app)
    .post('/api/articles')
    .send(article)
    .expect(201)
    .then(({body}) => {
      const article = body.article
      console.log(article)
      expect(article).toMatchObject({
        title: "Ac Milan",
        topic: "mitch",
        author: "butter_bridge",
        body: "7 Champions Leagues",
        article_id: 14,
        votes: 0,
        comment_count: 0,
      })
    })
  })
  test('POST: 400 - should return an error message when there is a missing required field in the body', () => {
    const article = {
      title: "Ac Milan",
      author: "butter_bridge",
      body: "7 Champions Leagues",
    }
    return request(app)
    .post('/api/articles')
    .send(article)
    .expect(400)
    .then(({body}) => {
      expect(body.message).toEqual('Bad request')
    })
  })
  test('POST 404 - should return an error message when there is a wrong value inputted in the field', () => {
    const article = {
      title: "Ac Milan",
      topic: "milan",
      author: "butter_bridge",
      body: "7 Champions Leagues",
    }
    return request(app)
    .post('/api/articles')
    .send(article)
    .expect(404)
    .then(({body}) => {
      expect(body.message).toEqual('Not found')
    })
  })
  
  })


