//to use Mapbox 
import {useState} from "react";
import ReactMapGL, {Marker} from 'react-map-gl'; 


const Map = () => {

    const [viewport, setViewport] = useState({
        latitude: 26.0112, 
        longitude: -80.1495, 
        width: "100vw", 
        height: "100vh", 
        zoom: 8
    })
    return (
        <div>
            <ReactMapGL {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            onViewportChange={viewport => {
                setViewport(viewport)
            }}
            >
                markers here
            </ReactMapGL>
        </div>
    )
}

export default Map; 