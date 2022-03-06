import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Logo } from '@components/Logo'
import { Button, EButtonRounded, EButtonSizes } from '@components/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { usePrevious } from '@hooks/usePrevious'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import { Form } from '@components/Form'
import { fetcher } from 'lib/fetcher'
import { useCurrentUser } from '@lib/user'
import { useRouter } from 'next/router'

const registrationSteps = [StepOne, StepTwo, StepThree, StepFour]
const SCROLL_UP = 'up'
const SCROLL_DOWN = 'down'

const Register = () => {
  const [started, setStarted] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const prevStep = usePrevious(currentStep)
  const mainRef = useRef<any>(null)
  const scrollDirection = useRef<string>(SCROLL_DOWN)
  const { mutate } = useCurrentUser()
  const route = useRouter()

  useEffect(() => {
    let hold = false

    const fixedNumber = (number: number) => {
      return Number(number.toFixed(0))
    }

    const scrollFullPage = () => {
      let stepScreen
      let sectionHeight
      let step = 1
      let vh = window.innerHeight / 100
      let vmin = Math.min(window.innerHeight, window.innerWidth) / 100

      if (mainRef.current) {
        const mainStyles = window.getComputedStyle(mainRef.current)
        const matrix = new WebKitCSSMatrix(mainStyles.transform)

        sectionHeight = mainRef.current.offsetHeight / vh
        sectionHeight = sectionHeight || mainRef.current.offsetHeight / vmin
        stepScreen = Math.abs(fixedNumber(matrix.m42 / window.innerHeight))
      }

      if (
        scrollDirection.current === SCROLL_UP &&
        stepScreen * 100 <
          fixedNumber(sectionHeight - sectionHeight / registrationSteps.length)
      ) {
        stepScreen += step
      }

      if (scrollDirection.current === SCROLL_DOWN && stepScreen > 0) {
        stepScreen -= step
      }

      if (!hold && started) {
        hold = true
        setCurrentStep(stepScreen)

        setTimeout(function () {
          hold = false
        }, 1000)
      }
    }

    const handleScroll = (event) => {
      if (started) {
        if (event.deltaY < 0) {
          scrollDirection.current = SCROLL_DOWN
        }
        if (event.deltaY > 0) {
          scrollDirection.current = SCROLL_UP
        }
        event.stopPropagation()
      }
    }

    window.addEventListener('wheel', handleScroll)
    window.addEventListener('wheel', scrollFullPage)

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('wheel', scrollFullPage)
    }
  }, [started, scrollDirection])

  const onSubmit = useCallback(
    async (data) => {
      const { email, password, position, interests, username } = data

      try {
        setIsLoading(true)
        const response = await fetcher('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            position,
            interests,
            username,
          }),
        })
        mutate({ user: response.user }, false)
      } catch (e) {
        console.log(e)
      } finally {
        setIsLoading(false)
      }
    },
    [mutate, route]
  )

  const startRegistration = () => {
    setStarted(true)
    setCurrentStep(0)
  }

  return (
    <div className="relative h-screen overflow-hidden">
      <motion.main
        className="px-4 transition-transform duration-500 ease-out"
        initial={started && { translateY: `${(prevStep || 0) * 100}vh` }}
        animate={
          started && {
            translateY: `${currentStep * -100}vh`,
          }
        }
        transition={{ duration: 0.6 }}
        ref={mainRef}
      >
        <Form onSubmit={onSubmit}>
          <AnimatePresence>
            {!started && (
              <motion.div
                className="flex h-screen flex-col items-stretch justify-center text-center"
                key="start"
                initial={{ opacity: 1 }}
                animate={{
                  opacity: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="self-center">
                  <Logo width={240} height={40} />
                </div>
                <div className="flex flex-col items-center gap-4 pt-16">
                  <p className="text-2xl">
                    <strong>Hello</strong> 🙂 It's great to have you around.
                  </p>
                  <p className="pb-4 text-lg text-gray-700">
                    We want to know about you and the type of blog you are
                    looking for.
                  </p>
                  <Button
                    size={EButtonSizes.EXTRA_LARGE}
                    rounded={EButtonRounded.EXTRA_SMALL}
                    onClick={startRegistration}
                    onPressEnter={startRegistration}
                  >
                    Let's talk
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {registrationSteps.map((Step, index) => {
            return (
              <Step
                key={index}
                step={index}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            )
          })}
        </Form>
      </motion.main>
      {started && (
        <div className="fixed bottom-8 right-8 flex items-stretch">
          <Button
            size={EButtonSizes.EXTRA_SMALL}
            rounded={EButtonRounded.NONE}
            className="rounded-tl rounded-bl"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prevState) => prevState - 1)}
          >
            <ChevronUpIcon className="my-0.5 h-5 w-5" />
          </Button>
          <Button
            size={EButtonSizes.EXTRA_SMALL}
            rounded={EButtonRounded.NONE}
            className="rounded-tr rounded-br"
            disabled={currentStep === registrationSteps.length - 1}
            onClick={() => setCurrentStep((prevState) => prevState + 1)}
          >
            <ChevronDownIcon className="my-0.5 h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Register
