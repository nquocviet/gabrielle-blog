import React from 'react'
import { Input } from '@components/Input'
import StepWrapper, { TStepProps } from './StepWrapper'
import { TitleQuestion } from '@components/Title'
import { useFormContext } from 'react-hook-form'

const StepOne = (props: TStepProps) => {
  const { register } = useFormContext()

  return (
    <StepWrapper {...props}>
      <TitleQuestion
        counter={props.step + 1}
        title={
          <>
            👋 Hi! Please fill in{' '}
            <span className="font-bold">your login information.</span>
          </>
        }
      />
      <Input
        variant="secondary"
        label="Email:"
        placeholder="name@example.com"
        className="mb-4 text-xl"
        error={props.error['email']}
        {...register('email')}
      />
      <Input
        variant="secondary"
        type="password"
        label="Password:"
        placeholder="Must be between 8-24 characters"
        className="mb-4 text-xl"
        error={props.error['password']}
        {...register('password')}
      />
      <Input
        variant="secondary"
        type="password"
        label="Password confirmation:"
        placeholder="Numbers are also allowed"
        className="mb-4 text-xl"
        error={props.error['passwordConfirmation']}
        {...register('passwordConfirmation')}
      />
    </StepWrapper>
  )
}

export default StepOne
