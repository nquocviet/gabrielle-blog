import React from 'react'
import {
  BookmarkIcon,
  DotsHorizontalIcon,
  DuplicateIcon,
  HeartIcon,
} from '@heroicons/react/outline'
import { Container } from '@components/Layout'
import { Dropdown, Menu, MenuItem } from '@components/Dropdown'
import Link from 'next/link'
import DOMPurify from 'dompurify'
import { getFormattedDate, parseMarkdown } from '@utils/utils'
import { Button } from '@components/Button'
import { ImageRatio } from '@components/ImageRatio'
import { CardSecondary } from '@components/Card'
import { useCurrentUser } from '@lib/user'
import { TopicAnchor } from '@components/Topic'

const MoreOptionsDropdown = () => {
  return (
    <Menu className="w-[250px]" position="left-0 top-full">
      <MenuItem>
        <span className="font-bold">Copy Link</span>
        <DuplicateIcon className="h-6 w-6" />
      </MenuItem>
      <MenuItem>Report Abuse</MenuItem>
    </Menu>
  )
}

const PostDetail = ({
  title,
  topic,
  content,
  cover,
  creator,
  readingTime,
  likesCount,
  bookmarksCount,
  createdAt,
  morePostsFromThisUser,
  morePostsFromCommunity,
}) => {
  const { data: { user } = {} } = useCurrentUser()

  return (
    <div className="bg-gray-300/10 py-4">
      <Container>
        <div className="flex flex-col items-stretch pb-8 sm:flex-row">
          <div className="relative pb-4 sm:z-elevate sm:w-16 sm:pr-4 ">
            <div className="static top-24 mt-8 flex flex-row items-center justify-center gap-4 rounded-md border border-gray-300 bg-white py-2 sm:sticky sm:flex-col sm:border-transparent sm:bg-transparent sm:py-0">
              <button className="group inline-flex flex-1 flex-row items-center justify-center sm:flex-auto sm:flex-col">
                <span className="inline-block rounded-full p-2 transition-colors group-hover:bg-red-100 group-hover:text-red-700">
                  <HeartIcon className="h-6 w-6" />
                </span>
                <span>{likesCount}</span>
              </button>
              <button className="group inline-flex flex-1 flex-row items-center justify-center sm:flex-auto sm:flex-col">
                <span className="inline-block rounded-full p-2 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                  <BookmarkIcon className="h-6 w-6" />
                </span>
                <span>{bookmarksCount}</span>
              </button>
              <Dropdown
                className="inline-flex flex-1 justify-center sm:flex-auto"
                overlay={MoreOptionsDropdown()}
              >
                <button>
                  <DotsHorizontalIcon className="h-6 w-6" />
                </button>
              </Dropdown>
            </div>
          </div>
          <div className="flex w-full flex-col items-stretch gap-y-4 lg:flex-row">
            <div className="w-full lg:w-2/3">
              <div className="rounded-md border border-gray-300 bg-white shadow">
                {cover && (
                  <ImageRatio
                    src={cover}
                    className="w-full"
                    alt="Post thumbnail"
                    ratio={2.5}
                  />
                )}
                <div className="px-6 py-6 sm:px-12">
                  <div className="flex items-center gap-4 pb-6">
                    <ImageRatio
                      className="w-10 rounded-full"
                      src={creator.profilePicture}
                    />
                    <div className="flex flex-col">
                      <div className="text-lg font-bold">
                        {creator.username}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <span>Posted on {getFormattedDate(createdAt)}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-800"></span>
                        <span>{readingTime} min read</span>
                      </div>
                    </div>
                  </div>
                  <h1 className="mb-2 text-5xl font-bold leading-tight">
                    {title}
                  </h1>
                  <div className="flex gap-1">
                    {topic.map((topic) => (
                      <TopicAnchor key={topic.value} {...topic} />
                    ))}
                  </div>
                  <div className="mt-8 text-lg">
                    <div
                      className="markdown-container"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(parseMarkdown(content)),
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full px-0 lg:w-1/3 lg:px-4">
              <div className="static top-24 flex flex-col items-stretch gap-4 lg:sticky">
                <div className="overflow-hidden rounded-md border border-gray-300 bg-white shadow">
                  <div
                    className="h-8"
                    style={{ backgroundColor: creator.backdrop }}
                  ></div>
                  <div className="-mb-8 -translate-y-8 p-4">
                    <div className="relative flex items-end gap-2 pb-6">
                      <Link href={`/${creator.username}`}>
                        <a>
                          <ImageRatio
                            src={creator.profilePicture}
                            className="w-12 rounded-full bg-white"
                            alt="Post thumbnail"
                          />
                        </a>
                      </Link>
                      <Link href={`/${creator.username}`}>
                        <a className="text-xl font-bold line-clamp-1">
                          {creator.username}
                        </a>
                      </Link>
                    </div>
                    {user && user.username === creator.username ? (
                      <Button
                        variant="secondary"
                        as="a"
                        href="/settings"
                        className="rounded-md py-2"
                        fluid
                      >
                        Edit profile
                      </Button>
                    ) : (
                      <Button
                        variant="tertiary"
                        className="rounded-md py-2"
                        fluid
                      >
                        Follow
                      </Button>
                    )}

                    <div className="py-4">{creator.position}</div>
                    <div className="text-sm font-bold uppercase">Joined</div>
                    <div>{getFormattedDate(creator.createdAt)}</div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-md border border-gray-300 bg-white shadow">
                  <header className="p-4">
                    {morePostsFromThisUser && (
                      <h2 className="text-xl font-bold">
                        More from{' '}
                        <Link href={`/${creator.username}`}>
                          <a className="text-tertiary-500">
                            {creator.username}
                          </a>
                        </Link>
                      </h2>
                    )}
                    {morePostsFromCommunity && (
                      <h2 className="text-xl font-bold">
                        Trending on{' '}
                        <Link href="/">
                          <a className="text-tertiary-500">
                            Gabrielle Community
                          </a>
                        </Link>
                      </h2>
                    )}
                  </header>
                  <div className="flex flex-col items-stretch">
                    {morePostsFromThisUser &&
                      morePostsFromThisUser.map((post) => (
                        <CardSecondary key={post._id} {...post} />
                      ))}
                    {morePostsFromCommunity &&
                      morePostsFromCommunity.map((post) => (
                        <CardSecondary key={post._id} {...post} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default PostDetail
