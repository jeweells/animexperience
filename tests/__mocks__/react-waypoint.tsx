import React from 'react'
import type { Waypoint } from 'react-waypoint'
import { WAYPOINT } from '@selectors'

const WaypointComponent: React.FC<Waypoint.WaypointProps> = (props) => {
    return (
        <div
            data-testid={WAYPOINT.DIV}
            onScroll={() => {
                props.onEnter?.({
                    currentPosition: '',
                    previousPosition: '',
                    waypointTop: 0,
                    viewportTop: 0,
                    viewportBottom: 0,
                })
            }}
        >
            [Waypoint]
        </div>
    )
}
WaypointComponent.displayName = 'WaypointMock'

jest.mock('react-waypoint', () => ({
    __esModule: true,
    ...jest.requireActual('react-waypoint'),
    Waypoint: WaypointComponent,
}))
