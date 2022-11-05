import React, { useEffect, useState } from "react";
import { DataGrid, GridApi, GridCellValue, GridColDef } from "@mui/x-data-grid";
import Loader from "../../../components/loader";
import { useActions } from "../../../hooks/useActions";
import { useTypedSelector } from "../../../hooks/useTypedSelector";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Grid, TablePagination } from "@mui/material";
import Paper from "@mui/material/Paper";

export class CurrentPaginations {
  public start: number;
  public end: number;
  public isAll: boolean;

  constructor(start: number, end: number, isAll: boolean) {
    this.start = start;
    this.end = end;
    this.isAll = isAll;
  }
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "right",
  color: theme.palette.text.secondary,
  height: "700px",
}));

const Users: React.FC<any> = () => {
  const { GetAllUsers, SelectdUser } = useActions();
  const { loading, allUsers } = useTypedSelector((state) => state.UserReducer);

  let rows: any[] = allUsers;
  const [page, setPage] = useState(0);
  const [rowsPerPage, SetRowsPerPage] = useState(10);
  const [isRedirect, setIsRedirect] = useState(false);

  useEffect(() => {
    GetAllUsers(getCurrentPaginations(page, rowsPerPage));
  }, []);

  const columns: GridColDef[] = [
    { field: "surname", headerName: "Surname", width: 230 },
    { field: "name", headerName: "Name", width: 170 },
    { field: "email", headerName: "Email", width: 230 },
    { field: "phoneNumber", headerName: "Phone", width: 230 },
    { field: "emailConfirmed", headerName: "Confirmed email", width: 130 },
    { field: "role", headerName: "Role", width: 130 },
    {
      field: "id",
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );
          const userData = thisRow;
          SelectdUser(userData);
          setIsRedirect(true);
        };

        return <Button onClick={onClick}>Edit</Button>;
      },
    },
  ];

  function getCurrentPaginations(
    currentPage: number,
    rowsperPage: number
  ): CurrentPaginations {
    return new CurrentPaginations(
      currentPage * rowsperPage,
      (currentPage + 1) * rowsperPage,
      false
    );
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);

    const pag = getCurrentPaginations(newPage, rowsPerPage);

    GetAllUsers(pag);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let rows = parseInt(event.target.value);
    SetRowsPerPage(rows);
    setPage(0);
    const pag = getCurrentPaginations(0, rows);

    GetAllUsers(pag);
  };

  if (loading) {
    return <Loader />;
  }

  if (isRedirect) {
    return <Navigate to="/dashboard/userDetails" />;
  }

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ mb: 2, textAlign: "right" }}>
          <Button variant="contained">
            <Link
              style={{ textDecoration: "none", color: "#fff" }}
              to="/dashboard/register"
            >
              Add new user
            </Link>
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <DataGrid
              initialState={{
                sorting: {
                  sortModel: [{ field: "surname", sort: "asc" }],
                },
              }}
              rows={rows}
              columns={columns}
              pageSize={rowsPerPage}
              checkboxSelection
              hideFooterPagination={true}
              hideFooter={true}
            />
          </Item>

          <TablePagination
            component="div"
            count={allUsers.length + 10}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Users;
