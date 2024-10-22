import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,  } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import { format, utcToZonedTime } from 'date-fns-tz';

export default function ViewAttendance() {
  const location = useLocation();
  const [attendanceData, setAttendanceData] = useState([]);

  const userEmail = location.state?.userEmail || "";

  // Function to format date and time
const formatDateTime = (dateTime, isTimeIn = false) => {
  if (!dateTime) return isTimeIn ? "No Time In" : "No Time Out"; // Handle null dateTime for timeIn and timeOut
  
  const dateObj = new Date(dateTime);
  
  // Get the date and time in ISO format (which is always UTC)
  const isoDate = dateObj.toISOString();
  
  // Extract the date and time part
  const dateParts = isoDate.split('T')[0].split('-'); // Split the date part
  const year = dateParts[0]; // Get full year
  const month = dateParts[1];
  const day = dateParts[2];
  
  const formattedDate = `${month}-${day}-${year}`; // Format date as MM-DD-YYYY
  
  // Extract the time part
  const time = isoDate.split('T')[1].slice(0, 5); // HH:mm in 24-hour format
  
  // Format it back to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour12Format = `${((+hours + 11) % 12 + 1)}:${minutes} ${+hours >= 12 ? 'PM' : 'AM'}`;
  
  return isTimeIn ? { date: formattedDate, time: hour12Format } : { date: formattedDate, time: hour12Format };
};

  

  // Fetch attendance data for the specific user
  async function fetchAttendanceData(emailAddress) {
    try {
      const response = await axios.post(
        "http://192.168.50.55:8080/get-attendance",
        { userEmail: emailAddress }
      );
      let data = response.data.data;

      // Get today's date in the formatted form
      const today = new Date();
      const formattedTodayDate = formatDateTime(today).date;

      // Check if there's an entry for today
      const hasTodayEntry = data.some(
        (item) => formatDateTime(item.date)?.date === formattedTodayDate
      );

      if (!hasTodayEntry) {
        // Add a placeholder entry for today
        data.unshift({
          _id: "placeholder", // Placeholder ID
          date: today,
          timeIn: null,
          timeOut: null,
          timeInLocation: "No location", // Default location for placeholder
          timeOutLocation: "No location", // Default location for placeholder
        });
      }

      // Add a count and format date and time
      const formattedData = data.map((item, index) => {
        const formattedDate = formatDateTime(item.date);
        const formattedTimeIn = formatDateTime(item.timeIn);
        const formattedTimeOut = formatDateTime(item.timeOut);
        return {
          ...item,
          date: formattedDate.date || "N/A",
          timeIn: formattedTimeIn.time || "No Time In",
          timeOut: formattedTimeOut.time || "No Time Out",
          timeInLocation: item.timeInLocation || "No location",
          timeOutLocation: item.timeOutLocation || "No location",
        };
      });

      // Sort data by date in descending order
      formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));

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
    { field: "count", headerName: "#", width: 100, headerClassName: "bold-header" },
    { field: "date", headerName: "Date", width: 200, headerClassName: "bold-header" },
    { field: "timeIn", headerName: "Time In", width: 150, headerClassName: "bold-header" },
    { field: "timeInLocation", headerName: "Location", width: 200, headerClassName: "bold-header" },
    { field: "timeOut", headerName: "Time Out", width: 150, headerClassName: "bold-header" },
    { field: "timeOutLocation", headerName: "Time Out Location", width: 180, headerClassName: "bold-header" },
    {
      field: "currentAttendance",
      headerName: "",
      width: 250,
      renderCell: (params) => {
        if (params.row.count === 1) {
          return (
            <span style={{ color: 'green', fontWeight: 'bold' }}>
              CURRENT ATTENDANCE
            </span>
          );
        }
        return "";
      },
      headerClassName: "bold-header",
    },
  ];

  return (
    <div className="attendance">
      <Topbar />
      <div className="container">
        <Sidebar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Attendance for {userEmail}
          </Typography>
          <Box sx={{ height: 400, width: "99%" }}>
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
          </Box>
        </Box>
      </div>
    </div>
  );
}
