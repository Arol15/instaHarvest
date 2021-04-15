export const parseLocation = ({ result }) => {
  const location = {};
  location.lgt = result.geometry.coordinates[0];
  location.lat = result.geometry.coordinates[1];
  console.log(location);
};
