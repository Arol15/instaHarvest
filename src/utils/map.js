export const parseLocation = ({ result }) => {
  const location = {};
  location.lgt = result.geometry.coordinates[0];
  location.lat = result.geometry.coordinates[1];
  const placeType = result.place_type;

  console.log(result);

  if (!result.context && placeType.includes("country")) {
    location.country = result.place_name_en;
    return location;
  }

  result.context.forEach((elem) => {
    if (elem.id.includes("country")) {
      location.country = elem.text_en;
    } else if (elem.id.includes("region") && elem.short_code.includes("US")) {
      location.state = elem.text_en;
    } else if (elem.id.includes("place")) {
      location.city = elem.text_en;
    } else if (elem.id.includes("postcode")) {
      location.zip_code = elem.text_en;
    }

    if (!location.city) {
      if (placeType.includes("place")) {
        location.city = result.text_en;
      }
    }

    if (!location.address) {
      if (placeType.includes("address")) {
        location.address = result.place_name_en.slice(
          0,
          result.place_name_en.indexOf(",")
        );
      }
    }
  });

  return location;
};
