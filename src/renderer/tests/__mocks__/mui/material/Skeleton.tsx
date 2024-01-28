jest.mock('@mui/material/Skeleton', () => ({
  __esModule: true,
  default: (props: any) => (
    <div {...props} style={{}}>
      Skeleton:Mock
    </div>
  )
}))
