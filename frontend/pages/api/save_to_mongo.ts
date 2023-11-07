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

  let success: boolean = true
  let result: ResponseType["result"]

  try {
    const insertResult = await collection.insertOne({ query })
    result = insertResult.insertedId.toString()
  } catch (exception) {
    success = false
    result = (exception as Error).toString()
  }

  // result
  res.status(success ? 200 : 400).json({result})
}
