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

    // Format the date as MM-DD-YYYY
    const formattedDate = format(dateObj, 'MM-dd-yyyy');

    // Format the time as HH:mm (12-hour format)
    const formattedTime = format(dateObj, 'h:mm a');

    return isTimeIn ? { date: formattedDate, time: formattedTime } : { date: formattedDate, time: formattedTime };
  };
  

  // Fetch attendance data for the specific user
  async function fetchAttendanceData(emailAddress) {
    try {
      const response = await axios.post(
        "http://192.168.50.55:8080/get-attendance",
        { userEmail: emailAddress }
      );
      let data = response.data.data;
      
      console.log("Raw attendance data:", data);
      
      // Get today's date in the formatted form
      const today = new Date();
      const formattedTodayDate = formatDateTime(today).date;
    
      console.log("Checking for today's entry...");
      const hasTodayEntry = data.some(
        (item) => formatDateTime(item.date)?.date === formattedTodayDate
      );
    
      // if (!hasTodayEntry) {
      //   console.log("Adding placeholder entry for today");
      //   data.unshift({
      //     _id: "placeholder", // Placeholder ID
      //     date: today,
      //     timeLogs: [
      //       {
      //         timeIn: null,
      //         timeOut: null,
      //         timeInLocation: "No location",
      //         timeOutLocation: "No location",
      //       },
      //     ],
      //     accountNameBranchManning: "Unknown Outlet",
      //   });
      // }
    
      console.log("After adding placeholder:", data);
      console.log('Received attendance data:', response.data.data);
  
      // Format data including timeLogs for each day entry
      const formattedData = data.flatMap((item) => {
        // For each timeLog in the timeLogs array, create a row
        return item.timeLogs.map((timeLog, index) => {
          const formattedDate = formatDateTime(item.date);
          const formattedTimeIn = formatDateTime(timeLog.timeIn);
          const formattedTimeOut = formatDateTime(timeLog.timeOut);
  
          return {
            ...item,
            date: formattedDate.date || "N/A",
            timeIn: formattedTimeIn.time || "No Time In",
            timeOut: formattedTimeOut.time || "No Time Out",
            timeInLocation: timeLog.timeInLocation || "No location",
            timeOutLocation: timeLog.timeOutLocation || "No location",
            accountNameBranchManning: item.accountNameBranchManning || "Unknown Outlet",
            count: index + 1, // Assign count based on the index of the timeLog
          };
        });
      });
  
      console.log("Formatted data:", formattedData);
  
      // Sort data by date in descending order
      formattedData.sort((b, a) => new Date(a.date) - new Date(b.date));
  
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
    { field: "count", headerName: "#", width: 100, headerClassName: "bold-header" },
    { field: "date", headerName: "DATE", width: 120, headerClassName: "bold-header" },
    { field: "timeIn", headerName: "TIME IN", width: 120, headerClassName: "bold-header" },
    { field: "timeInLocation", headerName: "TIME IN LOCATION", width: 330, headerClassName: "bold-header" },
    { field: "timeOut", headerName: "TIME OUT", width: 120, headerClassName: "bold-header" },
    { 
      field: "timeOutLocation", 
      headerName: "TIME OUT LOCATION", 
      width: 330, 
      headerClassName: "bold-header",
    },
    
    { field: "accountNameBranchManning", headerName: "OUTLET", width: 180, headerClassName: "bold-header" },
    // {
    //   field: "currentAttendance",
    //   headerName: "",
    //   width: 250,
    //   renderCell: (params) => {
    //     if (params.row.count === 1) {
    //       return (
    //         <span style={{ color: 'green', fontWeight: 'bold' }}>
    //           CURRENT ATTENDANCE
    //         </span>
    //       );
    //     }
    //     return "";
    //   },
    //   headerClassName: "bold-header",
    // },
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
          <Box sx={{ height: 400, width: "100%" }}>
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
