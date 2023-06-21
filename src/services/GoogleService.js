const GoogleService = (() => {
  const getCoordinates = ({ address }) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder
        .geocode({ address })
        .then((res) => {
          if (!res.results.length)
            reject({ message: "Failed to get coordinates" });
          const coordinates = {
            lat: res.results[0].geometry.location.lat(),
            lng: res.results[0].geometry.location.lng(),
          };
          resolve(coordinates);
        })
        .catch(() => reject({ message: "Failed to get coordinates" }));
    });
  };

  return { getCoordinates };
})();

export default GoogleService;
