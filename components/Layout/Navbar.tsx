import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Anchor } from '@components/Anchor'
import { Button } from '@components/Button'
import { useCurrentUser } from '@lib/user'
import { fetcher } from '@lib/fetcher'
import { BellIcon } from '@heroicons/react/outline'
import { Dropdown, Menu, MenuDivider, MenuItem } from '@components/Dropdown'
import { ImageRatio } from '@components/ImageRatio'

const MenuDropdown = ({ username, email }, onLogOut) => {
  return (
    <Menu className="w-[250px]">
      <MenuItem href={`/${username}`} as="a">
        <div className="flex flex-col">
          <p className="font-semibold line-clamp-1">{username}</p>
          <span className="text-sm line-clamp-1">{email}</span>
        </div>
      </MenuItem>
      <MenuDivider />
      <MenuItem href="/write" as="a">
        Create Post
      </MenuItem>
      <MenuItem href="/#" as="a">
        Bookmark
      </MenuItem>
      <MenuItem href="/settings" as="a">
        Settings
      </MenuItem>
      <MenuDivider />
      <MenuItem onClick={onLogOut}>Sign Out</MenuItem>
    </Menu>
  )
}

const Navbar = () => {
  const { pathname } = useRouter()
  const { data: { user } = {}, mutate } = useCurrentUser()

  const onLogOut = useCallback(async () => {
    try {
      await fetcher('/api/auth', {
        method: 'DELETE',
      })
      mutate({ user: null })
    } catch (error) {
      console.log(error)
    }
  }, [mutate])

  return (
    <nav className="flex items-center">
      <ul className="flex items-center gap-4 pl-3">
        {!user ? (
          <>
            <li>
              <Anchor href="/login" active={pathname === '/login'}>
                Sign in
              </Anchor>
            </li>
            <li>
              <Button
                href="/register"
                as="a"
                target="_blank"
                className="rounded-3xl px-4 py-2"
              >
                Get in touch
              </Button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Anchor href="/write" active={pathname === '/write'}>
                Write
              </Anchor>
            </li>
            <li>
              <Button
                href="/notifications"
                as="a"
                variant="quaternary"
                className="p-2"
              >
                <BellIcon className="h-6 w-6" />
              </Button>
            </li>
            <li>
              <Dropdown overlay={MenuDropdown(user, onLogOut)}>
                <Button variant="quaternary" className="rounded-full p-1">
                  <ImageRatio
                    className="w-8 rounded-full outline outline-2 outline-gray-200"
                    src={user.profilePicture}
                  />
                </Button>
              </Dropdown>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
