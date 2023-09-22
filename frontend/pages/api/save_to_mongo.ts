import type { NextApiRequest, NextApiResponse } from 'next'
import * as mongo from "mongodb"

export type RequestType = {
  query: string,
}

export type ResponseType = {
  result: number | string,
}

const UNKNOWN = "UNKNOWN"

export default async function handler(
  req: NextApiRequest, res: NextApiResponse<ResponseType>
) {

  // body parse
  const {body} = req
  const query: string = (body as RequestType).query

  // build client
  const client = new mongo.MongoClient(process.env.MONGO_URI || UNKNOWN)

  // on processing
  const db = client.db(process.env.MONGO_DB_NAME || UNKNOWN)
  const collection = db.collection(process.env.MONGO_COLLECTION_NAME || UNKNOWN)
  const result = await collection.insertOne({ query })

  // result
  res.status(200).json({
    result: result.insertedId.toString(),
  })
}
