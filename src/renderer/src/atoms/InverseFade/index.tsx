import { Transition } from 'react-transition-group'
import { PropsWithChildren } from 'react'
import { TransitionProps } from 'react-transition-group/Transition'

export const InverseFade = ({
  in: inProp,
  children,
  timeout = 300,
  ...props
}: PropsWithChildren<
  { in: boolean; timeout?: number } & Omit<TransitionProps, 'children' | 'in'>
>) => {
  const defaultStyle = {
    transition: `opacity ${timeout}ms ease-in-out`,
    opacity: 0
  }

  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 0 },
    exiting: { opacity: 1 },
    exited: { opacity: 1 }
  }

  return (
    <Transition in={inProp} timeout={timeout} {...props}>
      {(state) => (
        <div
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  )
}
