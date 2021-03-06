import { ObjectId } from 'mongodb'
import { findTopicAndUpdate, insertTopic } from './topic'

export async function findPostById(db, id) {
  const post = await db
    .collection('posts')
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $lookup: {
          from: 'topics',
          localField: 'topic',
          foreignField: '_id',
          as: 'topics',
        },
      },
      { $limit: 1 },
      { $project: { topic: 0, ...dbProjectionCreators('creator.') } },
    ])
    .toArray()

  if (!post[0]) return null

  const topics = post[0].topics.map(({ _id, ...rest }) => ({
    _id: String(_id),
    ...rest,
  }))

  return { ...changeDataObjectToString(post[0]), topics }
}

export async function findPosts(
  db,
  by,
  topic,
  title,
  not,
  limit = 1000,
  skip = 0,
  random = false
) {
  const MAX_RANDOM_POSTS = 4
  const count = await db.collection('posts').countDocuments({})
  const randomIndex = Math.floor(Math.random() * (count - MAX_RANDOM_POSTS))
  const randomSkip =
    randomIndex - MAX_RANDOM_POSTS > 0
      ? randomIndex - MAX_RANDOM_POSTS
      : randomIndex

  const posts = await db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(title && { title: { $regex: title, $options: 'gi' } }),
          ...(by && { creatorId: new ObjectId(by) }),
          ...(topic && { topic: new ObjectId(topic) }),
          ...(not && { _id: { $ne: new ObjectId(not) } }),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'postId',
          as: 'likes',
        },
      },
      {
        $lookup: {
          from: 'bookmarks',
          localField: '_id',
          foreignField: 'postId',
          as: 'bookmarks',
        },
      },
      {
        $lookup: {
          from: 'topics',
          localField: 'topic',
          foreignField: '_id',
          as: 'topics',
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: random ? randomSkip : skip },
      { $limit: limit },
      {
        $project: { content: 0, topic: 0, ...dbProjectionCreators('creator.') },
      },
    ])
    .toArray()

  return posts.map((post) => {
    const topics = post.topics.map(({ _id, ...rest }) => ({
      _id: String(_id),
      ...rest,
    }))
    const likes = post.likes.map((like) => String(like.userId))
    const bookmarks = post.bookmarks.map((bookmark) => String(bookmark.userId))
    changeDataObjectToString(post)
    return { ...post, topics, likes, bookmarks }
  })
}

export async function findPostsByUserId(db, by, after = '') {
  const posts = await db
    .collection('posts')
    .aggregate([
      {
        $match: {
          ...(after && { createdAt: { $gt: new Date(after) } }),
          ...(by && { creatorId: new ObjectId(by) }),
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: { content: 0, topic: 0 },
      },
    ])
    .toArray()

  return posts
}

export async function updatePost(db, id, body) {
  return db
    .collection('posts')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { returnDocument: 'after' }
    )
    .then((post) => post || null)
}

export async function insertPost(
  db,
  { creatorId, content, topic, title, cover, readingTime, published }
) {
  const post = {
    creatorId,
    content,
    title,
    cover,
    readingTime,
    likesCount: 0,
    commentsCount: 0,
    bookmarksCount: 0,
    totalViews: 0,
    published,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const topicArr = await Promise.all(
    topic.map(async (topic) => {
      const { value, label, color } = topic
      const topicExisted = await db.collection('topics').findOne({ value })

      if (topicExisted) {
        await findTopicAndUpdate(db, String(topicExisted._id))
        return topicExisted._id
      } else {
        const insertedId = await insertTopic(db, {
          label,
          value,
          name: value,
          description: '',
          color,
        })
        await findTopicAndUpdate(db, String(insertedId))
        return insertedId
      }
    })
  )

  const { insertedId } = await db
    .collection('posts')
    .insertOne({ ...post, topic: topicArr })

  if (published) {
    await db
      .collection('users')
      .findOneAndUpdate(
        { _id: new ObjectId(creatorId) },
        { $inc: { postsCount: 1 } }
      )
  }

  return insertedId
}

export const changeDataObjectToString = (data) => {
  data._id = String(data._id)
  data.creatorId = String(data.creatorId)
  data.createdAt = data.createdAt.getTime()
  data.updatedAt = data.updatedAt.getTime()
  data.creator._id = String(data.creator._id)
  data.creator.createdAt = data.creator.createdAt.getTime()
  data.creator.updatedAt = data.creator.updatedAt.getTime()

  return data
}

export const dbProjectionCreators = (prefix = '') => {
  return {
    [`${prefix}interests`]: 0,
    [`${prefix}password`]: 0,
    [`${prefix}status`]: 0,
    [`${prefix}reportReceived`]: 0,
  }
}
