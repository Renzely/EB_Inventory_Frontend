import "./inventoryStyle.css";
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

export default function Inventory() {
  const [userData, setUserData] = React.useState([]);
  const [dateFilter, setDateFilter] = React.useState(null);
  const body = { test: "test" };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  


  const filterParcelDate = () => {

    //let selectedDate = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', timeZone: 'Asia/Manila'});
    let month = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', timeZone: 'Asia/Manila'});
    let day = new Date(dateFilter.$d).toLocaleString('en-us',{day:'numeric', timeZone: 'Asia/Manila'});
    let year = new Date(dateFilter.$d).toLocaleString('en-us',{year:'numeric', timeZone: 'Asia/Manila'});

    if (month.length === 1) month = '0' + month
    if (day.length === 1) day = '0' + day

    const selectedDate = year + "-" + month + "-" + day
    console.log(selectedDate);  
    getDate(selectedDate)
  };


  const columns = [
    {
      field: "count",
      headerName: "#",
      width: 75,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "DATE",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "inputId",
      headerName: "INVENTORY NUMBER",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "MERCHANDISER",
      width: 200,
      headerClassName: "bold-header",
    },
    // {
    //   field: "UserEmail",
    //   headerName: "Email",
    //   width: 300,
    //   headerClassName: "bold-header",
    // },
    {
      field: "accountNameBranchManning",
      headerName: "OUTLET",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "period",
      headerName: "PERIOD",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "month",
      headerName: "MONTH",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "week",
      headerName: "WEEK",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "skuDescription",
      headerName: "SKU",
      width: 280,
      headerClassName: "bold-header",
    },
    {
      field: "skuCode",
      headerName: "4-PACK BARCODE",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "beginningSA",
      headerName: "BEGINNING (Selling Area)",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "beginningWA",
      headerName: "BEGINNING (Warehouse Area)",
      width: 230,
      headerClassName: "bold-header",
    },
    {
      field: "beginning",
      headerName: "TOTAL BEGINNING",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "delivery",
      headerName: "DELIVERY",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "endingSA",
      headerName: "ENDING (Selling Area)",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "endingWA",
      headerName: "ENDING (Warehouse Area)",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "ending",
      headerName: "TOTAL ENDING",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "expiryFields",
      headerName: "EXPIRY FIELDS",
      width: 350,
      headerClassName: "bold-header",
      renderCell: (params) => {
        const expiryFields = params.value; // This is the array of expiry objects
        
        if (Array.isArray(expiryFields) && expiryFields.length > 0) {
          return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {expiryFields.map((field, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "row" }}>
                  {`MONTH: ${field.expiryMonth} PCS: ${field.expiryPcs} ||`}
                </div>
              ))}
            </div>
          );
        }
    
        return "No expiry fields";
      },
    },    
    {
      field: "offtake",
      headerName: "OFFTAKE",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "inventoryDaysLevel",
      headerName: "IDL",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "noOfDaysOOS",
      headerName: "No Of Days OOS",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "remarksOOS",
      headerName: "REMARKS",
      width: 150,
      headerClassName: "bold-header",
    }
  ];

  

  async function getUser() {
    await axios
      .post("http://192.168.50.55:8080/inventory-data")
      .then(async (response) => {
        const data = await response.data.data;
        console.log(data, "backend response");
  
        // Sort the data in descending order by date
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        const newData = sortedData.map((data, key) => {
          const value = (status, defaultValue) => {
            if (status === "Delisted") return "Delisted";
            if (status === "Not Carried") return "NC";
            return defaultValue || 0;
          };
  
          return {
            count: key + 1,
            date: data.date,
            inputId: data.inputId,
            name: data.name,
            UserEmail: data.userEmail,
            accountNameBranchManning: data.accountNameBranchManning,
            period: data.period,
            month: data.month,
            week: data.week,
            skuDescription: data.skuDescription,
            skuCode: data.skuCode,
            status: data.status,
            beginningSA: value(data.status, data.beginningSA),
            beginningWA: value(data.status, data.beginningWA),
            beginning: value(data.status, data.beginning),
            delivery: value(data.status, data.delivery),
            endingSA: value(data.status, data.endingSA),
            endingWA: value(data.status, data.endingWA),
            ending: value(data.status, data.ending),
            offtake: value(data.status, data.offtake),
            inventoryDaysLevel: value(data.status, data.inventoryDaysLevel),
            noOfDaysOOS: value(data.status, data.noOfDaysOOS),
            remarksOOS: data.remarksOOS,
            expiryFields: data.expiryFields, // Ensure expiryFields is included
          };
        });
  
        console.log(newData, "mapped data");
        setUserData(newData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  
  
  
  
  async function getDate(selectedDate) {
    const data = { selectDate: selectedDate };
    await axios
      .post("http://192.168.50.55:8080/filter-date", data)
      .then(async (response) => {
        const data = await response.data.data;
        console.log(data, "test");
  
        // Sort the data in descending order by date
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        const newData = sortedData.map((data, key) => {
          const value = (status, defaultValue) => {
            if (status === "Delisted") return "Delisted";
            if (status === "Not Carried") return "NC";
            return defaultValue || 0;
          };
  
          return {
            count: key + 1,
            date: data.date,
            inputId: data.inputId,
            name: data.name,
            UserEmail: data.userEmail,
            accountNameBranchManning: data.accountNameBranchManning,
            period: data.period,
            month: data.month,
            week: data.week,
            //category: data.category,
            skuDescription: data.skuDescription,
            //products: data.products,
            skuCode: data.skuCode,
            status: data.status,
            beginningSA: value(data.status, data.beginningSA),
            beginningWA: value(data.status, data.beginningWA),
            beginning: value(data.status, data.beginning),
            delivery: value(data.status, data.delivery),
            endingSA: value(data.status, data.endingSA),
            endingWA: value(data.status, data.endingWA),
            ending: value(data.status, data.ending),
            offtake: value(data.status, data.offtake),
            inventoryDaysLevel: value(data.status, data.inventoryDaysLevel),
            noOfDaysOOS: value(data.status, data.noOfDaysOOS),
            remarksOOS: data.remarksOOS,
            //reasonOOS: data.reasonOOS
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
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ height: "100%", width: "85%", marginLeft: "100" }}>

        <Stack 
            direction={{ xs: 'column', md: 'row',sm: 'row' }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ marginBottom: '20px'
             }} // Added marginBottom here
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
