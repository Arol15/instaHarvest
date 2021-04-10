//to use Mapbox
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import "./map.css";

const Map = () => {
  const calculateWidth = () => {
    return `${window.innerWidth * 0.8}px`;
  };
  const [viewport, setViewport] = useState({
    latitude: 26.0112,
    longitude: -80.1495,
    width: calculateWidth,
    height: "40vh",
    zoom: 11,
  });

  useEffect(() => {
    const updateWidth = () => {
      setViewport({ ...viewport, width: calculateWidth() });
    };

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div className="map">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/akovalyo/cknc722s923lu17oqqd3cincn"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        markers here
      </ReactMapGL>
    </div>
  );
};

export default Map;
