import { Icon, Text, ListItem, Image } from "@rneui/themed"
import { useEffect, useState } from "react";
import { Linking, ScrollView } from "react-native";
import { getSitesByTour } from "../../utils/api";
import Loading from "../../utils/Loading";

const SitesTab = ({tourData}) => {

    const [siteInfo, setSiteInfo] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [expanded, setExpanded] = useState({})
    
    useEffect(() => {
        const getSiteInfo = async () => {
            const tourSites = await getSitesByTour(tourData.tourSites);
            setSiteInfo(tourSites)
            setIsLoading(false)

            setExpanded(() => {
                const addToExpanded = {}
                tourSites.map(({siteName}) => {
                    addToExpanded[siteName] = false
                })
                return addToExpanded
            })
            }
        getSiteInfo()
    }, [])



    if(isLoading) return <Loading loadMessage={`Loading sites...`} />

    return <ScrollView>
        {siteInfo.map(({siteId, siteName, siteDescription, siteImage, siteAddress, contactInfo, websiteLink}) => (
            <ListItem.Accordion key={siteId}
                content={
                    <>
                        <Icon name="place" size={30} />
                        <ListItem.Content>
                            <ListItem.Title>{siteName}</ListItem.Title>
                        </ListItem.Content>
                    </>
                }
                isExpanded={expanded[siteName]}
                onPress={() => {
                    setExpanded((currExpanded) => {
                        const newExpanded = {...currExpanded}
                        newExpanded[siteName] = !currExpanded[siteName]
                        return newExpanded
                    })
                }}
                >

                <ListItem  bottomDivider>
                    <Image source={{uri:siteImage}} style={{height: 100, width: 100}}/>
                    <ListItem.Content>
                    <Text>{siteDescription}</Text>
                    <Text>{siteAddress}</Text>
                    <Text>{contactInfo}</Text>
                    <Text style={{color: 'blue'}} onPress={() => Linking.openURL(websiteLink)}>
                        Visit Website
                    </Text>
                    </ListItem.Content>
                </ListItem>

            </ListItem.Accordion>
            
        ))}
    </ScrollView>
}
export default SitesTab