import React from "react";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function createData(
  name: string,
  surname: string,
  email: string,
  phone: string,
  emailConfirm: string,
  role: string
) {
  return { name, surname, email, phone, emailConfirm, role };
}

const UserInformation: React.FC = () => {
  const { user } = useTypedSelector((store) => store.UserReducer);
  const rows = [
    createData(
      user.Name,
      user.Surname,
      user.Email,
      user.PhoneNumber,
      user.EmailConfirm,
      user.role
    ),
  ];
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Surname</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Phone</TableCell>
            <TableCell align="center">Confirm email</TableCell>
            <TableCell align="center">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.name}
              </TableCell>
              <TableCell align="center">{row.surname}</TableCell>
              <TableCell align="center">{row.email}</TableCell>
              <TableCell align="center">{row.phone}</TableCell>
              <TableCell align="center">{row.emailConfirm}</TableCell>
              <TableCell align="center">{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserInformation;
