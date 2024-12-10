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
import { format } from "date-fns";

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
  if (!dateTime) return isTimeIn ? "No Time In" : "No Time Out";

  // Create a new Date object with the provided dateTime
  const dateObj = new Date(dateTime);

  // Get the offset in minutes between the local time and UTC
  const offset = dateObj.getTimezoneOffset();

  // Adjust the date object to the correct timezone (UTC+8 for Philippines)
  const adjustedDateObj = new Date(dateObj.getTime() + offset * 60 * 1000);

  // Format the date
  const formattedDate = format(dateObj, "dd-MM-yyyy");

  // Format the time in 12-hour h:mm AM/PM format
  const hours = adjustedDateObj.getHours() % 12 || 12; // Converts 0 to 12 for 12-hour format
  const minutes = String(adjustedDateObj.getMinutes()).padStart(2, "0");
  const ampm = adjustedDateObj.getHours() >= 12 ? "PM" : "AM";

  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return isTimeIn
    ? { date: formattedDate, time: formattedTime }
    : { date: formattedDate, time: formattedTime };
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

    {
      field: "outlet",
      headerName: "OUTLET",
      width: 180,
      headerClassName: "bold-header",
    }, // New outlet column
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

  async function fetchCurrentAttendance(
    emailAddress,
    currentDate = new Date()
  ) {
    // Format date as dd-MM-yyyy
    const formattedDate = `${String(currentDate.getDate()).padStart(
      2,
      "0"
    )}-${String(currentDate.getMonth() + 1).padStart(
      2,
      "0"
    )}-${currentDate.getFullYear()}`;

    try {
      const response = await axios.post(
        "https://eb-inventory-backend.onrender.com/get-attendance",
        { userEmail: emailAddress, date: formattedDate }
      );
      const data = response.data.data;

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      if (data.length === 0) {
        // No logs found, return default values
        return {
          date: formattedDate,
          timeIn: "No Time In",
          timeOut: "No Time Out",
          accountNameBranchManning: "",
        };
      }

      const latestLog = data[data.length - 1];
      const latestLogDate = latestLog.date.split("T")[0]; // Assuming date is in ISO format
      const latestFormattedDate = latestLogDate.split("-").reverse().join("-"); // Convert to dd-MM-yyyy

      let accountNameBranchManning = latestLog.accountNameBranchManning || "";

      if (latestFormattedDate !== formattedDate) {
        // New day has started, reset attendance and set branch to "No Branch"
        return {
          date: formattedDate,
          timeIn: "No Time In",
          timeOut: "No Time Out",
          accountNameBranchManning: "No Branch",
        };
      }

      if (!latestLog.timeLogs || latestLog.timeLogs.length === 0) {
        return {
          date: formattedDate,
          timeIn: "No Time In",
          timeOut: "No Time Out",
          accountNameBranchManning: accountNameBranchManning,
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
          ? timeLog.timeIn.slice(0, 10).split("-").reverse().join("-")
          : formattedDate,
        timeIn: timeIn,
        timeOut: timeOut,
        accountNameBranchManning: accountNameBranchManning,
      };
    } catch (error) {
      console.error("Error fetching attendance:", error);
      return {
        date: formattedDate,
        timeIn: "Error",
        timeOut: "Error",
        accountNameBranchManning: "",
      };
    }
  }

  const capitalizeWords = (words) => {
    if (!words || !Array.isArray(words)) return [];

    return words.map((word) =>
      word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : ""
    );
  };

  async function getUser() {
    try {
      // Fetch the users' data
      const response = await axios.post(
        "https://eb-inventory-backend.onrender.com/get-all-user",
        body
      );
      const data = response.data.data;

      // Retrieve the logged-in admin's branches from localStorage
      const loggedInBranch = localStorage.getItem("accountNameBranchManning");

      if (!loggedInBranch) {
        console.error("No branch information found for the logged-in admin.");
        return;
      }

      // Split the logged-in branches string into an array for comparison
      const loggedInBranches = loggedInBranch
        .split(",")
        .map((branch) => branch.trim());

      // Process users
      const filteredData = await Promise.all(
        data.map(async (user, key) => {
          if (user.emailAddress === "ynsonharold@gmail.com") {
            return null;
          }
          // Fetch attendance for each user
          const attendance = await fetchCurrentAttendance(
            user.emailAddress
          ).catch(() => null);

          // Determine the displayed branch
          let displayedBranch = "No Branch";

          if (attendance && attendance.timeIn) {
            // Check if attendance branch matches admin's branches
            const isBranchMatching = loggedInBranches.some((branch) =>
              attendance.accountNameBranchManning.includes(branch)
            );

            if (isBranchMatching) {
              displayedBranch = attendance.accountNameBranchManning; // Use attendance branch if it matches
            }
          }

          // Exclude users whose branches do not match, even if they have attendance
          if (
            displayedBranch === "No Branch" &&
            !loggedInBranches.some((branch) =>
              user.accountNameBranchManning.includes(branch)
            )
          ) {
            return null; // Exclude this user by returning null
          }

          // Capitalize names
          const capitalizedNames = capitalizeWords([
            user.firstName,
            user.middleName || "",
            user.lastName,
          ]);

          // Include user data with attendance or placeholders
          return {
            count: key + 1,
            fullName: `${capitalizedNames[0]} ${capitalizedNames[2]}`,
            firstName: capitalizedNames[0],
            middleName: capitalizedNames[1] || "Null",
            lastName: capitalizedNames[2],
            emailAddress: user.emailAddress,
            outlet: displayedBranch, // Show branch based on attendance or "No Branch"
            date: attendance?.date || "No Date", // Placeholder if no date is available
            timeIn: attendance?.timeIn || "No Time In", // Placeholder if no timeIn
            timeOut: attendance?.timeOut || "No Time Out", // Placeholder if no timeOut
          };
        })
      );

      // Remove null values (excluded users)
      const validUsers = filteredData.filter((user) => user !== null);

      // Set the filtered data to state
      setUserData(validUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
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
