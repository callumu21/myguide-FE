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
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 100,
            paddingLeft: 20,
            width: 30,
        }
    }
  })

export default theme