const app = require('../app')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const connection = require('../db/connection')
const data = require('../db/data/test-data')

afterAll(()=>{
    return connection.end()
})

beforeEach(()=>{
    return seed(data)
})

describe('/api/topics', () => {
  test('GET: 200 - should respond with status 200 and an array of topic objects', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then(({body}) => {
        const topics = body.topics.rows
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string')
            expect(typeof topic.description).toBe('string')
        })
    })
  })
  test('GET: 400 - should respond with an error message saying not found when we try to access a non-existent url', () => {
    return request(app)
    .get('/api/wrong_url')
    .expect(404)
    .then((body) => {
        expect(body.statusCode).toBe(404)
        expect(body.res.statusMessage).toBe('Not Found')
    })
  })
})
