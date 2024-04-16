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
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
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
          expect(Object.keys(article).length).toBe(8)
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

  test('should sort the articles by date in descending order', () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({body}) => {
      const articles = body.articles
      expect(articles).toBeSortedBy('created_at', {
        descending: true,
      })
    })
  })
  test('GET: 404 - responds with an error message when given an invalid endpoint', () => {
    return request(app)
    .get("/api/articlesss")
    .expect(404)
    .then((body) => {
      expect(body.res.statusMessage).toBe("Not Found")
  })
})
});
