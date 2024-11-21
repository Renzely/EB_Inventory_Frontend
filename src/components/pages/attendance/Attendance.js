import "./attendance.css";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import { Button, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";


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

const formatDateTime = (dateTime, isTimeIn = false) => {
  if (!dateTime) return isTimeIn ? "No Time In" : "No Time Out"; // Handle null dateTime for timeIn and timeOut
  
  const dateObj = new Date(dateTime);  // This will parse the UTC time and convert it to local time
  
  // Format the date as MM-DD-YYYY
  const formattedDate = `${dateObj.getMonth() + 1}-${dateObj.getDate()}-${dateObj.getFullYear()}`;
  
  // Format the time as HH:mm (24-hour format)
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Convert to 12-hour format with AM/PM
  const [hours, minutes] = time.split(':');
  const hour12Format = `${((+hours + 11) % 12 + 1)}:${minutes} ${+hours >= 12 ? '' : ''}`;

  return isTimeIn 
    ? { date: formattedDate, time: hour12Format } 
    : { date: formattedDate, time: hour12Format };
};

export default function Attendance() {
  const [userData, setUserData] = React.useState([]);

  const body = { test: "test" };
  const [open, setOpen] = React.useState(false);
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
      field: "fullName",
      headerName: "FULL NAME",
      width: 200,
      headerClassName: "bold-header",
    },

    { field: "outlet", headerName: "OUTLET", width: 180, headerClassName: "bold-header" }, // New outlet column
    {
      field: "date",
      headerName: "DATE",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "timeIn",
      headerName: "TIME IN",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "timeOut",
      headerName: "TIME OUT",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "action",
      headerName: "ATTENDANCE HISTORY",
      headerClassName: "bold-header",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Stack style={{ marginTop: 0, alignItems: "center" }}>
            <Link
              to="/view-attendance"
              state={{ userEmail: params.row.emailAddress }} // Pass email via state
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ backgroundColor: "#1a1447", color: "#ffffff" }} // Green color with white text
              >
                VIEW
              </Button>
            </Link>
          </Stack>
        );
      },
    },
  ];

  async function fetchCurrentAttendance(emailAddress, currentDate = new Date()) {
    // Format date as dd-MM-yyyy
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${currentDate.getFullYear()}`;
  
    try {
      const response = await axios.post(
        "http://192.168.50.55:8080/get-attendance",
        { userEmail: emailAddress, date: formattedDate }
      );
      const data = response.data.data;
  
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }
  
      if (data.length === 0) {
        // No logs found, return default values
        return {
          date: formattedDate,
          timeIn: "No Time In",
          timeOut: "No Time Out",
          accountNameBranchManning: ""
        };
      }
  
      const latestLog = data[data.length - 1];
      const latestLogDate = latestLog.date.split('T')[0]; // Assuming date is in ISO format
      const latestFormattedDate = latestLogDate
        .split('-')
        .reverse()
        .join('-'); // Convert to dd-MM-yyyy
  
      let accountNameBranchManning = latestLog.accountNameBranchManning || "";
  
      if (latestFormattedDate !== formattedDate) {
        // New day has started, reset attendance and set branch to "No Branch"
        return {
          date: formattedDate,
          timeIn: "No Time In",
          timeOut: "No Time Out",
          accountNameBranchManning: "No Branch"
        };
      }
  
      if (!latestLog.timeLogs || latestLog.timeLogs.length === 0) {
        return {
          date: formattedDate,
          timeIn: "No Time In",
          timeOut: "No Time Out",
          accountNameBranchManning: accountNameBranchManning
        };
      }
  
      const timeLog = latestLog.timeLogs[latestLog.timeLogs.length - 1];
  
      const timeIn = timeLog.timeIn
        ? formatDateTime(timeLog.timeIn).time
        : "No Time In";
      const timeOut = timeLog.timeOut
        ? formatDateTime(timeLog.timeOut).time
        : "No Time Out";
  
      return {
        date: timeLog.timeIn
          ? timeLog.timeIn.slice(0, 10).split('-').reverse().join('-')
          : formattedDate,
        timeIn: timeIn,
        timeOut: timeOut,
        accountNameBranchManning: accountNameBranchManning
      };
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return {
        date: formattedDate,
        timeIn: "Error",
        timeOut: "Error",
        accountNameBranchManning: ""
      };
    }
  }
  
  

  // Fetch users and their current attendance
  async function getUser() {
    await axios.post("http://192.168.50.55:8080/get-all-user", body)
      .then(async (response) => {
        const data = await response.data.data;
  
        // Fetch attendance data for each user
        const newData = await Promise.all(
          data.map(async (user, key) => {
            const attendance = await fetchCurrentAttendance(user.emailAddress);
            return {
              count: key + 1,
              fullName: `${user.firstName} ${user.lastName}`, 
              firstName: user.firstName,
              middleName: user.middleName || "null",
              lastName: user.lastName,
              emailAddress: user.emailAddress,
              outlet: attendance.accountNameBranchManning || "No Branch", // Display the attendance branch
              date: attendance.date,
              timeIn: attendance.timeIn,
              timeOut: attendance.timeOut,
            };
          })
        );
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
        <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
          <DataGrid
            rows={userData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 20 },
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
            pageSizeOptions={[5, 10, 20, 50, 100]}
            getRowId={(row) => row.count}
            disableDensitySelector
            disableColumnFilter
            disableColumnSelector
          />
        </div>
      </div>
    </div>
  );
}
