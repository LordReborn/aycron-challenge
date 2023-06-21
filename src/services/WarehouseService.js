import { calculate } from "../utils/functions";
import GoogleService from "./GoogleService";

const WarehouseService = (() => {
  const create = (warehouse) => {
    const warehousesStorage = window.localStorage.getItem("warehouses");
    if (!warehousesStorage) {
      window.localStorage.setItem("warehouses", JSON.stringify([warehouse]));
      return Promise.resolve(warehouse);
    }
    const warehouses = JSON.parse(warehousesStorage);
    if (warehouses.some((_warehouse) => _warehouse.code === warehouse.code)) {
      return Promise.reject({ message: "Warehouse code already exist" });
    }
    const newWarehouse = [...warehouses, warehouse];
    window.localStorage.setItem("warehouses", JSON.stringify(newWarehouse));
    return Promise.resolve(warehouse);
  };

  const list = (signal) => {
    const warehousesStorage = window.localStorage.getItem("warehouses");
    if (!warehousesStorage) {
      window.localStorage.setItem("warehouses", JSON.stringify([]));
      return Promise.resolve([]);
    }
    if (signal.aborted) return;
    const warehouses = JSON.parse(warehousesStorage);
    return Promise.resolve(warehouses);
  };

  const nearWarehouses = ({ coord }) => {
    const warehousesStorage = window.localStorage.getItem("warehouses");
    if (!warehousesStorage) {
      return Promise.reject({ message: "Warehouses doesn't exist" });
    }
    const warehouses = JSON.parse(warehousesStorage);
    if (!warehouses.length) {
      return Promise.reject({ message: "Warehouses doesn't exist" });
    }
    return Promise.resolve(calculate({ coord, warehouses }));
  };

  const createMassive = async (warehouses) => {
    const createCoordPromise = ({ warehouse, address, index }) =>
      new Promise((resolve, reject) => {
        const warehouseName =
          warehouse.code || warehouse.name || `line ${index + 1}`;

        GoogleService.getCoordinates({ address })
          .then((coordinates) => resolve({ ...warehouse, coordinates }))
          .catch(() => reject(`Failed to get coordinates in ${warehouseName}`));
      });

    const createWarehousePromise = ({ warehouse, index }) =>
      new Promise((resolve, reject) => {
        const warehouseName =
          warehouse.code || warehouse.name || `line ${index + 1}`;

        WarehouseService.create(warehouse)
          .then((res) => resolve(res))
          .catch((e) =>
            reject(
              `Failed to create warehouse in ${warehouseName}, ${e.message}`
            )
          );
      });

    const promCoordinatesWarehouse = warehouses.map((warehouse, index) => {
      const address = [
        warehouse?.address,
        warehouse?.state,
        warehouse?.country,
        warehouse?.zip,
      ]
        .filter((val) => !!val)
        .join(", ");
      return createCoordPromise({ warehouse, address, index });
    });
    const errors = [];
    const resultCoord = await Promise.allSettled(promCoordinatesWarehouse);
    const successCoord = resultCoord.filter(
      (res) => res.status === "fulfilled"
    );
    const failedCoord = resultCoord.filter((res) => res.status === "rejected");
    failedCoord.forEach((res) => errors.push(res.reason));
    const promCreateWarehouse = successCoord.map(({ value }, index) =>
      createWarehousePromise({ warehouse: value, index })
    );
    const resultWarehouses = await Promise.allSettled(promCreateWarehouse);
    const successWarehouses = resultWarehouses.filter(
      (res) => res.status === "fulfilled"
    );
    const failedWarehouses = resultWarehouses.filter(
      (res) => res.status === "rejected"
    );
    failedWarehouses.forEach((res) => errors.push(res.reason));
    const newWarehouse = JSON.parse(localStorage.getItem("warehouses"));
    const success = successWarehouses.map((res) => res.value);
    return Promise.resolve({ errors, warehouses: newWarehouse, success });
  };

  return { list, create, nearWarehouses, createMassive };
})();

export default WarehouseService;
