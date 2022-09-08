import { Icon, Text, ListItem, Image } from "@rneui/themed"
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { getSitesById } from "../../utils/api";

const SitesTab = ({tourData: {tourSites}}) => {

    const [siteInfo, setSiteInfo] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [expanded, setExpanded] = useState({})
    
    useEffect(() => {
        const getSiteInfo = async () => {
            const tourSites = await getSitesById();
            setSiteInfo(tourSites)
            setIsLoading(false)
            }
        getSiteInfo()
    }, [])

    if(isLoading) return <Text>Loading sites...</Text>
    return siteInfo.map(({siteId, siteName, siteDescription, siteImage, siteAddress, contactInfo, websiteLink}) => (
        <ListItem key={siteId} bottomDivider>
                <Image source={{uri:siteImage}} style={{height: 100, width: 100}}/>
                <ListItem.Content>
                <ListItem.Title>{siteName}</ListItem.Title>
                <Text>{siteDescription}</Text>
                <Text>{siteAddress}</Text>
                <Text>{contactInfo}</Text>
                <Text style={{color: 'blue'}} onPress={() => Linking.openURL(websiteLink)}>
                    Visit Website
                </Text>
                </ListItem.Content>
            </ListItem>
    ))
}
export default SitesTab