function getDistance({ coord1, coord2 }) {
  const pi = 0.017453292519943295;
  const cos = Math.cos;
  const a =
    0.5 -
    cos((coord2.lat - coord1.lat) * pi) / 2 +
    (cos(coord1.lat * pi) *
      cos(coord2.lat * pi) *
      (1 - cos((coord2.lng - coord1.lng) * pi))) /
      2;

  return 12742 * Math.asin(Math.sqrt(a));
}

export function calculate({ coord, warehouses }) {
  const sorted = warehouses
    .map((warehouse) => ({
      ...warehouse,
      distance: getDistance({ coord1: coord, coord2: warehouse.coordinates }),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  return sorted;
}

export const downloadFileBlob = ({ data, fileName, fileType }) => {
  const blob = new Blob([data], { type: fileType });
  if (navigator.msSaveBlob) return navigator.msSaveBlob(blob, fileName);
  const a = document.createElement("a");
  a.download = fileName;
  a.href = window.URL.createObjectURL(blob);
  a.click();
  a.remove();
};
