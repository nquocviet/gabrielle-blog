import React from 'react'
import Link from 'next/link'

type TCardSecondaryProps = {
  _id: string
  creator: any
  title: string
  topic: any
}

export const CardSecondary = ({
  _id,
  creator,
  title,
  topic,
}: TCardSecondaryProps) => {
  return (
    <Link href={`/${creator.username}/post/${String(_id)}`}>
      <a className="flex flex-col gap-1 p-4 transition-colors duration-200 hover:bg-gray-50">
        <p className="line-clamp-3">{title}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {topic.map((topic) => (
            <span className="text-sm text-gray-500">
              #{topic.label.toLowerCase()}
            </span>
          ))}
        </div>
      </a>
    </Link>
  )
}