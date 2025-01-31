import { NextApiRequest, NextApiResponse } from "next"

import { PageVisibilityEnum } from "~/lib/types"
import { getPagesBySite } from "~/models/page.model"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const query = req.query

  const result = await getPagesBySite({
    characterId: +(query.characterId || 0) as number,
    type: query.type as "post" | "page",
    visibility: query.visibility as PageVisibilityEnum,
    limit: query.take ? parseInt(query.take as string) : undefined,
    cursor: query.cursor as string,
    useStat: true,
    ...(query.tags && {
      tags: Array.isArray(query.tags)
        ? (query.tags as string[])
        : [query.tags as string],
    }),
  })

  res.status(200).json(result)
}
