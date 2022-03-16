import {
  MAX_LENGTH_10000,
  MAX_LENGTH_255,
  MIN_LENGTH_8,
} from '@utils/constants'
import Joi from 'joi'

export const postSchema = Joi.object({
  title: Joi.string()
    .min(MIN_LENGTH_8)
    .max(MAX_LENGTH_255)
    .required()
    .messages({
      'string.min': `Title must be at least ${MIN_LENGTH_8} characters long.`,
      'string.max': `Title must be less than or equal to ${MAX_LENGTH_255} characters long.`,
      'string.empty': 'Title is not allowed to be empty.',
    }),
  description: Joi.string()
    .max(MAX_LENGTH_255)
    .messages({
      'string.max': `Description must be less than or equal to ${MAX_LENGTH_255} characters long.`,
    }),
  topic: Joi.required().messages({
    'any.required': 'Please at least one topic.',
  }),
  contentUnsafe: Joi.string()
    .min(MIN_LENGTH_8)
    .max(MAX_LENGTH_10000)
    .required()
    .messages({
      'string.min': `Content must be at least ${MIN_LENGTH_8} characters long.`,
      'string.max': `Content must be less than or equal to ${MAX_LENGTH_10000} characters long.`,
      'string.empty': 'Content is not allowed to be empty.',
    }),
})