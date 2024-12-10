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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
  const [dateBegin, setDateBegin] = React.useState(null);
  const [dateEnd, setDateEnd] = React.useState(null);
  const [sheetData, setSheetData] = React.useState(null);
  const XLSX = require("sheetjs-style");

  const columns = [
    { field: "count", headerName: "#", width: 75 },
    {
      field: "date",
      headerName: "DATE",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "inputId",
      headerName: "RTV NUMBER",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "merchandiserName",
      headerName: "MERCHANDISER",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "outlet",
      headerName: "OUTLET",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "item",
      headerName: "MATERIAL DESCRIPTION",
      width: 220,
      headerClassName: "bold-header",
    },
    {
      field: "expiryDate",
      headerName: "EXPIRY DATE",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "amount",
      headerName: "AMOUNT",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "quantity",
      headerName: "QUANTITY",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "total",
      headerName: "TOTAL",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "reason",
      headerName: "REASON",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "remarks",
      headerName: "REMARKS",
      width: 200,
      headerClassName: "bold-header",
    },
  ];

  const filterParcelDate = () => {
    //let selectedDate = new Date(dateFilter.$d).toLocaleString('en-us',{month:'numeric', timeZone: 'Asia/Manila'});
    let month = new Date(dateFilter.$d).toLocaleString("en-us", {
      month: "numeric",
      timeZone: "Asia/Manila",
    });
    let day = new Date(dateFilter.$d).toLocaleString("en-us", {
      day: "numeric",
      timeZone: "Asia/Manila",
    });
    let year = new Date(dateFilter.$d).toLocaleString("en-us", {
      year: "numeric",
      timeZone: "Asia/Manila",
    });

    if (month.length === 1) month = "0" + month;
    if (day.length === 1) day = "0" + day;

    const selectedDate = year + "-" + month + "-" + day;
    console.log(selectedDate);
    getDateRTV(selectedDate);
  };

  async function getUser() {
    try {
      // Retrieve the logged-in admin's accountNameBranchManning from localStorage
      const loggedInBranch = localStorage.getItem("accountNameBranchManning");

      console.log("Logged in branch:", loggedInBranch); // Debugging line

      if (!loggedInBranch) {
        console.error("No branch information found for the logged-in admin.");
        return;
      }

      // Fetch RTV data
      const response = await axios.post(
        "https://eb-inventory-backend.onrender.com/retrieve-RTV-data"
      );

      const data = response.data?.data || [];
      console.log(data, "test");

      // Filter the data based on the logged-in admin's accountNameBranchManning
      const filteredData = data.filter(
        (item) =>
          loggedInBranch.split(",").includes(item.outlet) &&
          item.userEmail !== "ynsonharold@gmail.com"
      );

      // Sort the filtered data in descending order by date
      const sortedData = filteredData.length
        ? filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];

      // Map the filtered and sorted data
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

      console.log(newData, "mapped RTV data");
      setUserData(newData); // Set the filtered and mapped RTV data for rendering
    } catch (error) {
      console.error("Error fetching RTV data:", error);
      setUserData([]); // Set to an empty array if there's an error
    }
  }

  async function getDateRTV(selectedDate) {
    const data = { selectDate: selectedDate };
    await axios
      .post("https://eb-inventory-backend.onrender.com/filter-RTV-data", data)
      .then(async (response) => {
        const data = await response.data.data;
        console.log(data, "test");

        // Sort the data in descending order by date and reverse the order
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

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

  const getExportData = async () => {
    if (dateBegin === null || dateEnd === null) {
      return alert("Please fill date fields");
    }

    let bDate = dateBegin.$d.getTime();
    let eDate = dateEnd.$d.getTime();

    if (eDate - bDate <= 0) {
      return alert("End date must be ahead of or the same as the start date");
    }

    try {
      const response = await axios.post(
        "https://eb-inventory-backend.onrender.com/export-RTV-data",
        {
          start: bDate,
          end: eDate,
        }
      );

      const headers = [
        "#",
        "Date",
        "RTV Number",
        "Merchandiser Name",
        "Outlet",
        "Material Description",
        "Amount",
        "Quantity",
        "Total",
        "Expiry Date",
        "Remarks",
        "Reason",
      ];

      const newData = response.data.data.map((item, key) => ({
        count: key + 1,
        date: item.date,
        inputId: item.inputId,
        merchandiserName: item.merchandiserName,
        outlet: item.outlet,
        item: item.item,
        amount: item.amount,
        quantity: item.quantity,
        total: item.total,
        expiryDate: item.expiryDate,
        remarks: item.remarks,
        reason: item.reason,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);

      // Add headers and data
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
      XLSX.utils.sheet_add_json(ws, newData, {
        origin: "A2",
        skipHeader: true,
      });

      // Calculate dynamic column widths for MATERIAL DESCRIPTION and Inventory Days Level
      const colWidths = headers.map((header, index) => {
        if (
          header === "MATERIAL DESCRIPTION" ||
          header === "Inventory Days Level"
        ) {
          const maxLength = Math.max(
            header.length, // Length of the header
            ...newData.map(
              (row) => (row[Object.keys(row)[index]] || "").toString().length
            ) // Length of data in the column
          );
          return { wch: maxLength + 6 }; // Add padding for better appearance
        }
        return { wch: Math.max(header.length, 15) }; // Default width for other columns
      });

      ws["!cols"] = colWidths;

      // Apply bold styling to headers
      headers.forEach((_, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
        if (!ws[cellAddress]) return;
        ws[cellAddress].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
        };
      });

      // Apply center alignment to all data cells
      newData.forEach((row, rowIndex) => {
        Object.keys(row).forEach((_, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex + 1,
            c: colIndex,
          }); // Row index starts at 1 for data
          if (!ws[cellAddress]) return;
          ws[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" },
          };
        });
      });

      XLSX.utils.book_append_sheet(wb, ws, "RTV_Data");

      const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `RTV_DATA_ENGKANTO_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error exporting data. Please try again.");
    }
  };

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
            direction={{ xs: "column", md: "row", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ marginBottom: "20px" }} // Added marginBottom here
          >
            <div class="MuiStack-root">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  onChange={(newValue) => setDateBegin(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  onChange={(newValue) => setDateEnd(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>

              <Button
                onClick={getExportData}
                variant="contained"
                sx={{
                  marginLeft: 1, // Equivalent to 5px spacing
                  backgroundColor: "rgb(26, 20, 71)", // Custom background color
                  color: "white", // Text color
                  "&:hover": {
                    backgroundColor: "rgb(40, 30, 100)", // Hover background color
                  },
                }}
              >
                Export
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
                csvOptions: { disableToolbarButton: true },
              },
            }}
            disableDensitySelector
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
