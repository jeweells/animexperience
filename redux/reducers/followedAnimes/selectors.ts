import { useAppSelector } from '../../utils'
import { formatKeys } from '../../../src/hooks/useStaticStore'

export const useFollowedByName = (name: string) =>
    useAppSelector((s) => s.followedAnimes.followedDict[formatKeys([name])])
