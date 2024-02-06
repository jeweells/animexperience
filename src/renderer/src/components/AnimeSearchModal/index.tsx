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
  const handleClose = () => {
    dispatch(animeSearch.setSearching(false))
  }
  return (
    <React.Fragment>
      <FullModal
        view={TopView.SEARCH}
        show={searching}
        contrast={true}
        {...rest}
        onPopRequested={handleClose}
      >
        <AnimeSearch onClose={handleClose} />
      </FullModal>
    </React.Fragment>
  )
})

AnimeSearchModal.displayName = 'AnimeSearchModal'

export default AnimeSearchModal
