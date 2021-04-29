export const parseLocation = ({ result }) => {
  const location = {};
  location.lon = result.geometry.coordinates[0];
  location.lat = result.geometry.coordinates[1];
  const placeType = result.place_type;

  if (!result.context && placeType.includes("country")) {
    location.country = result.place_name;
    return location;
  }

  result.context.forEach((elem) => {
    if (elem.id.includes("country")) {
      location.country = elem.text;
    } else if (elem.id.includes("region") && elem.short_code.includes("US")) {
      location.state = elem.text;
    } else if (elem.id.includes("place")) {
      location.city = elem.text;
    } else if (elem.id.includes("postcode")) {
      location.zip_code = elem.text;
    }

    if (!location.city) {
      if (placeType.includes("place")) {
        location.city = result.text;
      }
    }

    if (!location.address) {
      if (placeType.includes("address")) {
        location.address = result.place_name.slice(
          0,
          result.place_name.indexOf(",")
        );
      }
    }
  });

  return location;
};

export const getBrowserLocation = (successFn, errorFn) => {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(successFn, errorFn, options);
};

export const arrangeMarkers = (markers, lon, lat) => {
  const count = markers.length;
  const twoPi = Math.PI * 2;
  // const circleSpiralSwitch = 9;
  // const circleSeparation = 25;
  // const spiralSeparation = 28;
  // const circle = circleSeparation * (2 + count);
  const angleStep = twoPi / count;
  // const legLength = circle / twoPi;
  const radius = 0.0005;

  const arrangedMarkers = markers.map((marker, ind) => {
    const angle = (ind + 1) * angleStep;
    const newLat = lat + radius * Math.cos(angle);
    const newLon = lon + radius * Math.sin(angle);
    const newMarker = {
      ...marker,
      geometry: { ...marker.geometry, coordinates: [newLon, newLat] },
    };
    return newMarker;
  });
  return arrangedMarkers;
};

export const addressObjToString = (addr) => {
  let res = "";

  console.log(addr);

  res = addr.address && res.concat(addr.address, ", ");
  res = addr.city && res.concat(addr.city, ", ");
  res = addr.us_state && res.concat(addr.us_state, ", ");
  res = addr.country && res.concat(addr.country);
  return res;
};
