import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '@components/Button'
import { Logo } from '@components/Logo'
import { NavLink } from '@components/NavLink'
import { useLocalUser } from '@hooks/index'
import TwitterLogo from '@public/static/images/twitter-logo.svg'
import DribbbleLogo from '@public/static/images/dribbble-logo.svg'
import InstagramLogo from '@public/static/images/instagram-logo.svg'
import FacebookLogo from '@public/static/images/facebook-logo.svg'
import Container from './Container'

export const socials = [
  {
    slug: '/#',
    img: TwitterLogo,
    label: 'Twitter',
  },
  {
    slug: '/#',
    img: DribbbleLogo,
    label: 'Dribbble',
  },
  {
    slug: '/#',
    img: InstagramLogo,
    label: 'Instagram',
  },
  {
    slug: '/#',
    img: FacebookLogo,
    label: 'Facebook',
  },
]

export const links = [
  {
    slug: '/policy',
    label: 'Privacy Policy',
  },
  {
    slug: '/terms',
    label: 'Terms Of Use',
  },
  {
    slug: '/contact',
    label: 'Contact Us',
  },
]

const Footer = () => {
  const { pathname } = useRouter()
  const localUser = useLocalUser()

  return (
    <footer className="overflow-hidden bg-gray-100">
      {!localUser && (
        <Container>
          <div className="border-divider flex flex-col items-center justify-center border-b py-6 text-center lg:flex-row lg:py-10">
            <h2 className="mr-0 mb-2 text-4xl font-bold lg:mb-0 lg:mr-6">
              Join a network of curious minds.
            </h2>
            <Button
              as="a"
              href="/register"
              target="_blank"
              variant="tertiary"
              className="rounded-3xl px-5 py-2.5"
            >
              Let&apos;s begin
            </Button>
          </div>
        </Container>
      )}
      <Container className="py-6">
        <div className="flex items-end justify-between pb-4 md:flex-row md:items-center">
          <Logo />
          <div className="flex items-center gap-4">
            {socials.map(({ slug, img: Image, label }, index) => (
              <Link href={slug} key={index}>
                <a aria-label={label}>
                  <Image alt="social icon" />
                </a>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            {links.map(({ slug, label }, index) => (
              <NavLink
                key={index}
                href={slug}
                active={pathname === slug}
                className="text-sm"
                suffix={
                  index < links.length - 1 && (
                    <span className="mx-2.5 h-1 w-1 rounded-full bg-gray-700"></span>
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="text-sm">
            &copy; Gabrielle {new Date().getFullYear()}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
