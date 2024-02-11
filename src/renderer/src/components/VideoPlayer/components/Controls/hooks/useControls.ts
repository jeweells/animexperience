import { useContext } from 'react'
import { Context } from '../context'
import { ControlsContext } from '../types'

export const useControls = (): ControlsContext => useContext(Context)
