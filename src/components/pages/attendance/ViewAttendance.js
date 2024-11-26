import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Typography, Button, Stack } from "@mui/material";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import { format, utcToZonedTime } from "date-fns-tz";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MapIcon from "@mui/icons-material/Map";
import Modal from "@mui/material/Modal";

export default function ViewAttendance() {
  const location = useLocation();
  const [attendanceData, setAttendanceData] = useState([]);
  const [dateBegin, setDateBegin] = React.useState(null);
  const [dateEnd, setDateEnd] = React.useState(null);
  const [sheetData, setSheetData] = React.useState(null);
  const [fullName, setFullName] = useState("");
  const [isVisible, setIsVisible] = useState(false); // Default is false (hidden)
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = React.useState(false);
  const [latitude, setLatitude] = React.useState();
  const [longitude, setLongitude] = React.useState();
  const [city, setCity] = React.useState();
  const [street, setStreet] = React.useState();
  const XLSX = require("sheetjs-style");

  const userEmail = location.state?.userEmail || "";

  // Function to format date and time
  const formatDateTime = (dateTime, isTimeIn = false) => {
    if (!dateTime) return isTimeIn ? "No Time In" : "No Time Out"; // Handle null dateTime for timeIn and timeOut

    const dateObj = new Date(dateTime);

    // Format the date as MM-DD-YYYY
    const formattedDate = format(dateObj, "dd-MM-yyyy");

    // Format the time as HH:mm (12-hour format)
    const formattedTime = format(dateObj, "h:mm a");

    return isTimeIn
      ? { date: formattedDate, time: formattedTime }
      : { date: formattedDate, time: formattedTime };
  };

  // Fetch attendance data for the specific user
  async function fetchAttendanceData(emailAddress) {
    try {
      // Fetch all user data
      const userResponse = await axios.post(
        "https://eb-inventory-backend.onrender.com/get-all-user",
        {}
      );
      const users = userResponse.data.data;

      // Find the user matching the provided email address
      const user = users.find((u) => u.emailAddress === emailAddress);

      if (!user) {
        console.error("User not found for email:", emailAddress);
        return alert("User not found.");
      }

      const { firstName, middleName, lastName } = user;
      const fullName = `${firstName} ${
        middleName ? middleName + " " : ""
      }${lastName}`;

      // Fetch attendance data
      const attendanceResponse = await axios.post(
        "https://eb-inventory-backend.onrender.com/get-attendance",
        { userEmail: emailAddress }
      );
      let data = attendanceResponse.data.data;

      console.log("Raw attendance data:", data);

      // Format data including fullName and timeLogs for each day entry
      const formattedData = data.flatMap((item) => {
        return item.timeLogs.map((timeLog, index) => {
          const formattedDate = formatDateTime(item.date);
          const formattedTimeIn = formatDateTime(timeLog.timeIn);
          const formattedTimeOut = formatDateTime(timeLog.timeOut);

          return {
            ...item,
            fullName, // Add full name here
            date: formattedDate.date || "N/A",
            timeIn: formattedTimeIn.time || "No Time In",
            timeOut: formattedTimeOut.time || "No Time Out",
            timeInLocation: timeLog.timeInLocation || "No location",
            timeOutLocation: timeLog.timeOutLocation || "No location",
            timeInCoordinates: timeLog.timeInCoordinates || {
              latitude: 0,
              longitude: 0,
            },
            timeOutCoordinates: timeLog.timeOutCoordinates || {
              latitude: 0,
              longitude: 0,
            },
            accountNameBranchManning:
              item.accountNameBranchManning || "Unknown Outlet",
            count: index + 1, // Assign count based on the index of the timeLog
          };
        });
      });

      console.log("Formatted data:", formattedData);

      // Sort data by date in descending order
      // Sort data by date in descending order (latest first)
formattedData.sort((a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  
  // First, sort by date in descending order
  if (dateA > dateB) return -1;
  if (dateA < dateB) return 1;
  
  // If dates are equal, sort within each day from newest to oldest
  if (a.timeLogs.length === b.timeLogs.length) {
    return b.timeLogs[b.timeLogs.length - 1].timeIn.localeCompare(a.timeLogs[a.timeLogs.length - 1].timeIn);
  }
  
  // If one day has more entries than the other, put it last
  return a.timeLogs.length - b.timeLogs.length;
});
      console.log("Sorted data:", formattedData);

      // Update the count field to match the sorted order
      formattedData.forEach((item, index) => {
        item.count = index + 1;
      });

      setAttendanceData(formattedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  }

  // Fetch attendance data when userEmail changes
  useEffect(() => {
    if (userEmail) {
      fetchAttendanceData(userEmail);
    }
  }, [userEmail]);

  const columns = [
    {
      field: "count",
      headerName: "#",
      width: 100,
      headerClassName: "bold-header",
    },
    {
      field: "fullName",
      headerName: "MERCHANDISER",
      width: 180,
      headerClassName: "bold-header",
    }, // New column
    {
      field: "date",
      headerName: "DATE",
      width: 120,
      headerClassName: "bold-header",
    },
    {
      field: "timeIn",
      headerName: "TIME IN",
      width: 100,
      headerClassName: "bold-header",
    },
    {
      field: "timeInLocation",
      headerName: "LOCATION",
      headerAlign: "center", // Center header text
      width: 150,
      headerClassName: "bold-header",
      renderCell: (params) => {
        const onClick = async () => {
          const currentRow = params.row;
      
          // Use timeInCoordinates if timeOutCoordinates are not available
          const userLatitude =
            currentRow.timeInCoordinates?.latitude || currentRow.timeOutCoordinates?.latitude;
          const userLongitude =
            currentRow.timeInCoordinates?.longitude || currentRow.timeOutCoordinates?.longitude;
      
          // Validate coordinates before making the API request
          if (!userLatitude || !userLongitude) {
            console.error("Invalid coordinates:", {
              userLatitude,
              userLongitude,
            });
            alert("Unable to retrieve location. Coordinates are missing or invalid.");
            return;
          }
      
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;
      
          try {
            const response = await fetch(url);
            const data = await response.json();
      
            if (data.error) {
              console.error("Error from OpenStreetMap:", data.error);
              alert("Unable to geocode the provided coordinates.");
              return;
            }
      
            // Handle the successful response
            console.log(data);
            setCity(data.address.city || "Unknown City");
            setStreet(data.address.road || "Unknown Street");
            setLatitude(userLatitude);
            setLongitude(userLongitude);
            handleOpen();
          } catch (error) {
            console.error("Error fetching location:", error);
            alert("Unable to fetch location. Please try again.");
          }
        };
      
        return (
          <Stack style={{ marginTop: 10, alignItems: "center" }}>
            <Button
              variant="contained"
              size="small"
              onClick={onClick}
              sx={{
                backgroundColor: "rgb(26, 20, 71)", // Set the background color
                "&:hover": {
                  backgroundColor: "rgb(26, 20, 71)", // Set the hover background color
                },
              }}
            >
              <MapIcon />
            </Button>
          </Stack>
        );
      },
      
    },
    {
      field: "timeOut",
      headerName: "TIME OUT",
      width: 120,
      headerClassName: "bold-header",
    },
    {
      field: "timeOutLocation",
      headerName: "LOCATION",
      width: 150,
      headerClassName: "bold-header",
      headerAlign: "center", // Center header text
      renderCell: (params) => {
        const onClick = async (e) => {
          const currentRow = params.row;

          const userLatitude = currentRow.timeOutCoordinates?.latitude;
          const userLongitude = currentRow.timeOutCoordinates?.longitude;

          // Validate coordinates before making the API request
          if (!userLatitude || !userLongitude) {
            console.error("Invalid coordinates:", {
              userLatitude,
              userLongitude,
            });
            alert(
              "Unable to retrieve location. Coordinates are missing or invalid."
            );
            return;
          }

          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLatitude}&lon=${userLongitude}`;

          try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.error) {
              console.error("Error from OpenStreetMap:", data.error);
              alert("Unable to geocode the provided coordinates.");
              return;
            }

            // Handle the successful response
            console.log(data);
            setCity(data.address.city);
            setStreet(data.address.road);
            setLatitude(userLatitude);
            setLongitude(userLongitude);
            handleOpen();
          } catch (error) {
            console.error("Error fetching location:", error);
            alert("Unable to fetch location. Please try again.");
          }
        };

        return (
          <Stack style={{ marginTop: 10, alignItems: "center" }}>
            <Button
              variant="contained"
              size="small"
              onClick={onClick}
              sx={{
                backgroundColor: "rgb(26, 20, 71)", // Set the background color
                "&:hover": {
                  backgroundColor: "rgb(26, 20, 71)", // Set the hover background color
                },
              }}
            >
              <MapIcon />
            </Button>
          </Stack>
        );
      },
    },

    {
      field: "accountNameBranchManning",
      headerName: "OUTLET",
      width: 180,
      headerClassName: "bold-header",
    },
  ];

  const getExportData = async () => {
    if (!dateBegin || !dateEnd) {
      return alert("Please fill in the date fields.");
    }

    let bDate = dateBegin.$d.getTime();
    let eDate = dateEnd.$d.getTime();

    if (eDate - bDate <= 0) {
      return alert("End date must be the same or later than the start date.");
    }

    try {
      // Fetch user data
      const userResponse = await axios.post(
        "https://eb-inventory-backend.onrender.com/get-all-user",
        {}
      );
      const users = userResponse.data.data;

      // Find the user by email
      const user = users.find((u) => u.emailAddress === userEmail);
      if (!user) {
        alert("User not found.");
        return;
      }

      const fullName = `${user.firstName} ${
        user.middleName ? user.middleName + " " : ""
      }${user.lastName}`;

      // Fetch attendance data
      const response = await axios.post(
        "https://eb-inventory-backend.onrender.com/get-attendance",
        {
          userEmail: userEmail,
        }
      );

      const allData = response.data.data;
      if (!allData || allData.length === 0) {
        alert("No data available for the user.");
        return;
      }

      // Filter data by date range
      const filteredData = allData.filter((item) => {
        const itemDate = new Date(item.date).getTime();
        return itemDate >= bDate && itemDate <= eDate;
      });

      if (filteredData.length === 0) {
        alert("No data available for the selected dates.");
        return;
      }

      const headers = [
        "#",
        "Merchandiser", // Add Full Name header
        "Date",
        "Time In",
        "Time In Location",
        "Time Out",
        "Time Out Location",
        "Account Name/Branch Manning",
      ];

      let counter = 1;

      const newData = filteredData.flatMap((item) =>
        item.timeLogs.map((log) => ({
          count: counter++, // Increment counter for each log
          fullName: fullName, // Add full name to each row
          date: formatDateTime(item.date).date || "N/A",
          timeIn: log.timeIn ? formatDateTime(log.timeIn).time : "No Time In",
          timeInLocation: log.timeInLocation || "No location",
          timeOut: log.timeOut
            ? formatDateTime(log.timeOut).time
            : "No Time Out",
          timeOutLocation: log.timeOutLocation || "No location",
          accountNameBranchManning:
            item.accountNameBranchManning || "Unknown Outlet",
        }))
      );

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([]);

      // Add headers and data
      XLSX.utils.sheet_add_aoa(ws, [headers], { origin: "A1" });
      XLSX.utils.sheet_add_json(ws, newData, {
        origin: "A2",
        skipHeader: true,
      });

      // Calculate dynamic column widths
      const colWidths = headers.map((header, index) => {
        const maxLength = Math.max(
          header.length,
          ...newData.map(
            (row) => (row[Object.keys(row)[index]] || "").toString().length
          )
        );
        return { wch: maxLength + 2 };
      });

      ws["!cols"] = colWidths;

      // Apply bold styling to headers
      headers.forEach((_, index) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
        if (ws[cellAddress]) {
          ws[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      });

      // Apply center alignment to all data cells
      newData.forEach((row, rowIndex) => {
        Object.keys(row).forEach((_, colIndex) => {
          const cellAddress = XLSX.utils.encode_cell({
            r: rowIndex + 1,
            c: colIndex,
          });
          if (ws[cellAddress]) {
            ws[cellAddress].s = {
              alignment: { horizontal: "center", vertical: "center" },
            };
          }
        });
      });

      XLSX.utils.book_append_sheet(wb, ws, "Attendance_Data");

      const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `AttendanceData_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  return (
    <div className="attendance">
      <Topbar />
      <div className="container">
        <Sidebar />
        

          <Typography variant="h4" gutterBottom style={{ display: "none" }}>
            Attendance for {userEmail}
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
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
              style={{ marginLeft: 5 }}
            >
              Export
            </Button>

            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="leaflet-container">
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={17}
                    scrollWheelZoom={false}
                    style={{ height: "100%", minHeight: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[latitude, longitude]}
                      icon={
                        new Icon({
                          iconUrl: markerIconPng,
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                        })
                      }
                    >
                      <Popup>
                        {city}, <br /> {street}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </Box>
            </Modal>
            <div style={{ height: "100%", width: "100%", }}>
            <DataGrid
              rows={attendanceData}
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
          </Box>
  
        
      </div>
    </div>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
