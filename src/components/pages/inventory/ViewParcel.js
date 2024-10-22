// import "./parcel.css";
// import * as React from "react";
// import { useLocation } from "react-router-dom";
// import { DataGrid } from "@mui/x-data-grid";
// import axios from "axios";
// import { Button, Stack } from "@mui/material";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import { MapContainer } from "react-leaflet/MapContainer";
// import { TileLayer } from "react-leaflet/TileLayer";
// import "leaflet/dist/leaflet.css";
// import markerIconPng from "leaflet/dist/images/marker-icon.png";
// import { Icon } from "leaflet";
// import { Marker, Popup } from "react-leaflet";

// export default function ViewParcel() {
//   const [userData, setUserData] = React.useState([]);
//   const location = useLocation();
//   const handleClose = () => setOpen(false);
//   const handleOpen = () => setOpen(true);
//   const [open, setOpen] = React.useState(false);
//   const [parcelItem, setParcelItem] = React.useState([]);
//   const [parcelItemBulk, setParcelItemBulk] = React.useState();
//   const [parcelItemNonBulk, setParcelItemNonBulk] = React.useState();
//   const [parcelDate, setParcelDate] = React.useState("");

//   const userEmail = location.state.state;

//   const columns = [
//     { field: "count", headerName: "#", width: 150 },
//     { field: "date", headerName: "Date", width: 225 },
//     { field: "bulk", headerName: "Bulk", width: 225 },
//     { field: "non_bulk", headerName: "Non Bulk", width: 225 },
//     { field: "total", headerName: "Total", width: 200 },
//     {
//       field: "view_more",
//       headerName: "Action",
//       width: 150,
//       sortable: false,
//       disableClickEventBubbling: true,

//       renderCell: (params) => {
//         const onClick = async (e) => {
//           const currentRow = params.row;

//           const modalItemBulk = currentRow.bulk;
//           const modalItemNonBulk = currentRow.non_bulk;
//           const modalParcelDate = await currentRow.date;

//           setParcelItemBulk(modalItemBulk);
//           setParcelItemNonBulk(modalItemNonBulk);

//           const body = { user: userEmail, date: modalParcelDate };

//           await axios
//             .post("http://192.168.50.139:8082/retrieve-parcel-input", body)
//             .then(async (response) => {
//               const data = await response.data.data[0].parcel;
//               console.log(data, "parecl data");
//               const newData = data.map((data, key) => {
//                 return {
//                   //  id: key + 1,
//                   id: "Parcel #" + data.parcel_count,
//                   parcel_type: data.parcel_type,
//                 };
//               });

//               setParcelItem(newData);
//             });

//           handleOpen(true);

//           return;
//         };

//         return (
//           <>
//             <Stack style={{ marginTop: 10 }}>
//               <Button
//                 variant="contained"
//                 color="warning"
//                 size="small"
//                 onClick={() => {
//                   onClick();
//                 }}
//               >
//                 View
//               </Button>
//             </Stack>
//           </>
//         );
//       },
//     },
//   ];

//   async function getUser() {
//     const body = { user: userEmail };

//     await axios
//       .post("http://192.168.50.139:8082/retrieve-user-parcel-data", body)
//       .then(async (response) => {
//         const data = await response.data.data;

//         const newData = data.map((data, key) => {
//           return {
//             count: key + 1,
//             date: data.date,
//             bulk: data.count_bulk,
//             non_bulk: data.count_non_bulk,
//             total: data.count_bulk + data.count_non_bulk,
//           };
//         });
//         console.log(newData, "testing get data");
//         setUserData(newData);
//       });
//   }

//   async function getUserParcel() {}

//   React.useEffect(() => {
//     getUser();
//   }, []);

//   const items = [
//     { id: 1, item: "Paperclip", quantity: 100 },
//     { id: 2, item: "Paper", quantity: 100 },
//     { id: 3, item: "Pencil", quantity: 100 },
//   ];

//   const rows = [
//     ...parcelItem,
//     { id: "BULK", label: "Bulk", bulk: parcelItemBulk },
//     { id: "NON-BULK", label: "Non-Bulk", non_bulk: parcelItemNonBulk },
//     { id: "TOTAL", label: "Total", total: parcelItemBulk + parcelItemNonBulk },
//   ];

//   const baseColumnOptions = {
//     sortable: false,
//     pinnable: false,
//     hideable: false,
//   };

//   const columnss = [
//     {
//       field: "id",
//       headerName: "Parcel Input",
//       ...baseColumnOptions,
//       flex: 3,
//       colSpan: (value, row) => {
//         if (row.id === "BULK" || row.id === "TOTAL") {
//           return 1;
//         }
//         if (row.id === "NON-BULK") {
//           return 1;
//         }
//         return undefined;
//       },
//       valueGetter: (value, row) => {
//         if (row.id === "BULK" || row.id === "NON-BULK" || row.id === "TOTAL") {
//           return row.label;
//         }
//         return value;
//       },
//     },
//     {
//       field: "parcel_type",
//       headerName: "Type",
//       ...baseColumnOptions,
//       flex: 1,
//       ...baseColumnOptions,
//       valueGetter: (value, row) => {
//         if (row.id === "BULK") {
//           return row.bulk;
//         }
//         if (row.id === "NON-BULK") {
//           return row.non_bulk;
//         }
//         if (row.id === "TOTAL") {
//           return row.total;
//         }
//         return row.parcel_type;
//       },
//     },

//     // {
//     //   field: 'id',
//     //   headerName: 'Quantity',

//     //   },
//   ];

//   const getCellClassName = ({ row, field }) => {
//     if (row.id === "SUBTOTAL" || row.id === "TOTAL" || row.id === "TAX") {
//       if (field === "item") {
//         return "bold";
//       }
//     }
//     return "";
//   };

//   return (
//     <div className="parcel">
//       <div style={{ height: 400, width: "100%" }}>
//         <DataGrid
//           rows={userData}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: { page: 0, pageSize: 5 },
//             },
//             columns: {
//               columnVisibilityModel: {},
//             },
//           }}
//           pageSizeOptions={[5, 10]}
//           getRowId={(row) => row.count}
//         />
//       </div>

//       <Modal
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <DataGrid
//             autoHeight
//             disableColumnFilter
//             disableRowSelectionOnClick
//             hideFooter
//             showCellVerticalBorder
//             showColumnVerticalBorder
//             getCellClassName={getCellClassName}
//             columns={columnss}
//             rows={rows}
//             // initialState={{
//             //     pagination: {
//             //       paginationModel: { page: 0, pageSize: 5 },
//             //     },
//             //     columns: {
//             //       columnVisibilityModel: {
//             //        id: false
//             //       },
//             //     },
//             //   }}
//             //  getRowId={(row) =>  row.parcel_count}
//           />
//         </Box>
//       </Modal>
//     </div>
//   );
// }

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 600,
//   height: 600,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };
