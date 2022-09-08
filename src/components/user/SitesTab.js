import { Icon, Text, ListItem } from "@rneui/themed"
import { useEffect, useState } from "react";
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
                <ListItem.Content>
                <ListItem.Title>{siteName}</ListItem.Title>
                <ListItem.Subtitle><Text>{siteDescription}</Text></ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
    ))
}
export default SitesTab