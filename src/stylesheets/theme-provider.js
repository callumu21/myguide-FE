import { createTheme } from "@rneui/themed"

const theme = createTheme({
    components: {
        Button: {
            raised: true,
            containerStyle: {
                margin: 5,
                width: '60%',
                alignContent: 'center',
            }
        }
    }
  })

export default theme