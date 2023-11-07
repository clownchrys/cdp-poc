import type { NextApiRequest, NextApiResponse } from 'next'
import { AthenaExpress } from 'athena-express'
import aws from "aws-sdk"

export type RequestType = {
  query: string,
}

export type ResponseType = {
  result: any,
  query: string,
  extra?: any
}

(BigInt.prototype as any).toJSON = function () {
  return Number(this.toString())
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  // body parse
  const {body} = req
  const query: string = (body as RequestType).query

  // build client
  aws.config.update({
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY, correctClockSkew: true,
    apiVersion: "latest",
  })

  const athenaExpress = new AthenaExpress({
    aws,
    s3: process.env.S3,
    workgroup: process.env.WORKGROUP,
  })

  // on processing
  let result: ResponseType["result"]
  let success: boolean = true;

  try {
    result = await athenaExpress.query(query)
  } catch (exception) {
    success = false
    result = (exception as Error).toString()
  }

  res.status(success ? 200 : 400).json({query, result})
}
