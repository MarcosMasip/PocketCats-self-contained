import db from "../../../db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const result = await db.query('INSERT INTO todos (name, completed) VALUES ($1, $2) RETURNING *', [req.body.name, req.body.completed])
    res.send(result.rows[0])
  } else {
    if (typeof req.query.completed !== 'undefined') {
      // coerce string query param to boolean
      const completed = req.query.completed === 'true' || req.query.completed === true
      const result = await db.query('SELECT * FROM todos WHERE completed = $1', [completed])
      res.send(result.rows)
    } else {
      const result = await db.query('SELECT * FROM todos')
      res.send(result.rows)
    }
  }
}