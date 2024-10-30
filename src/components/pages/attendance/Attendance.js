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
      width: 100,
      headerClassName: "bold-header",
    },
    {
      field: "firstName",
      headerName: "First name",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "middleName",
      headerName: "Middle name",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "lastName",
      headerName: "Last name",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "emailAddress",
      headerName: "Email",
      width: 250,
      headerClassName: "bold-header",
    },
    { field: "outlet", headerName: "Outlet", width: 180, headerClassName: "bold-header" }, // New outlet column
    {
      field: "date",
      headerName: "Date",
      width: 180,
      headerClassName: "bold-header",
    },
    {
      field: "timeIn",
      headerName: "Time In",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "timeOut",
      headerName: "Time Out",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "bold-header",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <Stack>
            <Link
              to="/view-attendance"
              state={{ userEmail: params.row.emailAddress }} // Pass email via state
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                size="small"
                style={{ backgroundColor: "#4caf50", color: "#ffffff" }} // Green color with white text
              >
                Attendance
              </Button>
            </Link>
          </Stack>
        );
      },
    },
  ];

// Update the fetchCurrentAttendance function
async function fetchCurrentAttendance(emailAddress) {
  try {
    const response = await axios.post(
      "http://192.168.50.55:8080/get-attendance",
      { userEmail: emailAddress }
    );
    const data = response.data.data;

    if (data.length === 0) {
      return {
        date: "No attendance today",
        timeIn: "No Time In",
        timeOut: "Time Out",
        accountNameBranchManning: ""
      };
    }

    const latestLog = data[data.length - 1];

    const formattedTimeIn = formatDateTime(latestLog.timeIn, true);
    const formattedTimeOut = latestLog.timeOut
      ? formatDateTime(latestLog.timeOut, false)
      : { date: formattedTimeIn.date, time: "Time Out" };

    return {
      date: formattedTimeIn.date,
      timeIn: formattedTimeIn.time,
      timeOut: formattedTimeOut.time,
      accountNameBranchManning: latestLog.accountNameBranchManning
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      date: "Error fetching attendance",
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
        <div style={{ height: "100%", width: "85%", marginLeft: "100" }}>
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
                csvOptions: { disableToolbarButton: false },
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
