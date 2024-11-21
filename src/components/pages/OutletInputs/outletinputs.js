import * as React from "react";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Stack, Button, Modal, Box, Typography } from "@mui/material";
import axios from "axios";

export default function OUTLET() {
  const [branches, setBranches] = React.useState([
    "S&R ALABANG",
    "S&R NUVALI",
    "S&R BACOOR",
    "S&R IMUS",
    "S&R KAWIT",
    "S&R SUCAT",
    "S&R PARANAQUE",
    "S&R ASEANA",
    "S&R FORT",
    "S&R SHAW",
    "S&R CIRCUIT",
    "S&R COMMONWEALTH",
    "S&R CONGRESSIONAL",
    "S&R MARIKINA",
    "S&R C5 LIBIS",
    "S&R PAMPANGA",
    "S&R DAU",
    "S&R CEBU",
    "S&R ILOILO",
    "S&R LIPA",
    "S&R LUCENA",
    "S&R MALOLOS",
    "S&R NAGA",
    "S&R BACOLOD",
    "S&R CABANATUAN",
    "S&R CALASIAO",
    "S&R CDO",
    "S&R DAVAO"
  ]);

  const [inventoryCount, setInventoryCount] = React.useState({});
  const [selectedBranch, setSelectedBranch] = React.useState(null); // Branch for the modal
  const [users, setUsers] = React.useState([]); // Users to display in the modal
  const [open, setOpen] = React.useState(false); // Modal open state

  const getToday = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Returns date in YYYY-MM-DD format
  };

  const fetchInventoryCount = async () => {
    const today = getToday();
    const data = { selectDate: today };

    try {
      const response = await axios.post(
        "http://192.168.50.55:8080/filter-date",
        data
      );
      const inventoryData = response.data.data;
      const counts = {};

      inventoryData.forEach((item) => {
        const branch = item.accountNameBranchManning;
        if (branch) {
          counts[branch] = (counts[branch] || 0) + 1;
        }
      });
      

      setInventoryCount(counts);
    } catch (error) {
      console.error("Error fetching inventory count:", error);
    }
  };

  const fetchUsersByBranch = async (branch) => {
    try {
      const response = await axios.post(
        "http://192.168.50.55:8080/get-users-by-branch",
        { branch }
      );
      const users = response.data.users;
  
      // Map users to include branch explicitly
      const userBranchMap = users.map((user) => ({
        id: user._id,
        name: user.name,
        branch: user.accountNameBranchManning // Include branch explicitly
      }));
  
      // Set users for the modal
      setUsers(userBranchMap);
      setSelectedBranch(branch);
      setOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  

  React.useEffect(() => {
    fetchInventoryCount(); // Fetch data when the component mounts
  }, []);

  const rows = branches.map((accountNameBranchManning, index) => ({
    id: index + 1,
    branchName: accountNameBranchManning,
    count: inventoryCount[accountNameBranchManning] || 0, // Show 0 if no inventory
    date: getToday(),
  }));

  const columns = [
    { field: "id", headerName: "#", width: 75, headerClassName: "bold-header" },
    {
      field: "branchName",
      headerName: "ACCOUNT BRANCH",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "count",
      headerName: "INVENTORY COUNT (Today)",
      width: 250,
      headerClassName: "bold-header",
    },
    {
      field: "date",
      headerName: "DATE",
      width: 200,
      headerClassName: "bold-header",
    },
    {
      field: "viewUsers",
      headerName: "MERCHANDISERS",
      width: 160,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => fetchUsersByBranch(params.row.branchName)}
          style={{ backgroundColor: "#1a1447", color: "#ffffff" }} // Green color with white text
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="attendance">
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
          <Stack
            direction={{ xs: "column", md: "row", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
          ></Stack>
          <DataGrid
            rows={rows}
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
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 30, 50, 100]}
            getRowId={(row) => row.id}
          />

          {/* Modal to display users */}
          <Modal open={open} onClose={() => setOpen(false)}>
  <Box
    sx={{
      padding: 4,
      backgroundColor: "white",
      margin: "auto",
      width: "50%"
    }}
  >
    <Typography variant="h6">
      Merchandisers for Branch: {selectedBranch}
    </Typography>
    <ul>
      {users.length > 0 ? (
        users.map((user) => (
          <li key={user.id}>
            {user.name} - Branch: {user.branch}
          </li>
        ))
      ) : (
        <Typography>No users available for this branch</Typography>
      )}
    </ul>
    <Button onClick={() => setOpen(false)}>Close</Button>
  </Box>
</Modal>

        </div>
      </div>
    </div>
  );
}
