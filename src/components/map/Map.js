import { useState, useEffect, useMemo, useRef } from "react";
import useSupercluster from "use-supercluster";
import { useSelector } from "react-redux";

import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";

import { selectProducts } from "../../store/productsSlice";
import mapboxgl from "mapbox-gl";
import { arrangeMarkers } from "../../utils/map";
import "./map.css";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Map = () => {
  const productsData = useSelector(selectProducts);

  const calculateWidth = () => {
    return `${window.innerWidth * 0.8}px`;
  };

  const mapRef = useRef();

  const [viewport, setViewport] = useState({
    latitude: productsData.location.lat,
    longitude: productsData.location.lon,
    width: calculateWidth,
    height: "40vh",
    zoom: 12,
  });

  // const goToMarker = (lat, lon) => {
  //   setViewport({...viewport, latitude: lat, longitude: lon, zoom: 9})
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

  const bounds = mapRef.current
    ? mapRef.current.getMap().getBounds().toArray().flat()
    : null;

  const { clusters, supercluster } = useSupercluster({
    points: productsData.products,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const renderOneMarker = (type, id, lon, lat) => {
    //tmp, `image` will be replaced with properties.product_icon
    let image = "https://instaharvest.net/assets/images/icons/fruits.png";
    if (type == "Vegetable") {
      image = "https://instaharvest.net/assets/images/icons/vegetables.png";
    } else if (type == "Herb") {
      image = "https://instaharvest.net/assets/images/icons/herbs.png";
    }
    //
    return (
      <Marker key={`point-${id}`} longitude={lon} latitude={lat}>
        <img className="map-marker" src={image} />
      </Marker>
    );
  };

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
          const [lon, lat] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;
          if (isCluster) {
            if (viewport.zoom >= 16) {
              const children = supercluster.getLeaves(cluster.id);

              // if markers have same coordinates
              const newMarkers = arrangeMarkers(children, lon, lat);
              return newMarkers.map((marker) => {
                return renderOneMarker(
                  marker.properties.product_type,
                  marker.properties.product_id,
                  marker.geometry.coordinates[0],
                  marker.geometry.coordinates[1]
                );
              });
              // return;
            }
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                latitude={lat}
                longitude={lon}
              >
                <div
                  className="map-cluster-marker"
                  style={{
                    width: `${
                      10 + (pointCount / productsData.products.length) * 20
                    }px`,
                    height: `${
                      10 + (pointCount / productsData.products.length) * 20
                    }px`,
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      16
                    );

                    setViewport({
                      ...viewport,
                      latitude: lat,
                      longitude: lon,
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
          return renderOneMarker(
            cluster.properties.product_type,
            cluster.properties.product_id,
            lon,
            lat
          );
        })}
      </ReactMapGL>
    </div>
  );
};

export default Map;
