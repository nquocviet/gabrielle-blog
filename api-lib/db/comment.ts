import { ObjectId } from 'mongodb'
import { dbProjectionCreators } from './post'

export async function findComments(db, postId) {
  return db
    .collection('comments')
    .aggregate([
      {
        $match: {
          postId: new ObjectId(postId),
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
      { $sort: { createdAt: -1 } },
      { $project: dbProjectionCreators('creator.') },
    ])
    .toArray()
}

export async function findCommentsByUserId(db, userId, after = '') {
  const comments = await db
    .collection('comments')
    .aggregate([
      {
        $match: {
          creatorId: new ObjectId(userId),
          ...(after && { createdAt: { $gt: new Date(after) } }),
        },
      },
      { $sort: { createdAt: -1 } },
    ])
    .toArray()

  return comments
}

export async function insertComment(
  db,
  { content, depth = 0, postId, creatorId, parentId = '' }
) {
  const comment = {
    postId: new ObjectId(postId),
    creatorId: new ObjectId(creatorId),
    parentId: parentId ? new ObjectId(parentId) : new ObjectId(postId),
    content,
    likes: [],
    likesCount: 0,
    depth,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any
  const { insertedId } = await db.collection('comments').insertOne(comment)
  await db
    .collection('posts')
    .findOneAndUpdate(
      { _id: new ObjectId(postId) },
      { $inc: { commentsCount: 1 } }
    )

  comment._id = insertedId
  return comment
}

export async function likeComment(db, commentId, userId) {
  const post = await db
    .collection('comments')
    .findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $push: { likes: new ObjectId(userId) }, $inc: { likesCount: 1 } },
      { returnDocument: 'after' }
    )

  return post.value
}

export async function unlikeComment(db, commentId, userId) {
  const post = await db
    .collection('comments')
    .findOneAndUpdate(
      { _id: new ObjectId(commentId) },
      { $pull: { likes: new ObjectId(userId) }, $inc: { likesCount: -1 } },
      { returnDocument: 'after' }
    )

  return post.value
}
