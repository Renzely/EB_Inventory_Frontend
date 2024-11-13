import "./RTV.css";
import * as React from "react";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import axios from "axios";
import { Button, Stack, buttonBaseClasses } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}



export default function RTV() {
  const [userData, setUserData] = React.useState([]);
  const [dateFilter, setDateFilter] = React.useState(null);
  const body = { test: "test" };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    { field: "count", headerName: "#", width: 75 },
    {
      field: "date",
      headerName: "DATE",
      width: 150,
      headerClassName: 'bold-header'
    },
    {
      field: "inputId",
      headerName: "RTV NUMBER",
      width: 150,
      headerClassName: 'bold-header'
    },
    {
      field: "merchandiserName",
      headerName: "MERCHANDISER",
      width: 180,
      headerClassName: 'bold-header'
    },
    {
      field: "outlet",
      headerName: "OUTLET",
      width: 150,
      headerClassName: 'bold-header'
    },
    {
      field: "item",
      headerName: "SKU",
      width: 220,
      headerClassName: 'bold-header'
    },
    {
      field: "expiryDate",
      headerName: "EXPIRY DATE",
      width: 200,
      headerClassName: 'bold-header'
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 150,
      headerClassName: 'bold-header'
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      width: 150,
      headerClassName: 'bold-header'
    },
    {
      field: "total",
      headerName: "TOTAL",
      width: 180,
      headerClassName: 'bold-header'
    },
    {
      field: "reason",
      headerName: "REASON",
      width: 150,
      headerClassName: 'bold-header'
    },
    {
      field: "remarks",
      headerName: "REMARKS",
      width: 200,
      headerClassName: 'bold-header'
    },
  

    // {expiryFields
    //   field: "action",
    //   headerName: "Action",
    //   width: 200,
    //   sortable: false,
    //   disableClickEventBubbling: true,

    //   renderCell: (params) => {
    //     const onClick = (e) => {
    //       const currentRow = params.row;
    //       return alert(JSON.stringify(currentRow, null, 4));
    //     };

    //     return (
    //       <Stack>
    //         <Link
    //           to={"/view-parcel"}
    //           state={{ state: params.row.email }}
    //           style={{ textDecoration: "none" }}
    //         >
    //           <Button variant="contained" color="warning" size="small">
    //             View More
    //           </Button>
    //         </Link>
    //       </Stack>
    //     );
    //   },
    // },
  ];

  
  const filterParcelDate = () => {

    //let selectedDate = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', timeZone: 'Asia/Manila'});
    let month = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', timeZone: 'Asia/Manila'});
    let day = new Date(dateFilter.$d).toLocaleString('en-us',{day:'numeric', timeZone: 'Asia/Manila'});
    let year = new Date(dateFilter.$d).toLocaleString('en-us',{year:'numeric', timeZone: 'Asia/Manila'});

    if (month.length === 1) month = '0' + month
    if (day.length === 1) day = '0' + day

    const selectedDate = year + "-" + month + "-" + day
    console.log(selectedDate);
    getDateRTV(selectedDate)
  };


  async function getUser() {
    await axios
        .post("http://192.168.50.55:8080/retrieve-RTV-data")
        .then(async (response) => {
            const data = response.data?.data || [];
            console.log(data, "test");

            // Sort the data in descending order by date, only if data is not empty
            const sortedData = data.length ? data.sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

            const newData = sortedData.map((data, key) => {
                return {
                    count: key + 1,
                    date: data.date,
                    inputId: data.inputId,
                    merchandiserName: data.merchandiserName,
                    UserEmail: data.userEmail,
                    outlet: data.outlet,
                    item: data.item,
                    amount: data.amount,
                    quantity: data.quantity,
                    total: data.total,
                    remarks: data.remarks,
                    reason: data.reason,
                    expiryDate: data.expiryDate,
                };
            });
            console.log(newData, "testing par");
            setUserData(newData);
        })
        .catch((error) => {
            console.error("Error fetching RTV data:", error);
            setUserData([]); // Set to an empty array if there's an error
        });
}


async function getDateRTV(selectedDate) {
    const data = { selectDate: selectedDate };
    await axios
        .post("http://192.168.50.55:8080/filter-RTV-data", data)
        .then(async (response) => {
            const data = await response.data.data;
            console.log(data, "test");

            // Sort the data in descending order by date
            const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

            const newData = sortedData.map((data, key) => {
                return {
                    count: key + 1,
                    date: data.date,
                    inputId: data.inputId,
                    merchandiserName: data.merchandiserName,
                    UserEmail: data.userEmail,
                    outlet: data.outlet,
                    item: data.item,
                    quantity: data.quantity,
                    driverName: data.driverName,
                    plateNumber: data.plateNumber,
                    pullOutReason: data.pullOutReason,
                };
            });
            console.log(newData, "testing par");
            setUserData(newData);
        });
}


  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="attendance">
        <Topbar/>
         <div className="container">
         <Sidebar/>
         
      <div style={{ height: "100%", width: "85%", marginLeft: "100" }}>

      <Stack 
            direction={{ xs: 'column', md: 'row',sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ marginBottom: '20px' }} // Added marginBottom here
            >      

        <div class="MuiStack-root">

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  onChange={(newValue) => setDateFilter(newValue)}
                  slotProps={{ textField: { size: 'small' } }}
                ></DatePicker>
              
              </LocalizationProvider>

              <Button
                onClick={filterParcelDate}
                variant="contained"
                style={{marginLeft: 5}}
              >
                Go
              </Button>

            </div>
            </Stack>
        <DataGrid
          rows={userData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              printOptions: { disableToolbarButton: true },
         
            },
          }}
          //disableDensitySelector
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 20, 30, 50, 100]}
          getRowId={(row) => row.count}
        />
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
    </div>
  );
}
