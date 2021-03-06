import { getRandomColor } from '@utils/utils'
import normalizeEmail from 'validator/lib/normalizeEmail'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'

export async function findUserForAuth(db, userId) {
  return db
    .collection('users')
    .findOne({ _id: new ObjectId(userId) }, { projection: { password: 0 } })
    .then((user) => user || null)
}

export async function findUserWithEmailAndPassword(db, email, password) {
  email = normalizeEmail(email)
  const user = await db.collection('users').findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    return { ...user, password: undefined }
  }
  return null
}

export async function findUserByUsername(db, username) {
  return db
    .collection('users')
    .findOne({ username }, { projection: { password: 0 } })
    .then((user) => user || null)
}

export async function findUserByEmail(db, email) {
  email = normalizeEmail(email)
  return db
    .collection('users')
    .findOne({ email }, { projection: { password: 0 } })
    .then((user) => user || null)
}

export async function updateUser(db, id, body) {
  return db
    .collection('users')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { returnDocument: 'after', projection: { password: 0 } }
    )
    .then((user) => user || null)
}

export async function updateUserPassword(db, id, oldPassword, newPassword) {
  const user = await db.collection('users').findOne({ _id: new ObjectId(id) })
  if (!user) return false
  const matched = await bcrypt.compare(oldPassword, user.password)
  if (!matched) return false
  const password = await bcrypt.hash(newPassword, 10)
  await db
    .collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { password } })

  return true
}

export async function insertUser(
  db,
  { email, password, username, position, interests }
) {
  const user = {
    email,
    username,
    position,
    interests,
    profilePicture: `https://avatars.dicebear.com/api/identicon/${username}.svg?size=120`,
    bio: '',
    location: '',
    backdrop: getRandomColor(),
    skills: '',
    postsCount: 0,
    bookmarksCount: 0,
    followersCount: 0,
    followingCount: 0,
    status: true,
    reportReceived: 0,
  }
  const salt: string = await bcrypt.genSalt(10)
  const hashedPassword: string = await bcrypt.hash(password, salt)
  const { insertedId } = await db.collection('users').insertOne({
    ...user,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  ;(user as any)._id = insertedId

  return user
}
