import { useState, useEffect, useMemo, useRef } from "react";
import useSupercluster from "use-supercluster";

import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";

import mapboxgl from "mapbox-gl";
import "./map.css";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Map = ({ points, location }) => {
  const calculateWidth = () => {
    return `${window.innerWidth * 0.8}px`;
  };

  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    latitude: location.lat,
    longitude: location.lgt,
    width: calculateWidth,
    height: "40vh",
    zoom: 12,
  });

  // const goToMarker = (lat, lng) => {
  //   setViewport({...viewport, latitude: lat, longitude: lng, zoom: 9})
  // }

  useEffect(() => {
    const updateWidth = () => {
      setViewport({ ...viewport, width: calculateWidth() });
    };

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  // const points = useMemo(
  //   () =>
  //     products.map((prod) => {
  //       console.log("render Marker");

  //       //tmp
  //       let image = "https://instaharvest.net/assets/images/icons/fruits.png";
  //       if (prod.properties.product_type == "Vegetable") {
  //         image = "https://instaharvest.net/assets/images/icons/vegetables.png";
  //       } else if (prod.properties.product_type == "Herb") {
  //         image = "https://instaharvest.net/assets/images/icons/herbs.png";
  //       }
  //       //
  //       return (
  //         <div key={prod.product_id}>
  //           <Marker longitude={prod.address.lgt} latitude={prod.address.lat}>
  //             <img className="map-marker" src={image} />
  //           </Marker>
  //         </div>
  //       );
  //     }),
  //   [products]
  // );

  // const points = useMemo(
  //   () =>
  //     products.map((prod) => {
  //       console.log("render Marker");

  //       let image = "https://instaharvest.net/assets/images/icons/fruits.png";
  //       if (prod.properties.product_type == "Vegetable") {
  //         image = "https://instaharvest.net/assets/images/icons/vegetables.png";
  //       } else if (prod.properties.product_type == "Herb") {
  //         image = "https://instaharvest.net/assets/images/icons/herbs.png";
  //       }
  //       let data = {...prod};
  //       data.properties.icon.iconUrl = image;

  //       return data;
  //     }),
  //   [products]
  // );

  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div className="map">
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/instaharvest/cknmmb38t13xq18lj1i8hgslq"
        onViewportChange={(viewport) => {
          setViewport(viewport);
        }}
      >
        {clusters.map((cluster) => {
          const [lng, lat] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;
          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={lat}
                longitude={lng}
              >
                <div
                  className="map-cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );

                    setViewport({
                      ...viewport,
                      latitude: lat,
                      longitude: lng,
                      zoom: expansionZoom,
                      transitionInterpolator: new FlyToInterpolator({
                        speed: 2,
                      }),
                      transitionDuration: "auto",
                    });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }
          //tmp, `image` will be replaced with properties.product_icon
          let image = "https://instaharvest.net/assets/images/icons/fruits.png";
          if (cluster.properties.product_type == "Vegetable") {
            image =
              "https://instaharvest.net/assets/images/icons/vegetables.png";
          } else if (cluster.properties.product_type == "Herb") {
            image = "https://instaharvest.net/assets/images/icons/herbs.png";
          }
          //
          return (
            <Marker
              key={`crime-${cluster.properties.product_id}`}
              longitude={lng}
              latitude={lat}
            >
              <img className="map-marker" src={image} />
            </Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
};

export default Map;
