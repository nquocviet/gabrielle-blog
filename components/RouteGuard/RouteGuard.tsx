import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCurrentUser } from '@lib/user'

const RouteGuard = ({ children }) => {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const { data: { user } = {} } = useCurrentUser()

  useEffect(() => {
    authCheck(router.asPath)
    const hideContent = () => setAuthorized(false)

    router.events.on('routeChangeStart', hideContent)
    router.events.on('routeChangeComplete', authCheck)

    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }
  }, [user])

  const authCheck = (url) => {
    const privatePaths = ['/write', '/bookmark', '/settings']
    const path = url.split('?')[0]
    if (!user && privatePaths.includes(path)) {
      setAuthorized(false)
      router.push({
        pathname: '/login',
        query: { returnUrl: path },
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized && children
}

export default RouteGuard
