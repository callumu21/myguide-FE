import { createTheme } from "@rneui/themed"

const theme = createTheme({
    components: {
        Button: {
            raised: true,
            color: "rgb(236, 114, 114)",
            containerStyle: {
                margin: 5,
                width: '60%',
                alignSelf: 'center',
            }
        },
        Input: {
            color: 'white'
        }
    }
  })

export default theme