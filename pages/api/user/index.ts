import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import { middleware, validate } from '@api-lib/middlewares'
import { extractUser } from '@lib/user'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { updateUser } from '@api-lib/db'
import { updateUserSchema } from '@api-lib/schemas'
import { TNextApiRequest } from '@global/types'

const upload = multer({ dest: '/tmp' })
const handler = nextConnect<TNextApiRequest, NextApiResponse>()

handler.use(middleware)
handler.get(async (req: NextApiRequest, res: NextApiResponse) =>
  res.json({ user: extractUser((req as any).user) })
)

handler.patch(
  upload.single('profilePicture'),
  validate(updateUserSchema, async (req, res) => {
    if (!req.user) {
      req.status(401).end()
      return
    }

    let profilePicture
    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path, {
        width: 120,
        height: 120,
        crop: 'fill',
      })
      profilePicture = image.secure_url
    }

    const user = await updateUser(req.db, req.user._id, {
      ...req.body,
      ...(profilePicture && { profilePicture }),
    })

    return res.json({ user: user.value })
  })
)

export const config = { api: { bodyParser: false } }

export default handler
