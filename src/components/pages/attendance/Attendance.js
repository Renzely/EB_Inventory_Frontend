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

// DateTime Formatter Function (from ViewAttendance.js)
const formatDateTime = (dateTime, isTimeIn = false) => {
  if (!dateTime) return isTimeIn ? "No Time In" : "No Time Out";

  // Create a new Date object with the provided dateTime
  const dateObj = new Date(dateTime);

  // Get the offset in minutes between the local time and UTC
  const offset = dateObj.getTimezoneOffset();

  // Adjust the date object to the correct timezone (UTC+8 for Philippines)
  const adjustedDateObj = new Date(dateObj.getTime() + offset * 60 * 1000);

  // Format the date
  const year = adjustedDateObj.getFullYear();
  const month = String(adjustedDateObj.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDateObj.getDate()).padStart(2, '0');

  const formattedDate = `${month}-${day}-${year}`;

  // Format the time
  const hours = String(adjustedDateObj.getHours()).padStart(2, '0');
  const minutes = String(adjustedDateObj.getMinutes()).padStart(2, '0');
  const ampm = adjustedDateObj.getHours() >= 12 ? 'PM' : 'AM';

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return isTimeIn ? { date: formattedDate, time: formattedTime } : { date: formattedDate, time: formattedTime };
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

 // Function to fetch current attendance for a user
async function fetchCurrentAttendance(emailAddress) {
  try {
    const response = await axios.post(
      "http://192.168.50.55:8080/get-attendance",
      { userEmail: emailAddress }
    );
    const data = response.data.data;

    const today = new Date().toLocaleDateString();

    const todaysAttendance = data.find(
      (item) => new Date(item.date).toLocaleDateString() === today
    );

    if (todaysAttendance) {
      const formattedTimeIn = formatDateTime(todaysAttendance.timeIn, true);
      const formattedTimeOut = todaysAttendance.timeOut
        ? formatDateTime(todaysAttendance.timeOut, false)
        : { date: formattedTimeIn.date, time: "Time Out" }; // If no time out, keep default "Time Out"

      return {
        date: formattedTimeIn.date,
        timeIn: formattedTimeIn.time,
        timeOut: formattedTimeOut.time, // Time out is either the real time or the placeholder text
      };
    }

    return {
      date: "No attendance today",
      timeIn: "No Time In",
      timeOut: "Time Out", // Default when no clock-out has occurred
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      date: "Error fetching attendance",
      timeIn: "Error",
      timeOut: "Error",
    };
  }
}

  // Fetch users and their current attendance
  async function getUser() {
    await axios
      .post("http://192.168.50.55:8080/get-all-user", body)
      .then(async (response) => {
        const data = await response.data.data;

        // Fetch attendance data for each user
        const newData = await Promise.all(
          data.map(async (data, key) => {
            const attendance = await fetchCurrentAttendance(data.emailAddress);

            return {
              count: key + 1,
              firstName: data.firstName,
              middleName: data.middleName ? data.middleName : "null",
              lastName: data.lastName,
              emailAddress: data.emailAddress,
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
