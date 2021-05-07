import { useState, useEffect, useRef } from "react";
import useSupercluster from "use-supercluster";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useScreen } from "../../hooks/hooks";

import ReactMapGL, { Marker, Popup, FlyToInterpolator } from "react-map-gl";
import { ButtonLink } from "../styled/styled";

import { selectProducts, setCurrentProduct } from "../../store/productsSlice";
import mapboxgl from "mapbox-gl";
import { arrangeMarkers } from "../../utils/utils";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map.css";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Map = ({ width }) => {
  const productsData = useSelector(selectProducts);
  const mapRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();
  const { screenWidth, screenHeight } = useScreen();

  const calculateWidth = () => {
    if (width && width + 50 < screenWidth) {
      return width;
    }
    return `${screenWidth * 0.8}px`;
  };

  const calculateHeight = () => {
    return `${0.5 * screenHeight}px`;
  };

  const [viewport, setViewport] = useState({
    latitude: productsData.location.lat,
    longitude: productsData.location.lon,
    width: calculateWidth(),
    height: calculateHeight(),
    zoom: 12,
  });

  const [popup, setPopup] = useState();

  useEffect(() => {
    let height = viewport.height;
    if (Math.abs(parseInt(viewport.height) - screenHeight * 0.5) > 30) {
      height = calculateHeight();
    }
    setViewport({
      ...viewport,
      width: calculateWidth(),
      height: height,
    });
  }, [screenWidth, screenHeight]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setViewport({
      ...viewport,
      zoom: 16,
      latitude: productsData.location.lat,
      longitude: productsData.location.lon,
      transitionInterpolator: new FlyToInterpolator({
        speed: 3,
      }),
      transitionDuration: "auto",
    });
  }, [productsData]);

  const bounds =
    mapRef.current && mapRef.current.getMap()
      ? mapRef.current.getMap().getBounds().toArray().flat()
      : null;

  const { clusters, supercluster } = useSupercluster({
    points: productsData.products,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const handleClick = (prod) => {
    dispatch(setCurrentProduct(prod));
    history.push({
      pathname: "/product-info",
      state: { prevPath: history.location.pathname },
    });
  };

  const openPopup = (marker, lon, lat) => {
    const props = marker.properties;
    setPopup(
      <Popup
        latitude={lat}
        longitude={lon}
        closeButton={true}
        closeOnClick={false}
        onClose={() => setPopup(null)}
        anchor="bottom"
        offsetLeft={30}
      >
        <div className="popup-content">
          <img
            className="popup-content-user-icon"
            src={props.user.image_url}
            alt={props.user.first_name}
          />
          <p>
            <b>{props.name}</b>
          </p>

          <p>{props.description}</p>
          <ButtonLink
            onClick={() => {
              handleClick(marker);
            }}
          >
            Details
          </ButtonLink>
        </div>
      </Popup>
    );
  };

  const renderOneMarker = (marker, lon, lat) => {
    const props = marker.properties;
    return (
      <Marker
        key={`point-${props.product_id}`}
        onClick={() => {
          openPopup(marker, lon, lat);
        }}
        longitude={lon}
        latitude={lat}
      >
        <img className="map-marker" src={props.product_icon} alt="" />
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
                  marker,
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
          return renderOneMarker(cluster, lon, lat);
        })}
        {popup && popup}
      </ReactMapGL>
    </div>
  );
};

export default Map;
