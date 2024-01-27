import * as React from 'react'
import { animeSearch } from '@reducers'
import { useAppDispatch, useAppSelector } from '~/redux/utils'
import { TopView } from '@shared/types'
import AnimeSearch from '../AnimeSearch'
import FullModal, { FullModalProps } from '../FullModal'

export type AnimeSearchModalProps = Omit<FullModalProps, 'show' | 'children' | 'view'>

export const AnimeSearchModal: React.FC<AnimeSearchModalProps> = React.memo(({ ...rest }) => {
  const searching = useAppSelector((d) => d.animeSearch.searching)
  const dispatch = useAppDispatch()
  return (
    <React.Fragment>
      <FullModal view={TopView.SEARCH} show={searching} contrast={true} {...rest}>
        <AnimeSearch
          onClose={() => {
            dispatch(animeSearch.setSearching(false))
          }}
        />
      </FullModal>
    </React.Fragment>
  )
})

AnimeSearchModal.displayName = 'AnimeSearchModal'

export default AnimeSearchModal
