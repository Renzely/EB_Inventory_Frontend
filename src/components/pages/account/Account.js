import "./account.css";
import * as React from "react";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbar,
} from "@mui/x-data-grid";
import axios, { isAxiosError } from "axios";
import { Button, Stack, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDemoData } from "@mui/x-data-grid-generator";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Autocomplete } from "@mui/material";

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

export default function Account() {
  const { data, loading } = useDemoData({
    dataSet: "Commodity",
    rowLength: 4,
    maxColumns: 6,
  });

  const [userData, setUserData] = React.useState([]);

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const [updateStatus, setUpdateStatus] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");
  var test = "testing";

  const requestBody = { isActivate: updateStatus, emailAddress: userEmail };

  const [modalFullName, setModalFullName] = React.useState("");
  const [modalBranch, setModalBranch] = React.useState("");
  const [modalEmail, setModalEmail] = React.useState("");
  const [modalPhone, setModalPhone] = React.useState("");

  const [openDialog, setOpenDialog] = React.useState(false);
  const roleAccount = localStorage.getItem("roleAccount"); // Get roleAccount from localStorage
  const allowedRoles = ["ACCOUNT SUPERVISOR", "OPERATION OFFICER", "OPERATION HEAD", "COORDINATOR"];
const isAllowed = allowedRoles.includes(roleAccount); // Check if role is allowed


  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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

  ]); //Branches

  // State for the second modal
  const [openBranchModal, setOpenBranchModal] = React.useState(false);
  const handleOpenBranchModal = () => setOpenBranchModal(true);
  const handleCloseBranchModal = () => setOpenBranchModal(false);

  // State for selected branches
  const [selectedBranches, setSelectedBranches] = React.useState([]);

  // Update the branch of the user with the selected branches
  // Update the branch of the user with the selected branches
  const handleBranchSave = async () => {
    try {
      // Update the user's branches with the selected branches
      const response = await axios.put(
        "http://192.168.50.55:8080/update-user-branch",
        {
          emailAddress: modalEmail,
          branches: selectedBranches,
        }
      );

      console.log("User branches updated:", response.data);

      // Update the branch field in the userData state
      const updatedUserData = userData.map((user) => {
        if (user.emailAddress === modalEmail) {
          return {
            ...user,
            Branch: selectedBranches.join(", "), // Update the Branch field
          };
        }
        return user;
      });

      setUserData(updatedUserData); // Set the updated userData state

      // After successful update, you might want to refresh the user data
      getUser();
      setTimeout(() => window.location.reload(), 1000);
      handleCloseBranchModal(); // Close the branch selection modal after saving
    } catch (error) {
      console.error("Error updating user branches:", error);
    }
  };

  const columns = [
    { field: "count", headerName: "#", width: 100 },
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
      field: "username",
      headerName: "Username",
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
      field: "remarks",
      headerName: "Remarks",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "contactNum",
      headerName: "Contact Number",
      width: 150,
      headerClassName: "bold-header",
    },
    {
      field: "Branch",
      headerName: "Account Name Branch",
      width: 250,
      headerClassName: "bold-header",
    },
    {
      field: "isActive",
      headerName: "Status",
      headerClassName: "bold-header",
      width: 150,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const status = params.row.isActive;
        const rowEmail = params.row.emailAddress;
        const roleAccount = localStorage.getItem("roleAccount"); // Get role from localStorage

        const onClick = (e) => {
          if (allowedRoles.includes(roleAccount)) {
            setUpdateStatus(params.row.isActive ? false : true); // Set status based on current state
            setUserEmail(params.row.emailAddress);
            handleOpenDialog(); // Open the dialog
          }
        };

        return (
          <>
            {status ? (
              <Stack>
                <ColorButton
                  variant="contained"
                  size="small"
                  style={{
                    width: "50%",
                    marginTop: "13px",
                    backgroundColor: "#90EE90",
                    color: "#000000",
                  }}
                  onClick={onClick}
                  disabled={!isAllowed}
                >
                  Active
                </ColorButton>
              </Stack>
            ) : (
              <Stack>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  style={{ width: "50%", marginTop: "13px" }}
                  onClick={onClick}
                  disabled={!isAllowed}
                >
                  Inactive
                </Button>
              </Stack>
            )}
          </>
        );
      },
    },
    {
      field: "action",
      headerClassName: "bold-header",
      headerName: "Action",
      width: 90,
      sortable: false,
      disableClickEventBubbling: true,

      renderCell: (params) => {
        const onClick = (e) => {
          let mFullname = params.row.firstName + " " + params.row.lastName;
          let condition = params.row.middleName;
          let mBranch = params.row.Branch;
          let mEmail = params.row.emailAddress;
          let mPhone = params.row.contactNum;
          if (condition === "Null") {
            mFullname = params.row.firstName + " " + params.row.lastName;
          } else {
            mFullname =
              params.row.firstName +
              " " +
              params.row.middleName +
              " " +
              params.row.lastName;
          }

          setModalFullName(mFullname);
          setModalBranch(mBranch);
          setModalEmail(mEmail);
          setModalPhone(mPhone);

          return handleOpen();
        };

        return (
          <Stack>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={onClick}
              style={{
                width: "50%",
                marginTop: "13px",
                backgroundColor: "#008000",
                color: "#FFFFF",
              }}
            >
              View
            </Button>
          </Stack>
        );
      },
    },
  ];

  async function getUser() {
    await axios
      .post(
        "http://192.168.50.55:8080/get-all-user",
        requestBody
      )
      .then(async (response) => {
        const data = await response.data.data;

        const newData = data.map((data, key) => {
          return {
            count: key + 1,
            remarks: data.remarks,
            firstName: data.firstName,
            middleName: data.middleName ? data.middleName : "Null",
            lastName: data.lastName,
            username: data.username,
            Branch: data.accountNameBranchManning,
            emailAddress: data.emailAddress,
            contactNum: data.contactNum,
            isActive: data.isActivate,
          };
        });
        console.log(newData, "testing par");
        setUserData(newData);
      });
  }

  async function setStatus() {
    console.log("check body", requestBody);
    await axios
      .put(
        "http://192.168.50.55:8080/update-status",
        requestBody
      )
      .then(async (response) => {
        const data = await response.data.data;

        console.log(data, "status info");
        window.location.reload();
      });
  }

  React.useEffect(() => {
    getUser();
    if (Array.isArray(modalBranch)) {
      setSelectedBranches(modalBranch); // Pre-select branches based on modalBranch
    }
  }, [modalBranch]);

  return (
    <div className="account">
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ height: "100%", width: "85%", marginLeft: "100" }}>
          <DataGrid
            rows={userData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
              columns: {
                columnVisibilityModel: {
                  // Hide columns status and traderName, the other columns will remain visible
                  address: false,
                  phone: false,
                },
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
            loading={!userData.length}
            disableDensitySelector
            disableColumnFilter
            disableColumnSelector
            pageSizeOptions={[5, 10, 20, 50, 100, 200]}
            getRowId={(row) => row.count}
            disableRowSelectionOnClick
          />
        </div>

        <Modal
  open={openModal}
  onClose={handleCloseDialog}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Full Details :
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      <span className="detailTitle">Full name:</span>
      <span className="detailDescription">{modalFullName}</span>
      <br />
      <span className="detailTitle">Email:</span>
      <span className="detailDescription">{modalEmail}</span>
      <br />
      <span className="detailTitle">Contact Number:</span>
      <span className="detailDescription">{modalPhone}</span>
      <br />
      <span className="detailTitle">Account Branch Name:</span>
      <span className="detailDescription">
        {Array.isArray(modalBranch) 
          ? modalBranch.join(", ") // Join with a comma and space if it's an array
          : modalBranch}
      </span>
      <br />
      <br />
      {/* Button to open branch selection modal */}
      <Button
        variant="contained"
        onClick={handleOpenBranchModal}
        disabled={!isAllowed} 
      >
        Select Branch
      </Button>
    </Typography>
    <Stack>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Stack>
  </Box>
</Modal>

<Dialog
  open={openBranchModal}
  onClose={handleCloseBranchModal}
  aria-labelledby="branch-dialog-title"
  aria-describedby="branch-dialog-description"
  fullWidth
  maxWidth="md"
>
  <DialogTitle id="branch-dialog-title">Select Branch</DialogTitle>
  <DialogContent>
    <Autocomplete
      multiple
      id="branches-autocomplete"
      options={branches}
      defaultValue={selectedBranches}
      onChange={(event, value) => setSelectedBranches(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label="Select Branch"
          placeholder="Select Branch"
        />
      )}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseBranchModal}>Cancel</Button>
    <Button onClick={handleBranchSave} autoFocus>
      Save
    </Button>
  </DialogActions>
</Dialog>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Account Activation"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {updateStatus
                ? "Are you sure you want to set this user as active?"
                : "Are you sure you want to set this user as inactive?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={setStatus} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#000",
  backgroundColor: "#F6FAB9",
  "&:hover": {
    backgroundColor: "#CAE6B2",
  },
}));
