import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  Avatar,
  TableRow,
  TableBody,
  TableCell,
  Link,
  TableContainer,
  Box,
  FormControl,
  Typography,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import FriendStatus from "./FriendStatus";
import ActionButton from "./ActionButton";
import { useDispatch } from "react-redux";
import { getFriendRequestSent, getUsers } from "./friendSlice";

function UserTable({ users, filterName, page, rowsPerPage }) {
  const { user } = useAuth();
  const currentUserId = user._id;

  const getActionAndStatus = (targetUser) => {
    const props = {
      currentUserId: currentUserId,
      targetUserId: targetUser._id,
      friendship: targetUser.friendship,
    };
    return {
      status: <FriendStatus {...props} />,
      action: <ActionButton {...props} />,
    };
  };

  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  useEffect(() => {
    if (status === "request_sent") {
      dispatch(
        getFriendRequestSent({
          filterName,
          page: page + 1,
          limit: rowsPerPage,
        }),
      );
    }
    if (status === "all") {
      dispatch(getUsers({ filterName, page: page + 1, limit: rowsPerPage }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <Box sx={{ overflow: "auto" }}>
      <TableContainer sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: { sx: "20%", sm: "25%" } }}>
                Name
              </TableCell>
              <TableCell sx={{ width: { sx: "20%", sm: "25%" } }}>
                Email
              </TableCell>
              <TableCell sx={{ width: { sx: "20%", sm: "25%" } }}>
                Job Title
              </TableCell>
              <TableCell sx={{ width: { sx: "20%", sm: "25%" } }}>
                <FormControl fullWidth>
                  <Stack direction="row" spacing={2}>
                    <Typography fontSize="inherit">Status</Typography>
                    <select id="status" value={status} onChange={handleChange}>
                      <option value="all">All</option>
                      <option value="request_sent">Request sent</option>
                    </select>
                  </Stack>
                </FormControl>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const { status, action } = getActionAndStatus(user);
              return (
                <TableRow key={user._id} hover>
                  <TableCell
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar
                      alt={user.name}
                      src={user.avatarUrl}
                      sx={{ mr: 2 }}
                    />
                    <Link
                      variant="subtitle2"
                      sx={{ fontWeight: 600 }}
                      component={RouterLink}
                      to={`/user/${user._id}`}
                    >
                      {user.name}
                    </Link>
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    {user.jobTitle}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                  >
                    {status}
                  </TableCell>
                  <TableCell align="left">{action}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UserTable;
