import { Icon, Text, ListItem, Image } from "@rneui/themed"
import { useEffect, useState } from "react";
import { Linking, ScrollView } from "react-native";
import { getSitesByTour } from "../../utils/api";
import Loading from "../../utils/Loading";

const SitesTab = ({tourData}) => {

    const [siteInfo, setSiteInfo] = useState()
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        const getSiteInfo = async () => {
            const tourSites = await getSitesByTour(tourData.tourSites);
            setSiteInfo(tourSites)
            setIsLoading(false)
            }
        getSiteInfo()
    }, [])

    if(isLoading) return <Loading loadMessage={`Loading sites...`} />
    
    return <ScrollView>
    {siteInfo.map(({siteId, siteName, siteDescription, siteImage, siteAddress, contactInfo, websiteLink}) => (
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
    ))}
    </ScrollView>
}
export default SitesTab