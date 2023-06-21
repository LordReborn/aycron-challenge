import { useState } from "react";
import GoogleService from "../../../services/GoogleService";
import WarehouseService from "../../../services/WarehouseService";

const useCalculate = ({ ref }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coord = await GoogleService.getCoordinates({ address });
      const warehouses = await WarehouseService.nearWarehouses({ coord });

      const map = new window.google.maps.Map(ref.current, {
        center: coord,
        zoom: 1,
        disableDefaultUI: true,
      });
      const bounds = new window.google.maps.LatLngBounds();
      warehouses.forEach((warehouse) => {
        const contentString =
          '<div id="content">' +
          `<p>${warehouse.code} - ${warehouse.name} - ${warehouse.address}, ${warehouse.state}</p>` +
          "</div>";
        const infowindow = new window.google.maps.InfoWindow({
          content: contentString,
        });
        bounds.extend(warehouse.coordinates);
        const marker = new window.google.maps.Marker({
          position: warehouse.coordinates,
          map,
          icon: {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 5,
            strokeWeight: 2,
            strokeColor: "#000",
            fillColor: "#F00",
            fillOpacity: 1,
          },
        });
        marker.addListener("click", () =>
          infowindow.open({
            anchor: marker,
            map,
          })
        );
      });
      new window.google.maps.Marker({
        position: coord,
        map,
        icon: {
          path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 4,
          strokeWeight: 2,
          strokeColor: "#000",
          fillColor: "#00F",
          fillOpacity: 1,
        },
      });
      bounds.extend(coord);
      map.fitBounds(bounds);
    } catch (error) {
      //handleError
    }
  };

  return { address, setAddress, handleSubmit };
};

export default useCalculate;
