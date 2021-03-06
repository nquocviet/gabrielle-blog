import { findBookmarksDetailByUserId } from '@api-lib/db'
import { middleware } from '@api-lib/middlewares'
import { TNextApiRequest } from '@global/types'
import { NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const handler = nextConnect<TNextApiRequest, NextApiResponse>()

handler.use(middleware)

handler.get(async (req: TNextApiRequest, res: NextApiResponse) => {
  const rawBookmarks = await findBookmarksDetailByUserId(req.db, req.user._id)
  const bookmarks = rawBookmarks.map(({ post }) => post)

  return res.json({ bookmarks })
})

export default handler
