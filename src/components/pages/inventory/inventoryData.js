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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";

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

export default function Inventory() {
  const [userData, setUserData] = React.useState([]);
  const [dateFilter, setDateFilter] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [dateBegin, setDateBegin] = React.useState(null);
  const [dateEnd, setDateEnd] = React.useState(null);
  const [sheetData, setSheetData] = React.useState(null);
  const XLSX = require("sheetjs-style");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    {
      field: "accountNameBranchManning",
      headerName: "OUTLET",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "period",
      headerName: "WEEKS COVERED",
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
        const expiryFields = params.value;
        if (Array.isArray(expiryFields) && expiryFields.length > 0) {
          return (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {expiryFields.map((field, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  {`MONTH: ${field.expiryMonth} PCS: ${field.expiryPcs} ||`}
                </div>
              ))}
            </div>
          );
        }
        return "No expiry fields";
      },
      valueFormatter: (params) => {
        // Preprocess the expiryFields array for CSV export
        const expiryFields = params.value;
        if (Array.isArray(expiryFields) && expiryFields.length > 0) {
          return expiryFields
            .slice(0, 6) // Limit to 6 entries, if necessary
            .map(
              (field) => `MONTH: ${field.expiryMonth}, PCS: ${field.expiryPcs}`
            )
            .join(" | ");
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
    },
  ];

  async function getUser() {
    try {
      const loggedInBranch = localStorage.getItem("accountNameBranchManning");

      if (!loggedInBranch) {
        console.error("No branch information found for the logged-in admin.");
        return;
      }

      const response = await axios.post(
        "https://engkanto.onrender.com/inventory-data"
      );

      const data = response.data.data;

      const filteredData = data.filter(
        (item) =>
          loggedInBranch.split(",").includes(item.accountNameBranchManning) &&
          item.userEmail !== "ynsonharold@gmail.com"
      );

      function parseDate(dateStr) {
        if (!dateStr) return new Date("Invalid Date");

        // Check if format is yyyy-mm-dd
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return new Date(dateStr);
        }

        // Check if format is dd-mm-yyyy
        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split("-").map(Number);
          return new Date(year, month - 1, day); // Month is 0-indexed
        }

        // Fallback for unknown formats
        console.error("Unknown date format:", dateStr);
        return new Date("Invalid Date");
      }

      const sortedData = filteredData.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);

        if (isNaN(dateA) || isNaN(dateB)) {
          console.error("Invalid date detected:", a.date, b.date);
          return 0; // Keep original order if any date is invalid
        }

        return dateB - dateA; // Descending (latest first)
      });

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
          inventoryDaysLevel: value(data.status, data.inventoryDaysLevel)
            ? Math.round(value(data.status, data.inventoryDaysLevel)) // Round IDL
            : "", // Handle empty or invalid values
          noOfDaysOOS: value(data.status, data.noOfDaysOOS),
          remarksOOS: data.remarksOOS,
          expiryFields: data.expiryFields, // Ensure expiryFields is included
        };
      });

      console.log(newData, "mapped data");
      setUserData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async function getDate(selectedDate) {
    const data = { selectDate: selectedDate };
    await axios
      .post("https://engkanto.onrender.com/filter-date", data)
      .then(async (response) => {
        const data = await response.data.data;
        console.log(data, "test");

        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

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
          };
        });

        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  React.useEffect(() => {
    getUser();
  }, []);

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
        "https://engkanto.onrender.com/export-inventory-data",
        {
          start: bDate,
          end: eDate,
        }
      );

      const headers = [
        "Date",
        "Outlet",
        "SKU",
        "Beginning",
        "Ending",
        "Offtake",
        "Inventory Days Level",
        "Expiry Fields",
      ];

      const newData = response.data.data
        .sort((a, b) => {
          const parseDate = (dateStr) => {
            const [day, month, year] = dateStr.split("-").map(Number); // Split and convert to numbers
            return new Date(year, month - 1, day); // Month is 0-indexed
          };

          const dateA = parseDate(a.date);
          const dateB = parseDate(b.date);

          // Check for invalid dates
          if (isNaN(dateA) || isNaN(dateB)) {
            console.error("Invalid date detected:", a.date, b.date);
            return 0; // Keep the original order if invalid
          }

          return dateB - dateA; // Sort in descending order
        })
        .map((item, key) => ({
          date: item.date,
          accountNameBranchManning: item.accountNameBranchManning,
          skuDescription: item.skuDescription,
          beginning: item.beginning,
          ending: item.ending,
          offtake: item.offtake,
          inventoryDaysLevel: item.inventoryDaysLevel
            ? Math.round(item.inventoryDaysLevel) // Rounds to the nearest whole number
            : "",
          expiryFields: item.expiryFields
            ? item.expiryFields
                .map(
                  (field) =>
                    `${field.expiryMonth || ""}: ${field.expiryPcs || ""}`
                )
                .join(", ")
            : "",
        }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);

      // Add headers and data
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
      XLSX.utils.sheet_add_json(ws, newData, {
        origin: "A2",
        skipHeader: true,
      });

      // Calculate dynamic column widths for SKU and Inventory Days Level
      const colWidths = headers.map((header, index) => {
        if (header === "SKU" || header === "Inventory Days Level") {
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

      XLSX.utils.book_append_sheet(wb, ws, "Inventory_Data");

      const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `INVENTORY_DATA_ENGKANTO_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
      alert("Error exporting data. Please try again.");
    }
  };

  return (
    <div className="attendance">
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ height: "100%", width: "85%" }}>
          <Stack
            direction={{ xs: "column", md: "row", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            sx={{ marginBottom: "20px" }}
          >
            <div className="MuiStack-root">
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
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            disableDensitySelector
            pageSizeOptions={[5, 10, 20, 30, 50, 100]}
            getRowId={(row) => row.count}
          />
        </div>
      </div>
    </div>
  );
}
